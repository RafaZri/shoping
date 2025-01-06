/**
 * API Route: /api/search
 * 
 * This API route handles two types of requests:
 * 1. Specific Product Queries: When a product is provided, it fetches detailed information
 *    about the product using GPT-4 and scrapes prices from Nike and Amazon.
 * 2. General Product Searches: When no specific product is provided, it uses GPT-4 to
 *    recommend products based on the user's query and scrapes prices for those products.
 * 
 * Dependencies:
 * - OpenAI: For generating AI responses.
 * - scrapeProductsCheerio: For scraping Amazon product prices.
 * - scrapeProductsPuppeteer: For scraping Nike product prices.
 * 
 * Endpoint:
 * - POST /api/search
 * 
 * Request Body:
 * - query (string): The user's search query.
 * - product (object, optional): The selected product for detailed queries.
 * 
 * Response:
 * - For specific product queries: Returns AI response and sorted price comparisons.
 * - For general product searches: Returns AI recommendations and filtered product data.
 */



import { NextResponse } from 'next/server'; // Import Next.js utility for handling server responses
import { OpenAI } from 'openai'; // Import OpenAI library for interacting with GPT models
import { scrapeProductsCheerio } from '../../../utils/scraper'; // Import Cheerio-based scraper for Amazon
import { scrapeProductsPuppeteer } from '../../../utils/scraperPuppeteer'; // Import Puppeteer-based scraper for Nike

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST function: Handles incoming POST requests to this API route
export async function POST(req) {
  try {
    // Parse the request body to extract the query and product data
    const { query, product } = await req.json();

    if (product) {
      // Handle specific product queries (when a product is provided)
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4", // 3.5 is way cheaper, but for better reults use "gpt-4" 
        messages: [
          {
            role: "system",
            content: `You are a shopping assistant. Provide an unbiased and detailed answer about the product: ${product.title}. Focus on its features, pros, cons, and suitability for different use cases.`,
          },
          {
            role: "user",
            content: `Query: "${query}"`, // Pass the user's query to the AI
          },
        ],
      });

      // Fetch prices for the selected product from Nike and Amazon using scrapers
      const [nikePrices, amazonPrices] = await Promise.all([
        scrapeProductsPuppeteer(product.title), // Scrape Nike for prices
        scrapeProductsCheerio(product.title),  // Scrape Amazon for prices
      ]);

      // Combine and sort prices from both retailers by price (low to high)
      const combinedPrices = [...nikePrices, ...amazonPrices].sort((a, b) => a.price - b.price);

      // Return the AI response and sorted price comparison data
      return NextResponse.json({
        aiResponse: aiResponse.choices[0].message.content, // Extract the AI's response
        prices: combinedPrices, // Sorted prices for comparison
      });
    } else {
      // Handle general product search (when no specific product is provided)
      const brand = query.split(' ')[0].toLowerCase(); // Extract the brand name from the query

      // Ask the AI for product recommendations based on the brand
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4", // Use GPT-4 model
        messages: [
          {
            role: "system",
            content: `You are a shopping assistant. Based on the user's query, recommend at least 8 specific product names or types that match the brand "${brand}". Avoid any vague or irrelevant recommendations. Provide the list as plain text, separated by commas.`,
          },
          {
            role: "user",
            content: `Query: "${query}"`, // Pass the user's query to the AI
          },
        ],
      });

      // Parse the AI's recommendations into an array of product names
      const aiRecommendations = aiResponse.choices[0].message.content
        .split(',')
        .map((rec) => rec.trim());

      // Scrape prices for each recommended product from Amazon and Nike
      const serverResults = await Promise.all(
        aiRecommendations.map(async (recommendation) => {
          const [amazonResults, nikeResults] = await Promise.all([
            scrapeProductsCheerio(recommendation), // Scrape Amazon for the product
            scrapeProductsPuppeteer(recommendation), // Scrape Nike for the product
          ]);
          return [...amazonResults, ...nikeResults]; // Combine results from both retailers
        })
      );

      // Filter products to ensure they match the brand name
      const filteredProducts = serverResults.flat().filter((product) =>
        product.title.toLowerCase().includes(brand)
      );

      // Return the AI's recommendations and filtered product data
      return NextResponse.json({
        aiResponse: `Here are my recommendations for "${query}": ${aiRecommendations.join(', ')}.`,
        products: filteredProducts, // Filtered product results
      });
    }
  } catch (error) {
    // Handle errors and return a 500 Internal Server Error response
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

