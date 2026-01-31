export const knowledgeBase = {
  nav: {
    title: "Net Asset Value (NAV)",
    definition:
      "The price per unit of a mutual fund, calculated by dividing total assets minus liabilities by the number of units outstanding.",
    whyImportant:
      "NAV determines the cost of buying or selling fund units. A lower NAV doesn't mean better value - compare returns instead.",
    typicalRange: "₹10 - ₹500+ per unit",
    howToAnalyze: "Track NAV trends over time. Consistent NAV growth indicates good fund performance.",
    example:
      "If a fund has ₹1,000 Cr in assets, ₹10 Cr in liabilities, and 100 Cr units, NAV = ₹990 Cr / 100 Cr = ₹9.90 per unit",
  },
  expenseRatio: {
    title: "Expense Ratio",
    definition:
      "The annual percentage cost of managing the fund, including management fees, administrative costs, and other expenses.",
    whyImportant:
      "Lower expense ratios mean more of your money stays invested. Even 0.5% difference compounds significantly over time.",
    typicalRange: "0.12% - 1.5% annually",
    howToAnalyze:
      "Compare expense ratios within the same fund category. ETFs typically have lower ratios than actively managed funds.",
    example: "A ₹1 Lakh investment in a fund with 0.5% expense ratio costs ₹500/year, while 1.5% costs ₹1,500/year.",
  },
  aum: {
    title: "Assets Under Management (AUM)",
    definition: "The total market value of all investments managed by the fund.",
    whyImportant: "Larger AUM indicates fund popularity and stability. Very small AUM may indicate fund closure risk.",
    typicalRange: "₹100 Cr - ₹100,000+ Cr",
    howToAnalyze: "Growing AUM suggests investor confidence. Declining AUM may indicate performance issues.",
    example: "A fund with ₹50,000 Cr AUM manages investments from thousands of investors.",
  },
  rating: {
    title: "Fund Rating",
    definition: "A 5-star rating based on risk-adjusted returns, consistency, and fund manager performance.",
    whyImportant: "Ratings help identify well-performing funds. 5-star funds have historically outperformed peers.",
    typicalRange: "1 to 5 stars",
    howToAnalyze:
      "Prefer 4-5 star funds. Check rating history - consistent ratings are better than recent improvements.",
    example: "A 5-star fund has delivered superior risk-adjusted returns compared to its category average.",
  },
  returns1Y: {
    title: "1-Year Returns",
    definition: "The percentage gain or loss of the fund over the past 12 months.",
    whyImportant: "Shows recent performance. Use with longer-term returns for complete picture.",
    typicalRange: "-20% to +50% (varies by market conditions)",
    howToAnalyze: "Compare with benchmark and category average. Don't invest based on 1-year returns alone.",
    example: "A fund with +18.5% returns in 1 year gained ₹18,500 on every ₹1 Lakh invested.",
  },
  returns3Y: {
    title: "3-Year Returns",
    definition: "The annualized percentage return over the past 3 years.",
    whyImportant: "Shows medium-term performance through different market cycles.",
    typicalRange: "5% to 25% annually",
    howToAnalyze: "Better indicator than 1-year returns. Shows consistency through market ups and downs.",
    example: "A fund with +22.3% annualized 3-year returns turned ₹1 Lakh into ₹1.70 Lakh in 3 years.",
  },
  returns5Y: {
    title: "5-Year Returns",
    definition: "The annualized percentage return over the past 5 years.",
    whyImportant: "Best indicator of long-term fund performance. Shows consistency through full market cycles.",
    typicalRange: "8% to 20% annually",
    howToAnalyze: "Most reliable metric for fund selection. Compare 5-year returns across funds in same category.",
    example: "A fund with +19.8% annualized 5-year returns turned ₹1 Lakh into ₹2.44 Lakh in 5 years.",
  },
  largeCapFund: {
    title: "Large Cap Fund",
    definition: "Invests in stocks of large, well-established companies with market capitalization above ₹20,000 Cr.",
    whyImportant: "Lower risk, stable returns. Suitable for conservative investors.",
    typicalRange: "Returns: 12-18% annually",
    howToAnalyze: "Look for consistent dividend payments and stable NAV growth.",
    example: "Axis Bluechip Fund invests in companies like Reliance, HDFC Bank, and Infosys.",
  },
  midCapFund: {
    title: "Mid Cap Fund",
    definition: "Invests in stocks of mid-sized companies with market capitalization between ₹5,000-20,000 Cr.",
    whyImportant: "Higher growth potential than large caps, moderate risk. Good for balanced portfolios.",
    typicalRange: "Returns: 15-25% annually",
    howToAnalyze: "Check fund manager's track record in picking emerging winners.",
    example: "Mirae Asset Emerging Bluechip Fund focuses on companies with strong growth potential.",
  },
  smallCapFund: {
    title: "Small Cap Fund",
    definition: "Invests in stocks of smaller companies with market capitalization below ₹5,000 Cr.",
    whyImportant: "Highest growth potential but also highest risk. For aggressive investors with long time horizon.",
    typicalRange: "Returns: 20-35% annually (volatile)",
    howToAnalyze: "Requires strong fund manager expertise. Check 5-year performance.",
    example: "SBI Small Cap Fund invests in emerging pharmaceutical and tech companies.",
  },
  etf: {
    title: "Exchange Traded Fund (ETF)",
    definition: "A fund that tracks a market index like Nifty 50, traded on stock exchange like individual stocks.",
    whyImportant: "Low cost, transparent, tax-efficient. Ideal for passive investing.",
    typicalRange: "Expense ratio: 0.05-0.15%",
    howToAnalyze: "Compare tracking error (difference from index). Lower is better.",
    example: "Vanguard India ETF - Nifty 50 tracks the top 50 Indian companies.",
  },
  dividendFund: {
    title: "Dividend Fund",
    definition: "Invests in dividend-paying stocks and distributes regular income to investors.",
    whyImportant: "Provides regular income. Good for retirees and income-seeking investors.",
    typicalRange: "Dividend yield: 2-4% annually",
    howToAnalyze: "Check dividend history and consistency. Compare with fixed deposits.",
    example: "Motilal Oswal Dividend Yield Fund invests in power and utility companies.",
  },
  balancedFund: {
    title: "Balanced Fund",
    definition: "Invests in mix of stocks (60%) and bonds (40%) for balanced risk-return.",
    whyImportant: "Lower volatility than pure equity funds. Good for moderate investors.",
    typicalRange: "Returns: 10-15% annually",
    howToAnalyze: "Check asset allocation and rebalancing strategy.",
    example: "HDFC Balanced Advantage Fund dynamically adjusts equity-debt mix.",
  },
  techInnovation: {
    title: "Technology Innovation",
    definition:
      "Investment in companies developing cutting-edge technologies like AI, cloud computing, and digital solutions.",
    whyImportant: "Tech companies drive future growth. Early adoption can lead to significant returns.",
    typicalRange: "Growth potential: 25-40% annually",
    howToAnalyze: "Look for companies with strong R&D spending and patent portfolios.",
    example: "Investing in IT companies like TCS, Infosys, and HCL for tech innovation exposure.",
  },
  sustainabilityFocus: {
    title: "Sustainability Focus",
    definition: "Investment strategy prioritizing environmentally and socially responsible companies.",
    whyImportant: "ESG companies show better long-term performance and lower risk.",
    typicalRange: "Returns: 12-18% annually",
    howToAnalyze: "Check ESG ratings and carbon footprint reduction targets.",
    example: "Investing in renewable energy and green technology companies.",
  },
  globalExpansion: {
    title: "Global Expansion",
    definition: "Strategy to invest in companies expanding internationally and entering new markets.",
    whyImportant: "Diversifies revenue sources and reduces domestic market risk.",
    typicalRange: "Growth potential: 15-25% annually",
    howToAnalyze: "Check company's international revenue percentage and market entry plans.",
    example: "Indian IT companies expanding in US, Europe, and Asia-Pacific markets.",
  },
  riskManagement: {
    title: "Risk Management",
    definition: "Strategy to minimize portfolio losses through diversification and hedging.",
    whyImportant: "Protects capital during market downturns. Essential for long-term investing.",
    typicalRange: "Reduces volatility by 20-30%",
    howToAnalyze: "Check fund's maximum drawdown and recovery time during market crashes.",
    example: "Holding both growth and defensive stocks to balance portfolio risk.",
  },
}

export type KnowledgeKey = keyof typeof knowledgeBase
