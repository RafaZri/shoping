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
    console.log(`Starting Nike scraper for query: "${query}"`);
    
    // Launch a new browser instance
    browser = await puppeteer.launch({
      headless: 'new', // Run in headless mode (no visible browser window)
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional arguments for stability
    });
    const page = await browser.newPage(); // Open a new page

    // Navigate to Nike's search results page for the given query
    const url = `https://www.nike.com/w?q=${encodeURIComponent(query)}`;
    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' }); // Wait until the page is fully loaded

    // Wait for product cards to appear (with a timeout of 6 seconds)
    console.log('Waiting for product cards...');
    await page.waitForSelector('.product-card', { timeout: 6000 }).catch((err) => {
      console.log('Timeout waiting for .product-card selector:', err.message);
    });
    
    // Wait a bit more for dynamic content to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if we can find any product cards
    const cardCount = await page.evaluate(() => {
      return document.querySelectorAll('.product-card').length;
    });
    console.log(`Found ${cardCount} product cards on the page`);

    // Extract product data from the page
    const products = await page.evaluate(() => {
      const items = []; // Array to store scraped products
      console.log('Starting product extraction...');

      // Iterate over each product card
      const productCards = document.querySelectorAll('.product-card');
      console.log(`Found ${productCards.length} product cards`);
      
      productCards.forEach((el, i) => {
        if (i >= 16) return; // Limit results to 16 products

        // Extract product details using DOM selectors
        const titleEl = el.querySelector('.product-card__title');
        const priceEl = el.querySelector('.product-price.is--current-price');
        const linkEl = el.querySelector('a.product-card__link-overlay');
        const imgEl = el.querySelector('img');

        // Extract and clean product title
        const title = titleEl ? titleEl.textContent.trim() : '';

        // Extract and clean product price
        const price = priceEl ? priceEl.textContent.trim() : '';

        console.log(`Product ${i + 1}: Title="${title}", Price="${price}"`);

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
            console.log(`Calculated discount: ${discountPercentage}% (${oldPrice} -> ${price})`);
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
          });
          console.log(`Added product: ${title} - ${price}${oldPrice ? ` (was ${oldPrice})` : ''}${discountPercentage ? ` (${discountPercentage}% off)` : ''}`);
        } else {
          console.log(`Skipped product ${i + 1}: title=${!!title}, price=${!!price}, url=${!!finalUrl}, img=${!!finalImg}`);
        }
      });

      console.log(`Total products found: ${items.length}`);
      return items; // Return the array of scraped products
    });

    console.log(`Nike scraper completed. Found ${products.length} products.`);
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