/**
 * scrapeProductsCheerio Function
 * 
 * This function scrapes product data from Amazon based on a search query.
 * It uses Cheerio to parse the HTML response and extract product details such as
 * title, price, image, and URL. It limits the results to a maximum of 8 products.
 * 
 * @param {string} query - The search query used to find products on Amazon.
 * @returns {Array} - An array of product objects containing details like title, price, image, and URL.
 *                   Returns an empty array if an error occurs during scraping.
 */
import * as cheerio from 'cheerio'; // Import Cheerio for HTML parsing
import axios from 'axios'; // Import Axios for making HTTP requests

export async function scrapeProductsCheerio(query) {
  try {
    // Send a GET request to Amazon's search page with the query
    const response = await axios.get(
      `https://www.amazon.com/s?k=${encodeURIComponent(query)}`, // Encode query for URL
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36', // Mimic a real browser
          'Accept-Language': 'en-US,en;q=0.9', // Set language preferences
        },
      }
    );

    // Load the HTML response into Cheerio for parsing
    const $ = cheerio.load(response.data);
    const products = []; // Array to store scraped products

    // Iterate over each product in the search results
    $('.s-result-item').each((i, el) => {
      if (products.length >= 8) return false; // Limit results to 8 products

      // Extract product title
      const title = $(el).find('h2 span').text();

      // Extract and clean current price
      const currentPrice = $(el)
        .find('.a-price-whole')
        .text()
        .replace(/\.(?!\d)/, '') // Remove trailing period if not followed by a digit
        .trim();

      // Extract and clean old price (if available)
      const oldPrice = $(el)
        .find('.a-price.a-text-price .a-offscreen')
        .text()
        .replace(/\.(?!\d)/, '') // Remove trailing period if not followed by a digit
        .trim();

      // Extract product image URL
      const image = $(el).find('img').attr('src');

      // Construct full product URL
      const url = 'https://amazon.com' + $(el).find('a.a-link-normal').attr('href');

      // Add product to the array if all required fields are present
      if (title && currentPrice && image && url) {
        products.push({
          id: i.toString(), // Unique ID for the product
          title, // Product title
          price: `$${currentPrice}`, // Current price (formatted as a string)
          oldPrice: oldPrice ? `$${oldPrice}` : null, // Old price (formatted as a string, or null if not available)
          image, // Product image URL
          url, // Product page URL
          company: 'Amazon', // Hardcoded company name
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