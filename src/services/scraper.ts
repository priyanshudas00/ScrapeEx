import * as cheerio from 'cheerio';
import { fetchWithProxy } from './proxy-server';
import { convert } from 'html-to-text';

export interface ScrapingResult {
  title: string;
  headings: string[];
  links: { text: string; url: string }[];
  images: { alt: string; src: string }[];
  paragraphs: string[];
  tables?: { headers: string[]; rows: string[][] }[];
  lists?: { type: 'ordered' | 'unordered'; items: string[] }[];
  metadata?: Record<string, string>;
  scripts?: { src?: string; content?: string }[];
  styles?: { href?: string; content?: string }[];
  rawHtml?: string;
  error?: string;
}

export interface ScraperOptions {
  includeMetadata: boolean;
  extractScripts: boolean;
  extractStyles: boolean;
  maxItems: number;
  includeRawHtml: boolean;
  extractTables: boolean;
  extractLists: boolean;
}

export async function scrapeWebsite(url: string, options: ScraperOptions): Promise<ScrapingResult> {
  try {
    // Use our proxy service to fetch the HTML content
    const html = await fetchWithProxy(url);
    
    const $ = cheerio.load(html);
    
    // Extract data
    const title = $('title').text().trim();
    
    const headings: string[] = [];
    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
      const text = $(element).text().trim();
      if (text) headings.push(text);
    });
    
    const links: { text: string; url: string }[] = [];
    $('a').each((_, element) => {
      const text = $(element).text().trim();
      let href = $(element).attr('href') || '';
      
      // Handle relative URLs
      if (href && href.startsWith('/')) {
        try {
          const baseUrl = new URL(url);
          href = `${baseUrl.origin}${href}`;
        } catch (e) {
          // If URL parsing fails, keep the original href
        }
      }
      
      if (href) links.push({ text, url: href });
    });
    
    const images: { alt: string; src: string }[] = [];
    $('img').each((_, element) => {
      const alt = $(element).attr('alt') || '';
      let src = $(element).attr('src') || '';
      
      // Handle relative URLs for images
      if (src && src.startsWith('/')) {
        try {
          const baseUrl = new URL(url);
          src = `${baseUrl.origin}${src}`;
        } catch (e) {
          // If URL parsing fails, keep the original src
        }
      }
      
      if (src) images.push({ alt, src });
    });
    
    const paragraphs: string[] = [];
    $('p').each((_, element) => {
      const text = $(element).text().trim();
      if (text) paragraphs.push(text);
    });
    
    // Advanced extraction based on options
    let tables: { headers: string[]; rows: string[][] }[] = [];
    let lists: { type: 'ordered' | 'unordered'; items: string[] }[] = [];
    let metadata: Record<string, string> = {};
    let scripts: { src?: string; content?: string }[] = [];
    let styles: { href?: string; content?: string }[] = [];
    
    // Extract tables
    if (options.extractTables) {
      $('table').each((_, tableElement) => {
        const headers: string[] = [];
        const rows: string[][] = [];
        
        // Extract headers
        $(tableElement).find('thead th, tr th').each((_, headerCell) => {
          headers.push($(headerCell).text().trim());
        });
        
        // If no headers found in th elements, use first row as header
        if (headers.length === 0) {
          $(tableElement).find('tr:first-child td').each((_, cell) => {
            headers.push($(cell).text().trim());
          });
          
          // Extract data rows (skip first row if it was used as header)
          $(tableElement).find('tr:not(:first-child)').each((_, rowElement) => {
            const row: string[] = [];
            $(rowElement).find('td').each((_, cell) => {
              row.push($(cell).text().trim());
            });
            if (row.length > 0) rows.push(row);
          });
        } else {
          // Extract all data rows
          $(tableElement).find('tbody tr').each((_, rowElement) => {
            const row: string[] = [];
            $(rowElement).find('td').each((_, cell) => {
              row.push($(cell).text().trim());
            });
            if (row.length >  0) rows.push(row);
          });
        }
        
        // Only add tables with actual data
        if (headers.length > 0 || rows.length > 0) {
          tables.push({ headers, rows });
        }
      });
    }
    
    // Extract lists
    if (options.extractLists) {
      $('ul').each((_, listElement) => {
        const items: string[] = [];
        $(listElement).find('li').each((_, item) => {
          const text = $(item).text().trim();
          if (text) items.push(text);
        });
        
        if (items.length > 0) {
          lists.push({ type: 'unordered', items });
        }
      });
      
      $('ol').each((_, listElement) => {
        const items: string[] = [];
        $(listElement).find('li').each((_, item) => {
          const text = $(item).text().trim();
          if (text) items.push(text);
        });
        
        if (items.length > 0) {
          lists.push({ type: 'ordered', items });
        }
      });
    }
    
    // Extract metadata
    if (options.includeMetadata) {
      // Standard meta tags
      $('meta').each((_, element) => {
        const name = $(element).attr('name') || $(element).attr('property') || '';
        const content = $(element).attr('content') || '';
        
        if (name && content) {
          metadata[name] = content;
        }
      });
      
      // Open Graph meta tags
      $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property') || '';
        const content = $(element).attr('content') || '';
        
        if (property && content) {
          metadata[property] = content;
        }
      });
      
      // Twitter card meta tags
      $('meta[name^="twitter:"]').each((_, element) => {
        const name = $(element).attr('name') || '';
        const content = $(element).attr('content') || '';
        
        if (name && content) {
          metadata[name] = content;
        }
      });
    }
    
    // Extract scripts
    if (options.extractScripts) {
      $('script').each((_, element) => {
        const src = $(element).attr('src');
        const content = $(element).html() || '';
        
        scripts.push({
          src,
          content: content.trim()
        });
      });
    }
    
    // Extract styles
    if (options.extractStyles) {
      $('link[rel="stylesheet"]').each((_, element) => {
        styles.push({
          href: $(element).attr('href')
        });
      });
      
      $('style').each((_, element) => {
        styles.push({
          content: $(element).html()?.trim()
        });
      });
    }
    
    return {
      title,
      headings: headings.slice(0, options.maxItems),
      links: links.slice(0, options.maxItems),
      images: images.slice(0, options.maxItems),
      paragraphs: paragraphs.slice(0, options.maxItems),
      tables: tables.slice(0, options.maxItems),
      lists: lists.slice(0, options.maxItems),
      metadata,
      scripts: scripts.slice(0, options.maxItems),
      styles: styles.slice(0, options.maxItems),
      rawHtml: options.includeRawHtml ? html : undefined
    };
  } catch (error) {
    // Extract only the message and log that
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Scraping error:', errorMessage);
    
    return {
      title: '',
      headings: [],
      links: [],
      images: [],
      paragraphs: [],
      error: errorMessage
    };
  }
}