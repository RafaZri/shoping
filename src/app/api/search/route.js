import { scrapeProductsCheerio } from '../../../utils/scrapers/scraper';
import { scrapeProductsPuppeteer } from '../../../utils/scrapers/scraperPuppeteer';

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

// Commercial-grade product scoring system with strict category filtering
function scoreProduct(product, queryInfo) {
  let score = 0;
  const titleLower = product.title.toLowerCase();
  const description = (product.description || '').toLowerCase();
  const fullText = `${titleLower} ${description}`;
  
  // STRICT CATEGORY FILTERING - Reject products that don't match the search category
  if (queryInfo.isElectronics) {
    const electronicKeywords = ['laptop', 'computer', 'pc', 'desktop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming', 'rtx', 'gtx', 'intel', 'amd', 'ryzen', 'core', 'processor', 'cpu', 'gpu', 'graphics', 'xps', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'monitor', 'keyboard', 'mouse', 'speaker', 'microphone'];
    const hasElectronicKeyword = electronicKeywords.some(keyword => fullText.includes(keyword));
    
    // Reject non-electronic products
    if (!hasElectronicKeyword) return 0;
    
    // Heavy penalty for clothing/accessories in electronics searches
    const clothingKeywords = ['shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'shoes', 'sneakers', 'duffel', 'tote', 'purse', 'wallet'];
    const hasClothingKeyword = clothingKeywords.some(keyword => fullText.includes(keyword));
    if (hasClothingKeyword) return 0; // Completely reject clothing in electronics searches
  }
  
  if (queryInfo.isClothing) {
    const clothingKeywords = ['shirt', 'pants', 'jacket', 'dress', 'hoodie', 'sweater', 'shorts', 't-shirt', 'tank', 'leggings', 'joggers', 'track', 'sportswear', 'backpack', 'bag', 'shoes', 'sneakers', 'duffel', 'tote', 'purse', 'wallet', 'clothing', 'apparel'];
    const hasClothingKeyword = clothingKeywords.some(keyword => fullText.includes(keyword));
    
    // Reject non-clothing products
    if (!hasClothingKeyword) return 0;
    
    // Heavy penalty for electronics in clothing searches
    const electronicKeywords = ['laptop', 'computer', 'pc', 'desktop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbud', 'camera', 'gaming', 'rtx', 'gtx', 'intel', 'amd', 'ryzen', 'core', 'processor', 'cpu', 'gpu', 'graphics'];
    const hasElectronicKeyword = electronicKeywords.some(keyword => fullText.includes(keyword));
    if (hasElectronicKeyword) return 0; // Completely reject electronics in clothing searches
  }
  
  // Exact word matches (highest priority)
  queryInfo.processedWords.forEach(word => {
    if (titleLower.includes(word)) score += 20;
    if (description.includes(word)) score += 10;
  });
  
  // Brand matching
  queryInfo.brands.forEach(brand => {
    if (titleLower.includes(brand)) score += 15;
    if (description.includes(brand)) score += 8;
  });
  
  // Category matching
  queryInfo.categories.forEach(category => {
    if (titleLower.includes(category)) score += 12;
    if (description.includes(category)) score += 6;
  });
  
  // Price-based scoring (prefer products with prices)
  if (product.price && product.price !== 'N/A') {
    score += 5;
  }
  
  // Rating-based scoring
  if (product.rating && product.rating > 0) {
    score += Math.min(product.rating * 2, 10); // Max 10 points for 5-star rating
  }
  
  // Review count scoring
  if (product.reviews && product.reviews > 0) {
    score += Math.min(Math.log10(product.reviews) * 2, 5); // Max 5 points for high review counts
  }
  
  // Company preference (Nike for Nike searches, Amazon for general)
  if (queryInfo.isNikeRelated && product.company.toLowerCase().includes('nike')) {
    score += 10;
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
        
        // Run both scrapers for comprehensive results
        const [amazonResults, nikeResults] = await Promise.allSettled([
          scrapeProductsCheerio(query),
          scrapeProductsPuppeteer(query)
        ]);

        const amazon = amazonResults.status === 'fulfilled' ? amazonResults.value : [];
        const nike = nikeResults.status === 'fulfilled' ? nikeResults.value : [];
        const error = {
          amazon: amazonResults.status === 'rejected' ? amazonResults.reason.message : null,
          nike: nikeResults.status === 'rejected' ? nikeResults.reason.message : null
        };
        
        // Score all products
        const scoredAmazon = amazon.map(product => ({
          ...product,
          score: scoreProduct(product, queryInfo)
        })).filter(product => product.score > 0).sort((a, b) => b.score - a.score);
        
        const scoredNike = nike.map(product => ({
          ...product,
          score: scoreProduct(product, queryInfo)
        })).filter(product => product.score > 0).sort((a, b) => b.score - a.score);
        
        // Combine results intelligently
        let allProducts = [];
        
        // For Nike-specific searches, prioritize Nike results
        if (queryInfo.isNikeRelated && scoredNike.length > 0) {
          allProducts = [...scoredNike.slice(0, 12), ...scoredAmazon.slice(0, 4)];
        } else {
          // For general searches, mix results based on scores
          const maxLength = Math.max(scoredAmazon.length, scoredNike.length);
          for (let i = 0; i < maxLength; i++) {
            if (scoredAmazon[i]) allProducts.push(scoredAmazon[i]);
            if (scoredNike[i]) allProducts.push(scoredNike[i]);
          }
        }
        
        // Remove score from final results and limit to 20 products
        allProducts = allProducts.slice(0, 20).map(({ score, ...product }) => product);

        return Response.json({
          products: allProducts,
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