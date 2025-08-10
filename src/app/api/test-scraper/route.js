/**
 * API Route: /api/test-scraper
 * 
 * This API route is a test endpoint for scraping product data from Nike and Amazon.
 * It uses two different scraping methods:
 * - Puppeteer for Nike (to handle dynamic content).
 * - Cheerio for Amazon (to handle static content).
 * 
 * The scraped data is returned in a structured JSON format, either separately or merged.
 * 
 * Endpoint:
 * - GET /api/test-scraper
 * 
 * Response:
 * - success (boolean): Indicates whether the scraping was successful.
 * - queries (object): Contains the search queries used for scraping.
 * - products (object): Contains the scraped products from Nike and Amazon.
 * - error (string, optional): Error message if scraping fails.
 */
import { NextResponse } from 'next/server'; // Import Next.js utility for handling server responses

// Import both scrapers with unique names
import { scrapeProductsPuppeteer } from '../../../utils/scrapers/scraperPuppeteer'; // Puppeteer-based scraper for Nike
import { scrapeProductsCheerio } from '../../../utils/scrapers/scraper'; // Cheerio-based scraper for Amazon

// GET function: Handles incoming GET requests to this API route
export async function GET() {
  try {
    // 1. Scrape from Nike (using Puppeteer)
    const nikeQuery = 'running shoes'; // Search query for Nike
    const nikeProducts = await scrapeProductsPuppeteer(nikeQuery); // Scrape Nike products

    // 2. Scrape from Amazon (using Cheerio)
    const amazonQuery = 'running shoes'; // Search query for Amazon
    const amazonProducts = await scrapeProductsCheerio(amazonQuery); // Scrape Amazon products

    // Return the scraped data in a structured JSON format
    return NextResponse.json({
      success: true, // Indicates successful scraping
      queries: { nikeQuery, amazonQuery }, // Search queries used
      products: {
        nike: nikeProducts, // Scraped products from Nike
        amazon: amazonProducts, // Scraped products from Amazon
      },
    });
  } catch (error) {
    // Handle errors and return a 500 Internal Server Error response
    console.error('Error in test scraper:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape products.' }, // Error message
      { status: 500 } // HTTP status code
    );
  }
}