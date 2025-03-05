import React from 'react';
import { ScraperOptions } from '../services/scraper';
import { X } from 'lucide-react';

interface AdvancedOptionsProps {
  options: ScraperOptions;
  setOptions: React.Dispatch<React.SetStateAction<ScraperOptions>>;
  onClose: () => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ options, setOptions, onClose }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Advanced Scraping Options</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeMetadata"
            name="includeMetadata"
            checked={options.includeMetadata}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeMetadata" className="ml-2 block text-sm text-gray-700">
            Extract Metadata
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="extractScripts"
            name="extractScripts"
            checked={options.extractScripts}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="extractScripts" className="ml-2 block text-sm text-gray-700">
            Extract Scripts
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="extractStyles"
            name="extractStyles"
            checked={options.extractStyles}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="extractStyles" className="ml-2 block text-sm text-gray-700">
            Extract Stylesheets
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeRawHtml"
            name="includeRawHtml"
            checked={options.includeRawHtml}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeRawHtml" className="ml-2 block text-sm text-gray-700">
            Include Raw HTML
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="extractTables"
            name="extractTables"
            checked={options.extractTables}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="extractTables" className="ml-2 block text-sm text-gray-700">
            Extract Tables
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="extractLists"
            name="extractLists"
            checked={options.extractLists}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="extractLists" className="ml-2 block text-sm text-gray-700">
            Extract Lists
          </label>
        </div>
      </div>
      
      <div className="mt-4">
        <label htmlFor="maxItems" className="block text-sm font-medium text-gray-700">
          Maximum items per category: {options.maxItems}
        </label>
        <input
          type="range"
          id="maxItems"
          name="maxItems"
          min="5"
          max="100"
          step="5"
          value={options.maxItems}
          onChange={handleChange}
          className="mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>5</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;