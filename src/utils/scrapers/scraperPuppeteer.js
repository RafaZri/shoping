/**
 * scrapeProductsPuppeteer Function
 * 
 * This function scrapes product data from Nike's website based on a search query.
 * It uses Puppeteer to automate a browser, navigate to the search results page,
 * and extract product details such as title, price, image, and URL. It limits the
 * results to a maximum of 8 products.
 * 
 * @param {string} query - The search query used to find products on Nike's website.
 * @returns {Array} - An array of product objects containing details like title, price, image, and URL.
 *                   Returns an empty array if an error occurs during scraping.
 */
import puppeteer from 'puppeteer'; // Import Puppeteer for browser automation

export async function scrapeProductsPuppeteer(query) {
  let browser;
  try {
  
    
    // Launch a new browser instance
    browser = await puppeteer.launch({
      headless: 'new', // Run in headless mode (no visible browser window)
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments for stability
    });
    const page = await browser.newPage(); // Open a new page

    // Navigate to Nike's search results page for the given query
    const url = `https://www.nike.com/w?q=${encodeURIComponent(query)}`;
    
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until the page is fully loaded

    // Wait for product cards to appear (with a timeout of 3 seconds for faster loading)
    
    await page.waitForSelector('.product-card', { timeout: 3000 }).catch((err) => {
      
    });
    
    // Wait less for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if we can find any product cards
    const cardCount = await page.evaluate(() => {
      return document.querySelectorAll('.product-card').length;
    });
    

    // Extract product data from the page
    const products = await page.evaluate(() => {
      const items = []; // Array to store scraped products


      // Iterate over each product card
      const productCards = document.querySelectorAll('.product-card');
      
      
      productCards.forEach((el, i) => {
        if (i >= 8) return; // Limit results to 8 products for faster loading

        // Extract product details using DOM selectors
        const titleEl = el.querySelector('.product-card__title');
        const priceEl = el.querySelector('.product-price.is--current-price');
        const linkEl = el.querySelector('a.product-card__link-overlay');
        const imgEl = el.querySelector('img');

        // Extract and clean product title
        const title = titleEl ? titleEl.textContent.trim() : '';

        // Extract and clean product price
        const price = priceEl ? priceEl.textContent.trim() : '';

        

        // Extract old price using the correct selector
        const oldPriceEl = el.querySelector('.product-price.is--striked-out');
        const oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : null;

        // Calculate discount percentage if we have both prices
        let discountPercentage = null;
        if (oldPrice && price) {
          const currentPrice = parseFloat(price.replace(/[$,]/g, ''));
          const originalPrice = parseFloat(oldPrice.replace(/[$,]/g, ''));
          if (originalPrice > currentPrice) {
            discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100).toString();
  
          }
        }

        // Extract and construct product URL
        const urlRelative = linkEl ? linkEl.getAttribute('href') : '';
        let finalUrl = '';
        if (urlRelative?.startsWith('http')) {
          finalUrl = urlRelative; // Use absolute URL if available
        } else if (urlRelative?.startsWith('/')) {
          finalUrl = 'https://www.nike.com' + urlRelative; // Construct full URL for relative paths
        }

        // Extract and construct product image URL
        const imageSrc =
          imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
        let finalImg = '';
        if (imageSrc?.startsWith('http')) {
          finalImg = imageSrc; // Use absolute URL if available
        } else if (imageSrc?.startsWith('/')) {
          finalImg = 'https://www.nike.com' + imageSrc; // Construct full URL for relative paths
        } else if (imageSrc?.startsWith('data:')) {
          // Skip placeholder images, we'll use a default Nike image
          finalImg = 'https://www.nike.com/favicon.ico'; // Fallback image
        }

        // Try to extract rating and reviews from Nike product cards
        let rating = null;
        let reviews = null;
        
        // Look for rating elements on search results page
        const ratingEl = el.querySelector('[data-testid="rating"], .rating, .product-rating, .product-card__rating');
        if (ratingEl) {
          const ratingText = ratingEl.textContent;
          const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
          if (ratingMatch) {
            rating = parseFloat(ratingMatch[1]);
          }
        }
        
        // Look for review count elements on search results page
        const reviewsEl = el.querySelector('[data-testid="review-count"], .review-count, .product-reviews, .product-card__reviews');
        if (reviewsEl) {
          const reviewsText = reviewsEl.textContent;
          const reviewsMatch = reviewsText.replace(/[^\d]/g, '');
          if (reviewsMatch && reviewsMatch.length > 0) {
            reviews = parseInt(reviewsMatch);
          }
        }

        // Add product to the array if all required fields are present
        if (title && price && finalUrl) {
          items.push({
            id: String(i), // Unique ID for the product
            title, // Product title
            price, // Current price
            oldPrice, // Old price (if available)
            discountPercentage, // Discount percentage (if available)
            url: finalUrl, // Product page URL
            image: finalImg || 'https://www.nike.com/favicon.ico', // Product image URL
            company: 'Nike', // Hardcoded company name
            rating: rating, // Real rating if found
            reviews: reviews, // Real review count if found
          });

        } else {
          
        }
      });

      
      return items; // Return the array of scraped products
    });

    return products; // Return the scraped products to the caller
  } catch (err) {
    // Log any errors and return an empty array
    console.error('Puppeteer scraping error:', err);
    return [];
  } finally {
    // Close the browser instance to free up resources
    if (browser) await browser.close();
  }
}