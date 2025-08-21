/**
 * scrapeProductsCheerio Function
 * 
 * This function scrapes product data from Amazon Canada based on a search query.
 * It uses Cheerio to parse the HTML response and extract product details such as
 * title, price, image, and URL. All Amazon links include Canadian affiliate tracking.
 * It limits the results to a maximum of 16 products.
 * 
 * @param {string} query - The search query used to find products on Amazon Canada.
 * @returns {Array} - An array of product objects containing details like title, price, image, and URL.
 *                   Returns an empty array if an error occurs during scraping.
 */
import * as cheerio from 'cheerio'; // Import Cheerio for HTML parsing
import axios from 'axios'; // Import Axios for making HTTP requests

export async function scrapeProductsCheerio(query) {
  try {
    // Send a GET request to Amazon Canada's search page with the query
    const response = await axios.get(
      `https://www.amazon.ca/s?k=${encodeURIComponent(query)}`, // Encode query for URL
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', // Mimic a real browser
          'Accept-Language': 'en-CA,fr-CA;q=0.9,en;q=0.8', // Set language preferences for Canada
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
      }
    );

    // Load the HTML response into Cheerio for parsing
    const $ = cheerio.load(response.data);
    const products = []; // Array to store scraped products

    // Iterate over each product in the search results
    $('.s-result-item').each((i, el) => {
      if (products.length >= 16) return false; // Limit results to 16 products

      // Extract product title
      const title = $(el).find('h2 span').text();

      // Extract current price using multiple selectors for better coverage
      let currentPrice = $(el).find('.a-price .a-offscreen').first().text().trim();
      if (!currentPrice) {
        currentPrice = $(el).find('.a-price-whole').text().trim();
      }
      if (!currentPrice) {
        currentPrice = $(el).find('.a-price .a-price-whole').text().trim();
      }

      // Extract old price (strikethrough price)
      let oldPrice = $(el).find('.a-price.a-text-price .a-offscreen').text().trim();
      if (!oldPrice) {
        oldPrice = $(el).find('.a-text-price .a-offscreen').text().trim();
      }

      // Extract discount percentage
      let discountPercentage = null;
      const discountText = $(el).find('.a-badge-text').text();
      if (discountText) {
        const discountMatch = discountText.match(/(\d+)%/);
        if (discountMatch) {
          discountPercentage = discountMatch[1];
        }
      }

      // Extract product image URL
      const image = $(el).find('img').attr('src');

      // Construct full product URL for Amazon Canada with affiliate tracking
      let url = 'https://amazon.ca' + $(el).find('a.a-link-normal').attr('href');
      
      // Clean the URL to remove sponsored parameters and get direct product link
      if (url) {
        // Extract the product ID and create a clean Amazon URL
        const urlMatch = url.match(/\/dp\/([A-Z0-9]+)/);
        if (urlMatch) {
          const productId = urlMatch[1];
          // Create super clean Amazon affiliate link for Link Checker
          url = `https://www.amazon.ca/dp/${productId}?tag=shopcompare0b-20&linkCode=ogi&language=en_CA`;
        } else {
          // Try to extract product ID from other URL patterns
          const otherMatch = url.match(/\/gp\/product\/([A-Z0-9]+)/);
          if (otherMatch) {
            const productId = otherMatch[1];
            url = `https://www.amazon.ca/dp/${productId}?tag=shopcompare0b-20&linkCode=ogi&language=en_CA`;
          } else {
            // For sponsored links, try to extract the final product URL
            const finalUrlMatch = url.match(/url=([^&]+)/);
            if (finalUrlMatch) {
              const decodedUrl = decodeURIComponent(finalUrlMatch[1]);
              const productMatch = decodedUrl.match(/\/dp\/([A-Z0-9]+)/);
              if (productMatch) {
                const productId = productMatch[1];
                url = `https://www.amazon.ca/dp/${productId}?tag=shopcompare0b-20&linkCode=ogi&language=en_CA`;
              } else {
                // Last fallback: just add tracking to original URL
                url += (url.includes('?') ? '&' : '?') + 'tag=shopcompare0b-20';
              }
            } else {
              // Last fallback: just add tracking to original URL
              url += (url.includes('?') ? '&' : '?') + 'tag=shopcompare0b-20';
            }
          }
        }
      }

      // Extract real product details with multiple selector attempts
      let rating = null;
      let reviews = null;
      
      // Try multiple selectors for rating
      const ratingSelectors = [
        '.a-icon-alt',
        '[data-testid="rating"]',
        '.a-icon-star-small',
        '.a-icon-star',
        '.a-star-rating'
      ];
      
      for (const selector of ratingSelectors) {
        const ratingText = $(el).find(selector).text();
        const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
        if (ratingMatch) {
          rating = parseFloat(ratingMatch[1]);
          break;
        }
      }
      
      // Try multiple selectors for reviews
      const reviewSelectors = [
        '.a-size-base.s-underline-text',
        '[data-testid="review-count"]',
        '.a-size-base',
        '.a-link-normal[href*="reviews"]'
      ];
      
      for (const selector of reviewSelectors) {
        const reviewText = $(el).find(selector).text();
        const reviewMatch = reviewText.replace(/[^\d]/g, '');
        if (reviewMatch && reviewMatch.length > 0) {
          reviews = parseInt(reviewMatch);
          break;
        }
      }
      
      // Extract product specifications from title or description
      const description = $(el).find('.a-size-base-plus.a-color-base.a-text-normal').text() || 
                         $(el).find('.a-size-base-plus.a-color-secondary.a-text-normal').text() || 
                         $(el).find('.a-size-base-plus.a-text-normal').text() || '';
      
      // Enhanced product details extraction
      const fullText = `${title} ${description}`.toLowerCase();
      
      // Try to extract weight from title or description
      const weightMatch = fullText.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams|kg|kilo|pound|lb|ounce|oz)/i);
      const weight = weightMatch ? `${weightMatch[1]}${weightMatch[0].includes('kg') ? 'kg' : weightMatch[0].includes('pound') || weightMatch[0].includes('lb') ? 'lb' : weightMatch[0].includes('ounce') || weightMatch[0].includes('oz') ? 'oz' : 'g'}` : null;
      
      // Try to extract material from title or description
      const materialMatch = fullText.match(/(?:made of|material|fabric|upper|sole|outsole|upper material|sole material|fabric|mesh|leather|suede|canvas|nylon|polyester|cotton|wool|synthetic|breathable|waterproof|quick-dry|rubber|foam|cushion)/i);
      const material = materialMatch ? materialMatch[0] : null;
      
      // Extract brand information
      const brandMatch = fullText.match(/(?:nike|adidas|puma|reebok|under armour|asics|new balance|converse|vans|skechers|brooks|saucony|hoka|on running)/i);
      const brand = brandMatch ? brandMatch[0] : null;
      
      // Extract size information
      const sizeMatch = fullText.match(/(\d+(?:\.\d+)?)\s*(?:us|uk|eu|cm|inch|inches)/i);
      const size = sizeMatch ? sizeMatch[0] : null;

      // Add product to the array if all required fields are present
      if (title && currentPrice && image && url) {
        products.push({
          id: i.toString(), // Unique ID for the product
          title, // Product title
          price: currentPrice.startsWith('$') ? currentPrice : `$${currentPrice}`, // Current price (formatted as a string)
          oldPrice: oldPrice ? (oldPrice.startsWith('$') ? oldPrice : `$${oldPrice}`) : null, // Old price (formatted as a string, or null if not available)
          image, // Product image URL
          url, // Product page URL
          company: 'Amazon', // Hardcoded company name
          rating: rating ? parseFloat(rating) : null, // Real rating
          reviews: reviews ? parseInt(reviews) : null, // Real number of reviews
          weight: weight, // Real weight if found
          material: material, // Real material if found
          brand: brand, // Brand information if found
          size: size, // Size information if found
          description: description, // Product description
          discountPercentage: discountPercentage, // Real discount percentage if found
        });
      }
    });

    return products; // Return the array of scraped products
  } catch (error) {
    // Log any errors and return an empty array
    console.error('Scraping error:', error);
    return [];
  }
}