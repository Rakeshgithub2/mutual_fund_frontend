import { Router, Request, Response } from 'express';
import { formatResponse } from '../utils/response';

const router = Router();

/**
 * POST /api/chat
 * AI chatbot endpoint for mutual fund queries
 *
 * Note: This is a placeholder implementation.
 * Full AI integration requires OpenAI API key in .env
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        statusCode: 400,
        message: 'Please provide a valid message',
      });
    }

    // Check if OpenAI is configured
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

    if (hasOpenAI) {
      // If OpenAI is configured, use the full AI chat service
      try {
        const { processChat } = await import('../ai/chatService');
        const response = await processChat({
          message,
          context: context || {},
        });

        return res.json(
          formatResponse(
            {
              response: response.answer,
              sources: response.sources || [],
              relatedFunds: response.relatedFunds || [],
              followUpQuestions: response.followUpQuestions || [],
            },
            'Chat response generated successfully'
          )
        );
      } catch (error) {
        console.error('AI Chat error:', error);
        // Fall through to simple responses if AI fails
      }
    }

    // Simple rule-based responses (fallback)
    const lowerMessage = message.toLowerCase();
    let response = '';
    const relatedTopics: string[] = [];

    if (lowerMessage.includes('sip') || lowerMessage.includes('systematic')) {
      response =
        'SIP (Systematic Investment Plan) allows you to invest a fixed amount regularly in mutual funds. Benefits include: 1) Rupee cost averaging, 2) Power of compounding, 3) Disciplined investing, 4) Lower risk through regular investments. Start with as little as ₹500 per month!';
      relatedTopics.push('SIP Calculator', 'Best SIP Funds', 'SIP vs Lumpsum');
    } else if (lowerMessage.includes('elss') || lowerMessage.includes('tax')) {
      response =
        'ELSS (Equity Linked Savings Scheme) funds offer tax deductions up to ₹1.5 lakh under Section 80C. They have: 1) 3-year lock-in period (shortest among tax-saving options), 2) Potential for higher returns than PPF/FDs, 3) 100% equity exposure. Good for long-term wealth creation with tax benefits.';
      relatedTopics.push('Top ELSS Funds', 'Tax Calculator', '80C Investments');
    } else if (
      lowerMessage.includes('large cap') ||
      lowerMessage.includes('mid cap') ||
      lowerMessage.includes('small cap')
    ) {
      response =
        'Fund categories: Large Cap (top 100 companies, stable, lower risk), Mid Cap (101-250 companies, balanced risk-return), Small Cap (251+ companies, higher risk, higher potential). Choose based on: 1) Risk appetite, 2) Investment horizon, 3) Financial goals. Beginners should start with Large Cap or Flexi Cap funds.';
      relatedTopics.push(
        'Compare Categories',
        'Risk Assessment',
        'Fund Selection Guide'
      );
    } else if (lowerMessage.includes('nav')) {
      response =
        'NAV (Net Asset Value) is the per-unit price of a mutual fund. Formula: (Total Assets - Liabilities) / Total Units. Important: NAV is NOT an indicator of fund quality! A lower NAV doesn\'t mean "cheap" - focus on returns, expense ratio, and fund manager performance instead.';
      relatedTopics.push('Fund Performance', 'Returns Analysis', 'NAV History');
    } else if (lowerMessage.includes('expense ratio')) {
      response =
        'Expense Ratio is the annual fee (as % of AUM) for fund management. Lower is better! Direct plans have 0.5-1% lower expense ratio than regular plans. Impact: On ₹10 lakh over 10 years, 1% difference = ₹1.5 lakh! SEBI limits: Equity funds 2.25%, Debt funds 2.0%. Always choose Direct plans.';
      relatedTopics.push(
        'Direct vs Regular',
        'Fee Comparison',
        'Cost Analysis'
      );
    } else if (lowerMessage.includes('risk')) {
      response =
        'Mutual fund risks include: 1) Market Risk (price volatility), 2) Credit Risk (defaults in debt funds), 3) Liquidity Risk, 4) Interest Rate Risk. Mitigation: Diversify across categories, maintain long investment horizon (5+ years for equity), regular portfolio review, and match funds with your risk profile.';
      relatedTopics.push(
        'Risk Assessment',
        'Portfolio Review',
        'Diversification'
      );
    } else if (
      lowerMessage.includes('return') ||
      lowerMessage.includes('performance')
    ) {
      response =
        "Evaluate returns over multiple periods: 1-year, 3-year, 5-year, and since inception. Don't chase short-term gains! Check: 1) Consistency (did fund beat benchmark?), 2) Risk-adjusted returns (Sharpe ratio), 3) Peer comparison, 4) Downside protection. Past performance doesn't guarantee future results.";
      relatedTopics.push(
        'Performance Analysis',
        'Fund Comparison',
        'Returns Calculator'
      );
    } else {
      response =
        'I can help you with mutual fund queries! Ask me about: SIP, ELSS, fund categories (large/mid/small cap), NAV, expense ratios, returns, risk analysis, portfolio building, tax benefits, or comparing funds. How can I assist you today?';
      relatedTopics.push(
        'Getting Started',
        'Fund Selection',
        'Investment Strategy',
        'Portfolio Analysis'
      );
    }

    return res.json(
      formatResponse(
        {
          response,
          relatedTopics,
          hasAI: hasOpenAI,
          note: hasOpenAI
            ? 'AI-powered responses available'
            : 'Using rule-based responses. Configure OPENAI_API_KEY for AI features.',
        },
        'Chat response generated successfully'
      )
    );
  } catch (error) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Failed to process chat message',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
