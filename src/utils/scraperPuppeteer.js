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

    // Wait for product cards to appear (with a timeout of 6 seconds)
    await page.waitForSelector('.product-card', { timeout: 6000 }).catch(() => {});

    // Extract product data from the page
    const products = await page.evaluate(() => {
      const items = []; // Array to store scraped products

      // Iterate over each product card
      document.querySelectorAll('.product-card').forEach((el, i) => {
        if (i >= 8) return; // Limit results to 8 products

        // Extract product details using DOM selectors
        const titleEl = el.querySelector('.product-card__title');
        const priceEl = el.querySelector('.product-price');
        const linkEl = el.querySelector('a.product-card__link-overlay');
        const imgEl = el.querySelector('img');

        // Extract and clean product title
        const title = titleEl ? titleEl.textContent.trim() : '';

        // Extract and clean product price
        const price = priceEl ? priceEl.textContent.trim() : '';

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
        }

        // Extract old price (if available)
        const oldPriceEl = el.querySelector('.product-card__old-price');
        const oldPrice = oldPriceEl ? oldPriceEl.textContent.trim() : null;

        // Add product to the array if all required fields are present
        if (title && price && finalUrl && finalImg) {
          items.push({
            id: String(i), // Unique ID for the product
            title, // Product title
            price, // Current price
            oldPrice, // Old price (if available)
            url: finalUrl, // Product page URL
            image: finalImg, // Product image URL
            company: 'Nike', // Hardcoded company name
          });
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