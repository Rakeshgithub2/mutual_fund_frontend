import { Router, Request, Response } from 'express';
import { formatResponse } from '../utils/response';
import { analyzeFundOverlap } from '../services/fundOverlapService';

const router = Router();

/**
 * POST /api/overlap
 * Analyze portfolio overlap between multiple funds
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { fundIds } = req.body;

    if (!fundIds || !Array.isArray(fundIds)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Please provide an array of fund IDs',
      });
    }

    if (fundIds.length < 2) {
      return res.status(400).json({
        statusCode: 400,
        message: 'At least 2 funds are required for overlap analysis',
      });
    }

    if (fundIds.length > 10) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Maximum 10 funds can be analyzed at once',
      });
    }

    // Perform overlap analysis
    const analysis = await analyzeFundOverlap({ fundIds });

    return res.json(
      formatResponse(
        {
          analysis,
          analyzedAt: new Date().toISOString(),
        },
        'Portfolio overlap analysis completed successfully'
      )
    );
  } catch (error) {
    console.error('Portfolio overlap analysis error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to analyze portfolio overlap',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
