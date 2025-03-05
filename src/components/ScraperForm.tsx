import React, { useState } from 'react';
import { Search, History, X } from 'lucide-react';

interface ScraperFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const ScraperForm: React.FC<ScraperFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('scraperHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Add to history if not already present
      if (!history.includes(url.trim())) {
        const newHistory = [url.trim(), ...history.slice(0, 9)]; // Keep only last 10 items
        setHistory(newHistory);
        localStorage.setItem('scraperHistory', JSON.stringify(newHistory));
      }
      onSubmit(url.trim());
    }
  };

  const handleHistorySelect = (selectedUrl: string) => {
    setUrl(selectedUrl);
    setShowHistory(false);
    onSubmit(selectedUrl);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scraperHistory');
    setShowHistory(false);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center border-2 border-blue-500 rounded-lg py-2 px-3 bg-white shadow-md">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          {url && !isLoading && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 mr-2"
              onClick={() => setUrl('')}
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className={`text-gray-400 hover:text-gray-600 mr-2 ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setShowHistory(!showHistory)}
            disabled={history.length === 0}
          >
            <History size={16} />
          </button>
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-3 rounded-lg flex items-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scraping...
              </span>
            ) : (
              <>
                <Search size={16} className="mr-1" />
                Scrape
              </>
            )}
          </button>
        </div>
      </form>
      
      {showHistory && history.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {history.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-center"
                  onClick={() => handleHistorySelect(item)}
                >
                  <History size={14} className="mr-2 text-gray-400" />
                  <span className="truncate">{item}</span>
                </button>
              </li>
            ))}
            <li className="border-t border-gray-100">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={clearHistory}
              >
                Clear History
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScraperForm;