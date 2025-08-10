export const translations = {
  en: {
    // Homepage
    searchPlaceholder: "Search for products...",
    searchButton: "Search",
    homepageTitle: "Find the Best Deals",
    homepageSubtitle: "Compare prices across Amazon and Nike",
    
    // Product Grid
    loadMore: "Load More",
    bestFor: "Best for",
    reviews: "reviews",
    
    // Product Categories
    athleticFootwear: "Athletic Footwear",
    electronicsMore: "Electronics & More",
    
    // Product Descriptions
    generalUse: "General use",
    athleticActivities: "Athletic activities",
    workProductivity: "Work and productivity",
    gamingPerformance: "Gaming and performance",
    dailyUse: "Daily use",
    casualWear: "Casual wear",
    qualityMaterials: "Quality materials",
    breathableMeshUpper: "Breathable mesh upper",
    comfortableFabric: "Comfortable fabric",
    premiumBuild: "Premium build",
    
    // Common
    noProducts: "No products found",
    loading: "Loading...",
    error: "Error occurred",
    
    // AI Response
    recommendedProducts: "Recommended Products",
    
    // Search
    searchError: "Search error occurred",
    
    // Product Details
    weight: "Weight",
    material: "Material",
    rating: "Rating",
    price: "Price",
    oldPrice: "Original Price",
    discount: "Discount",
    
    // Copy button
    copy: "Copy",
    
    // Analysis
    analyzing: "Analyzing...",
    
    // Chat Section
    priceComparison: "Price Comparison",
    store: "Store",
    shipping: "Shipping",
    stock: "Stock",
    inStock: "In Stock",
    freeShipping: "Free",
    
    // Blog Section
    latestArticles: "Latest Articles & Guides",
    blogDescription: "Get the latest tips, comparisons, and deals to help you save money on your purchases.",
    allCategories: "All Categories",
    electronics: "Electronics",
    shoppingTips: "Shopping Tips",
    brandComparison: "Brand Comparison",
    readMore: "Read More",
    viewAllPosts: "View All Posts",
  },
  
  fr: {
    // Homepage
    searchPlaceholder: "Rechercher des produits...",
    searchButton: "Rechercher",
    homepageTitle: "Trouvez les Meilleures Offres",
    homepageSubtitle: "Comparez les prix sur Amazon et Nike",
    
    // Product Grid
    loadMore: "Charger Plus",
    bestFor: "Idéal pour",
    reviews: "avis",
    
    // Product Categories
    athleticFootwear: "Chaussures de Sport",
    electronicsMore: "Électronique et Plus",
    
    // Product Descriptions
    generalUse: "Usage général",
    athleticActivities: "Activités athlétiques",
    workProductivity: "Travail et productivité",
    gamingPerformance: "Performance et jeux",
    dailyUse: "Usage quotidien",
    casualWear: "Vêtements décontractés",
    qualityMaterials: "Matériaux de qualité",
    breathableMeshUpper: "Empeigne en mesh respirant",
    comfortableFabric: "Tissu confortable",
    premiumBuild: "Construction premium",
    
    // Common
    noProducts: "Aucun produit trouvé",
    loading: "Chargement...",
    error: "Erreur survenue",
    
    // AI Response
    recommendedProducts: "Produits Recommandés",
    
    // Search
    searchError: "Erreur de recherche survenue",
    
    // Product Details
    weight: "Poids",
    material: "Matériau",
    rating: "Évaluation",
    price: "Prix",
    oldPrice: "Prix Original",
    discount: "Réduction",
    
    // Copy button
    copy: "Copier",
    
    // Analysis
    analyzing: "Analyse en cours...",
    
    // Chat Section
    priceComparison: "Comparaison de Prix",
    store: "Magasin",
    shipping: "Livraison",
    stock: "Stock",
    inStock: "En Stock",
    freeShipping: "Gratuit",
    
    // Blog Section
    latestArticles: "Derniers Articles et Guides",
    blogDescription: "Obtenez les derniers conseils, comparaisons et offres pour vous aider à économiser sur vos achats.",
    allCategories: "Toutes les Catégories",
    electronics: "Électronique",
    shoppingTips: "Conseils d'Achat",
    brandComparison: "Comparaison de Marques",
    readMore: "Lire Plus",
    viewAllPosts: "Voir Tous les Articles",
  }
};

export const getTranslation = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en[key] || key;
}; 