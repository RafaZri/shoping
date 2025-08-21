import { NextResponse } from 'next/server';
import { scrapeProductsPuppeteer } from '../../../utils/scrapers/scraperPuppeteer.js';

export async function POST(req) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Run Nike scraper
    const nikeResults = await scrapeProductsPuppeteer(query);
    const nike = nikeResults || [];

    return NextResponse.json({
      products: nike,
      success: true
    });

  } catch (error) {
    console.error('Nike products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Nike products' },
      { status: 500 }
    );
  }
}
