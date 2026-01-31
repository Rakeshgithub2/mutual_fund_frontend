export const translations = {
  en: {
    header: {
      brand: "MutualFunds.in",
      search: "Search funds...",
      signIn: "Sign In",
      watchlist: "Watchlist",
      language: "Language",
    },
    tabs: {
      stocks: "Stock Mutual Funds",
      commodities: "Commodity Mutual Funds & ETFs",
      watchlist: "My Watchlist",
    },
    fund: {
      nav: "NAV",
      aum: "AUM",
      expenseRatio: "Expense Ratio",
      rating: "Rating",
      returns1Y: "1Y Returns",
      returns3Y: "3Y Returns",
      returns5Y: "5Y Returns",
      viewDetails: "View Details",
      compare: "Compare",
      addToWatchlist: "Add to Watchlist",
      removeFromWatchlist: "Remove",
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      noResults: "No results found",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
    },
  },
  hi: {
    header: {
      brand: "MutualFunds.in",
      search: "फंड खोजें...",
      signIn: "साइन इन करें",
      watchlist: "वॉचलिस्ट",
      language: "भाषा",
    },
    tabs: {
      stocks: "स्टॉक म्यूचुअल फंड",
      commodities: "कमोडिटी म्यूचुअल फंड और ईटीएफ",
      watchlist: "मेरी वॉचलिस्ट",
    },
    fund: {
      nav: "NAV",
      aum: "AUM",
      expenseRatio: "व्यय अनुपात",
      rating: "रेटिंग",
      returns1Y: "1Y रिटर्न",
      returns3Y: "3Y रिटर्न",
      returns5Y: "5Y रिटर्न",
      viewDetails: "विवरण देखें",
      compare: "तुलना करें",
      addToWatchlist: "वॉचलिस्ट में जोड़ें",
      removeFromWatchlist: "हटाएं",
    },
    common: {
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हुआ",
      noResults: "कोई परिणाम नहीं मिला",
      darkMode: "डार्क मोड",
      lightMode: "लाइट मोड",
    },
  },
  kn: {
    header: {
      brand: "MutualFunds.in",
      search: "ಫಂಡ್‌ಗಳನ್ನು ಹುಡುಕಿ...",
      signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
      watchlist: "ವಾಚ್‌ಲಿಸ್ಟ್",
      language: "ಭಾಷೆ",
    },
    tabs: {
      stocks: "ಸ್ಟಾಕ್ ಮ್ಯೂಚುವಲ್ ಫಂಡ್‌ಗಳು",
      commodities: "ಕಮೋಡಿಟಿ ಮ್ಯೂಚುವಲ್ ಫಂಡ್‌ಗಳು ಮತ್ತು ಇಟಿಎಫ್‌ಗಳು",
      watchlist: "ನನ್ನ ವಾಚ್‌ಲಿಸ್ಟ್",
    },
    fund: {
      nav: "NAV",
      aum: "AUM",
      expenseRatio: "ವ್ಯಯ ಅನುಪಾತ",
      rating: "ರೇಟಿಂಗ್",
      returns1Y: "1Y ರಿಟರ್ನ್‌ಗಳು",
      returns3Y: "3Y ರಿಟರ್ನ್‌ಗಳು",
      returns5Y: "5Y ರಿಟರ್ನ್‌ಗಳು",
      viewDetails: "ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
      compare: "ಹೋಲಿಸಿ",
      addToWatchlist: "ವಾಚ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
      removeFromWatchlist: "ತೆಗೆದುಹಾಕಿ",
    },
    common: {
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ಏನೋ ತಪ್ಪಾಗಿದೆ",
      noResults: "ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ",
      darkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
      lightMode: "ಲೈಟ್ ಮೋಡ್",
    },
  },
}

export type Language = "en" | "hi" | "kn"

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split(".")
  let value: any = translations[lang]
  for (const k of keys) {
    value = value?.[k]
  }
  return value || key
}
