import React, { useState } from 'react';
import { Globe, Settings, Info } from 'lucide-react';
import ScraperForm from './components/ScraperForm';
import ScrapingResults from './components/ScrapingResults';
import AdvancedOptions from './components/AdvancedOptions';
import { scrapeWebsite, ScrapingResult, ScraperOptions } from './services/scraper';
import logo from './assets/logo.png'; 

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapingResult | null>(null);
  const [scrapedUrl, setScrapedUrl] = useState<string>('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [scraperOptions, setScraperOptions] = useState<ScraperOptions>({
    includeMetadata: true,
    extractScripts: false,
    extractStyles: false,
    maxItems: 20,
    includeRawHtml: false,
    extractTables: true,
    extractLists: true
  });

  const handleScrape = async (url: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await scrapeWebsite(url, scraperOptions);
      setResult(data);
      setScrapedUrl(url);
    } catch (error) {
      // Fix: Don't log the error object directly to avoid Symbol() serialization issues
      console.error('Error in scraping:', error instanceof Error ? error.message : 'Unknown error');
      setResult({
        title: '',
        headings: [],
        links: [],
        images: [],
        paragraphs: [],
        metadata: {},
        tables: [],
        lists: [],
        scripts: [],
        styles: [],
        rawHtml: '',
        error: error instanceof Error ? error.message : 'Failed to scrape website'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
  {/* Header */}
  <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
        <img src={logo} alt="ScraperEx Logo" className="h-10 w-auto mr-3" />
          <h1 className="text-3xl font-bold text-white">ScraperEx</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={toggleAdvancedOptions}
            className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full"
            title="Advanced Options"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={toggleInfo}
            className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full"
            title="About ScraperEx"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  </header>

  {/* Main Content */}
  <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Advanced Web Scraping Tool</h2>
          <p className="mt-1 text-gray-500">
            Extract structured data from any website with powerful customization options
          </p>
        </div>

        {showAdvancedOptions && (
          <AdvancedOptions 
            options={scraperOptions} 
            setOptions={setScraperOptions} 
            onClose={toggleAdvancedOptions}
          />
        )}

        <ScraperForm onSubmit={handleScrape} isLoading={isLoading} />
        
        {isLoading && (
          <div className="mt-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Scraping website data...</p>
          </div>
        )}

        {result && !isLoading && (
          <div className="mt-4 w-full">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Results from: <span className="font-medium">{scrapedUrl}</span>
              </p>
            </div>
            <ScrapingResults result={result} options={scraperOptions} />
          </div>
        )}

        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl m-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-blue-800">About ScraperEx</h3>
                <button 
                  onClick={toggleInfo}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="prose">
                <p className="mb-3">
                  <strong>ScraperEx</strong> is an advanced web scraping tool that allows you to extract and analyze structured data from websites. It uses multiple CORS proxy services to fetch HTML content and Cheerio to parse and extract elements.
                </p>
                <h4 className="text-lg font-semibold text-blue-700 mt-4">Features:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Extract headings, links, images, paragraphs, tables, and lists</li>
                  <li>Collect page metadata (meta tags, Open Graph data)</li>
                  <li>Extract and analyze scripts and stylesheets</li>
                  <li>View raw HTML with syntax highlighting</li>
                  <li>Multiple proxy services for reliable scraping</li>
                  <li>Customizable extraction options</li>
                </ul>
                <h4 className="text-lg font-semibold text-blue-700 mt-4">Limitations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Some websites may block scraping attempts</li>
                  <li>Dynamic content loaded via JavaScript may not be captured</li>
                  <li>CORS restrictions may limit access to certain sites</li>
                  <li>Large websites may take longer to process</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Note:</strong> Please use this tool responsibly and respect website terms of service and robots.txt directives.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </main>

  {/* Footer */}
  <footer className="bg-gray-800 text-white py-4">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <img src={logo} alt="ScraperEx Logo" className="h-10 w-auto mr-3" />
          <p className="text-sm">ScraperEx © 2025</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Advanced Web Scraping Tool</p>
        </div>
      </div>
    </div>
  </footer>
</div>
  );
}

export default App;