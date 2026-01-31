import { Router, Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { sendFeedbackNotification } from '../services/feedbackEmailService';

const router = Router();

const mongoUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/mutual_funds_db';

// Submit feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const { feedbackType, rating, name, email, message, userId } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Feedback message is required',
      });
    }

    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const feedbackData = {
      feedbackType: feedbackType || 'general',
      rating: rating || 0,
      name: name || 'Anonymous',
      email: email || null,
      message: message.trim(),
      userId: userId || null,
      status: 'pending', // pending, reviewed, resolved
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await feedbackCollection.insertOne(feedbackData);

    await client.close();

    // Send email notification to admin (non-blocking)
    console.log('📧 Sending feedback notification email...');
    sendFeedbackNotification(
      feedbackData.feedbackType,
      feedbackData.rating,
      feedbackData.name,
      feedbackData.email,
      feedbackData.message,
      feedbackData.userId
    )
      .then((emailResult) => {
        if (emailResult.success) {
          console.log('✅ Feedback email notification sent successfully');
        } else {
          console.warn('⚠️ Failed to send feedback email:', emailResult.error);
        }
      })
      .catch((error) => {
        console.error('❌ Error sending feedback email:', error);
      });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: result.insertedId,
        ...feedbackData,
      },
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all feedback (Admin only)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, skip = 0 } = req.query;

    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const query: any = {};
    if (status) {
      query.status = status;
    }

    const feedback = await feedbackCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .toArray();

    const total = await feedbackCollection.countDocuments(query);

    await client.close();

    res.json({
      success: true,
      data: feedback,
      pagination: {
        total,
        limit: Number(limit),
        skip: Number(skip),
        hasMore: total > Number(skip) + Number(limit),
      },
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get feedback by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID',
      });
    }

    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const feedback = await feedbackCollection.findOne({
      _id: new ObjectId(id),
    });

    await client.close();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update feedback status (Admin only)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID',
      });
    }

    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, reviewed, or resolved',
      });
    }

    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const result = await feedbackCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Delete feedback (Admin only)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid feedback ID',
      });
    }

    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const result = await feedbackCollection.deleteOne({
      _id: new ObjectId(id),
    });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get feedback statistics (Admin only)
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db();
    const feedbackCollection = db.collection('feedback');

    const [total, pending, reviewed, resolved, avgRating, typeStats] =
      await Promise.all([
        feedbackCollection.countDocuments(),
        feedbackCollection.countDocuments({ status: 'pending' }),
        feedbackCollection.countDocuments({ status: 'reviewed' }),
        feedbackCollection.countDocuments({ status: 'resolved' }),
        feedbackCollection
          .aggregate([
            { $match: { rating: { $gt: 0 } } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
          ])
          .toArray(),
        feedbackCollection
          .aggregate([{ $group: { _id: '$feedbackType', count: { $sum: 1 } } }])
          .toArray(),
      ]);

    await client.close();

    res.json({
      success: true,
      data: {
        total,
        byStatus: {
          pending,
          reviewed,
          resolved,
        },
        averageRating: avgRating[0]?.avgRating || 0,
        byType: typeStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
