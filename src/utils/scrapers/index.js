import { scrapeProductsCheerio } from './scraper';
import { scrapeProductsPuppeteer } from './scraperPuppeteer'; 

export * from './scraper'; // Export Amazon Cheerio
export * from './scraperPuppeteer'; // Export Nike Puppeteer

// Combined scraper for Amazon and Nike only
export async function combinedScraper(query) {
  try {
    // Use real scrapers for Amazon and Nike
    const [amazonResults, nikeResults] = await Promise.allSettled([
      scrapeProductsCheerio(query),
      scrapeProductsPuppeteer(query)
    ]);

    return {
      amazon: amazonResults.status === 'fulfilled' ? amazonResults.value : [],
      nike: nikeResults.status === 'fulfilled' ? nikeResults.value : [],
      error: {
        amazon: amazonResults.status === 'rejected' ? amazonResults.reason.message : null,
        nike: nikeResults.status === 'rejected' ? nikeResults.reason.message : null
      }
    };
  } catch (error) {
    console.error('Global scraping error:', error);
    return { 
      amazon: [], 
      nike: [], 
      error: error.message 
    };
  }
}