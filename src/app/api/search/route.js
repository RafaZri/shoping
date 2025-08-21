import { scrapeProductsCheerio } from '../../../utils/scrapers/scraper.js';
import { scrapeProductsPuppeteer } from '../../../utils/scrapers/scraperPuppeteer.js';
import jwt from 'jsonwebtoken';

// Add debugging for production
console.log('🔍 Search API loaded - Environment:', process.env.NODE_ENV);

// Basic rate limiting
const rateLimitStore = new Map();

function getClientIP(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || realIP || cfConnectingIP || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const maxRequests = 10;
  const windowMs = 60000;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userData = rateLimitStore.get(ip);
  if (now > userData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userData.count >= maxRequests) {
    return false;
  }
  
  userData.count++;
  return true;
}

// Advanced query processing for e-commerce
function processQuery(query) {
  const queryLower = query.toLowerCase().trim();
  
  // Remove common stop words but keep important ones
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = queryLower.split(/\s+/).filter(word => 
    word.length > 1 && !stopWords.includes(word)
  );
  
  // Extract key terms
  const brands = ['nike', 'adidas', 'puma', 'reebok', 'under armour', 'asics', 'new balance', 'converse', 'vans', 'skechers', 'brooks', 'saucony', 'hoka', 'on running', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'apple', 'samsung', 'sony', 'lg'];
  const categories = ['shoes', 'sneakers', 'running', 'athletic', 'sports', 'laptop', 'computer', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming', 'shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'duffel', 'tote', 'purse', 'wallet'];
  
  const foundBrands = words.filter(word => brands.includes(word));
  const foundCategories = words.filter(word => categories.includes(word));
  
  return {
    originalQuery: query,
    processedWords: words,
    brands: foundBrands,
    categories: foundCategories,
    isNikeRelated: foundBrands.includes('nike') || words.some(word => ['jordan', 'air', 'max', 'pegasus', 'vaporfly'].includes(word)),
    isElectronics: foundCategories.some(cat => ['laptop', 'computer', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming'].includes(cat)) || words.some(word => ['rtx', 'gtx', 'intel', 'amd', 'ryzen', 'core', 'processor', 'cpu', 'gpu', 'graphics', 'xps', 'macbook'].includes(word)),
    isClothing: foundCategories.some(cat => ['shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'duffel', 'tote', 'purse', 'wallet'].includes(cat))
  };
}

// Enhanced product scoring system with improved accuracy
function scoreProduct(product, queryInfo) {
  let score = 0;
  const titleLower = product.title.toLowerCase();
  const description = (product.description || '').toLowerCase();
  const fullText = `${titleLower} ${description}`;
  const queryLower = queryInfo.originalQuery.toLowerCase();
  
  // EXACT PHRASE MATCH (Highest Priority - 100 points)
  if (titleLower.includes(queryLower)) {
    score += 100;
  }
  
  // BRAND-SPECIFIC SEARCH BOOST (Massive boost for brand searches)
  const majorBrands = ['nike', 'adidas', 'puma', 'reebok', 'under armour', 'asics', 'new balance', 'converse', 'vans', 'skechers', 'brooks', 'saucony', 'hoka', 'on running'];
  const detectedBrand = majorBrands.find(brand => queryLower.includes(brand));
  
  if (detectedBrand && titleLower.includes(detectedBrand)) {
    score += 80; // Massive brand boost
  }
  
  // EXACT WORD MATCHES (High Priority - 30 points each)
  queryInfo.processedWords.forEach(word => {
    if (titleLower.includes(word)) score += 30;
    if (fullText.includes(word)) score += 15;
  });
  
  // BRAND MATCHING (Enhanced)
  queryInfo.brands.forEach(brand => {
    if (titleLower.includes(brand)) score += 25;
    if (fullText.includes(brand)) score += 12;
  });
  
  // CATEGORY MATCHING (Enhanced)
  queryInfo.categories.forEach(category => {
    if (titleLower.includes(category)) score += 20;
    if (fullText.includes(category)) score += 10;
  });
  
  // PARTIAL WORD MATCHES (Medium Priority - 10 points each)
  queryInfo.processedWords.forEach(word => {
    if (word.length > 3) { // Only for words longer than 3 characters
      const partialMatches = titleLower.split(' ').filter(titleWord => 
        titleWord.includes(word) || word.includes(titleWord)
      );
      score += partialMatches.length * 10;
    }
  });
  
  // STRICT CATEGORY FILTERING - Reject products that don't match the search category
  if (queryInfo.isElectronics) {
    const electronicKeywords = ['laptop', 'computer', 'pc', 'desktop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming', 'rtx', 'gtx', 'intel', 'amd', 'ryzen', 'core', 'processor', 'cpu', 'gpu', 'graphics', 'xps', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'monitor', 'keyboard', 'mouse', 'speaker', 'microphone'];
    const hasElectronicKeyword = electronicKeywords.some(keyword => fullText.includes(keyword));
    
    if (!hasElectronicKeyword) return 0; // Reject non-electronics
    
    const clothingKeywords = ['shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'shoes', 'sneakers', 'duffel', 'tote', 'purse', 'wallet'];
    const hasClothingKeyword = clothingKeywords.some(keyword => fullText.includes(keyword));
    if (hasClothingKeyword) return 0; // Reject clothing in electronics searches
  }
  
  if (queryInfo.isClothing) {
    const clothingKeywords = ['shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'shoes', 'sneakers', 'duffel', 'tote', 'purse', 'wallet', 'clothing', 'apparel'];
    const hasClothingKeyword = clothingKeywords.some(keyword => fullText.includes(keyword));
    
    if (!hasClothingKeyword) return 0; // Reject non-clothing
    
    const electronicKeywords = ['laptop', 'computer', 'pc', 'desktop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming', 'rtx', 'gtx', 'intel', 'amd', 'ryzen', 'core', 'processor', 'cpu', 'gpu', 'graphics'];
    const hasElectronicKeyword = electronicKeywords.some(keyword => fullText.includes(keyword));
    if (hasElectronicKeyword) return 0; // Reject electronics in clothing searches
  }
  
  // QUALITY INDICATORS (Bonus points)
  if (product.price && product.price !== 'N/A') {
    score += 5;
  }
  
  if (product.rating && product.rating > 0) {
    score += Math.min(product.rating * 2, 10);
  }
  
  if (product.reviews && product.reviews > 0) {
    score += Math.min(Math.log10(product.reviews) * 2, 5);
  }
  
  // COMPANY PREFERENCE
  if (queryInfo.isNikeRelated && product.company.toLowerCase().includes('nike')) {
    score += 15;
  }
  
  return score;
}

export async function POST(req) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(req);
    
    // Basic rate limiting
    if (!checkRateLimit(clientIP)) {
      return Response.json({ 
        error: 'Too many requests. Please try again later.'
      }, { status: 429 });
    }

    // Validate request method
    if (req.method !== 'POST') {
      return Response.json({ 
        error: 'Method not allowed' 
      }, { status: 405 });
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return Response.json({ 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }

    const { query, product, language = 'en' } = requestBody;
    
    // Input validation
    if (!query && !product) {
      return Response.json({ 
        error: 'Invalid request. Query or product is required.' 
      }, { status: 400 });
    }

    // Basic query validation
    if (query && (typeof query !== 'string' || query.length > 200)) {
      return Response.json({ 
        error: 'Invalid query format or length' 
      }, { status: 400 });
    }

    // Basic product validation
    if (product && (typeof product !== 'object' || !product.title || !product.price || !product.url)) {
      return Response.json({ 
        error: 'Invalid product data format' 
      }, { status: 400 });
    }

    // Language validation
    if (language && !['en', 'fr'].includes(language)) {
      return Response.json({ 
        error: 'Invalid language parameter' 
      }, { status: 400 });
    }

    // Mode analyse de produit existant
    if (product) {
      try {
        return Response.json({
          products: [product]
        });
      } catch (error) {
        console.error('Product analysis error:', error);
        return Response.json({ 
          error: language === 'fr' ? 'Erreur lors de l\'analyse du produit' : 'Error analyzing product'
        }, { status: 500 });
      }
    }

    // Mode nouvelle recherche
    if (query) {
      try {
        // Process the query
        const queryInfo = processQuery(query);
        
        // Ultra-fast loading: Start with Amazon first
        console.log('🔍 Starting Amazon search for:', query);
        let amazonResults;
        let amazonError = null;
        
        try {
          console.log('🔍 Calling scrapeProductsCheerio with query:', query);
          amazonResults = await scrapeProductsCheerio(query);
          console.log('✅ Amazon search completed, found:', amazonResults?.length || 0, 'products');
          console.log('🔍 Amazon results type:', typeof amazonResults);
          console.log('🔍 Amazon results:', amazonResults);
        } catch (error) {
          console.error('❌ Amazon search failed:', error);
          console.error('❌ Error stack:', error.stack);
          amazonError = error.message;
          amazonResults = [];
        }
        
        const amazon = amazonResults || [];
        
        // Quick scoring for immediate display
        const scoredAmazon = amazon.map(product => ({
          ...product,
          score: scoreProduct(product, queryInfo)
        })).filter(product => product.score > 0).sort((a, b) => b.score - a.score);
        
        // Get first 8 Amazon products for ultra-fast display
        const initialAmazonProducts = scoredAmazon.slice(0, 8).map(({ score, ...product }) => product);
        
        // For now, skip Nike scraper in production (Puppeteer doesn't work in serverless)
        const nike = [];
        const nikeError = 'Nike scraper disabled in production';
        const scoredNike = [];
        
        // Determine if Nike products are relevant for this search
        const isNikeRelevant = queryInfo.isNikeRelated || 
          query.toLowerCase().includes('shoe') || 
          query.toLowerCase().includes('sneaker') || 
          query.toLowerCase().includes('nike') || 
          query.toLowerCase().includes('athletic') ||
          query.toLowerCase().includes('running') ||
          query.toLowerCase().includes('training') ||
          query.toLowerCase().includes('sport');
        
        // Prepare remaining products for "Load More"
        const remainingAmazonProducts = scoredAmazon.slice(8).map(({ score, ...product }) => product);
        const nikeProducts = []; // Will be populated later via separate API call
        
        // Combine all products for "Load More" (Nike priority if relevant)
        let loadMoreProducts = [];
        if (isNikeRelevant && nikeProducts.length > 0) {
          loadMoreProducts = [...nikeProducts, ...remainingAmazonProducts];
        } else {
          loadMoreProducts = remainingAmazonProducts;
        }
        
        // Limit load more products to reasonable amount
        loadMoreProducts = loadMoreProducts.slice(0, 20);
        
        const error = {
          amazon: amazonError,
          nike: nikeError
        };

        // Save search to user's history if user is logged in
        try {
          const authHeader = req.headers.get('authorization');
          const userIdHeader = req.headers.get('x-user-id');
          
          let user = null;
          
          if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
              throw new Error('JWT_SECRET environment variable is required');
            }
            
            try {
              const decoded = jwt.verify(token, JWT_SECRET);
              user = global.users.find(u => u.id === decoded.userId);
            } catch (jwtError) {
              // Invalid token, continue without saving history
            }
          } else if (userIdHeader) {
            // Fallback: use user ID from header
            user = global.users.find(u => u.id === userIdHeader);
          }
          
          if (user) {
            // Add search to user's history
            const searchEntry = {
              query: query,
              timestamp: new Date().toISOString(),
              resultsCount: initialAmazonProducts.length
            };
            
            // Initialize searchHistory if it doesn't exist
            if (!user.searchHistory) {
              user.searchHistory = [];
            }
            
            // Add to beginning of array (most recent first)
            user.searchHistory.unshift(searchEntry);
            
            // Keep only last 20 searches
            if (user.searchHistory.length > 20) {
              user.searchHistory = user.searchHistory.slice(0, 20);
            }
          }
        } catch (historyError) {
          // Don't fail the search if history saving fails
        }

        return Response.json({
          products: initialAmazonProducts,
          loadMoreProducts: loadMoreProducts,
          hasMoreProducts: loadMoreProducts.length > 0,
          scraperErrors: error
        });
      } catch (scraperError) {
        console.error('Scraper Error:', scraperError);
        return Response.json({ 
          error: language === 'fr' ? 'Erreur lors de la recherche des produits' : 'Error searching for products'
        }, { status: 500 });
      }
    }

    return Response.json({ error: 'Requête invalide' }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    
    // Don't expose internal errors to client
    return Response.json({ 
      error: 'Internal server error' 
    }, { 
      status: 500,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}