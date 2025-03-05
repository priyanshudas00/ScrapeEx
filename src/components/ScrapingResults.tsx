import React, { useState } from 'react';
import { ScrapingResult, ScraperOptions } from '../services/scraper';
import { FileText, Link2, Image, Heading, AlertCircle, Table2, List, Code, FileJson, FileCode } from 'lucide-react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';

SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('javascript', js);

interface ScrapingResultsProps {
  result: ScrapingResult | null;
  options: ScraperOptions;
}

type TabType = 'headings' | 'links' | 'images' | 'paragraphs' | 'tables' | 'lists' | 'metadata' | 'scripts' | 'styles' | 'html';

const ScrapingResults: React.FC<ScrapingResultsProps> = ({ result, options }) => {
  const [activeTab, setActiveTab] = useState<TabType>('headings');

  if (!result) return null;
  
  if (result.error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error scraping website: {result.error}
            </p>
            <p className="text-sm text-red-700 mt-2">
              Try a different website or check if the site allows scraping.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'headings':
        return (
          <div>
            {result.headings.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {result.headings.map((heading, index) => (
                  <li key={index} className="py-2">
                    <p className="text-gray-800">{heading}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No headings found</p>
            )}
          </div>
        );
      
      case 'links':
        return (
          <div>
            {result.links.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {result.links.map((link, index) => (
                  <li key={index} className="py-2">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      <Link2 size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{link.text || '(No text)'}</span>
                    </a>
                    <p className="text-xs text-gray-500 mt-1 truncate">{link.url}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No links found</p>
            )}
          </div>
        );
      
      case 'images':
        return (
          <div>
            {result.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {result.images.map((image, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={image.src} 
                        alt={image.alt || 'Image'} 
                        className="max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150?text=Image+Error';
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{image.alt || 'No alt text'}</p>
                    <p className="text-xs text-gray-400 mt-1 truncate">{image.src}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No images found</p>
            )}
          </div>
        );
      
      case 'paragraphs':
        return (
          <div>
            {result.paragraphs.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {result.paragraphs.map((paragraph, index) => (
                  <li key={index} className="py-2">
                    <p className="text-gray-800">{paragraph}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No paragraphs found</p>
            )}
          </div>
        );
      
      case 'tables':
        return (
          <div>
            {result.tables && result.tables.length > 0 ? (
              <div className="space-y-6">
                {result.tables.map((table, tableIndex) => (
                  <div key={tableIndex} className="overflow-x-auto">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Table {tableIndex + 1}</h4>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {table.headers.map((header, index) => (
                            <th 
                              key={index}
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td 
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No tables found</p>
            )}
          </div>
        );
      
      case 'lists':
        return (
          <div>
            {result.lists && result.lists.length > 0 ? (
              <div className="space-y-6">
                {result.lists.map((list, listIndex) => (
                  <div key={listIndex} className="bg-white rounded border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {list.type === 'ordered' ? 'Ordered List' : 'Unordered List'} {listIndex + 1}
                    </h4>
                    {list.type === 'ordered' ? (
                      <ol className="list-decimal pl-5">
                        {list.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 py-1">{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="list-disc pl-5">
                        {list.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-gray-700 py-1">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No lists found</p>
            )}
          </div>
        );
      
      case 'metadata':
        return (
          <div>
            {result.metadata && Object.keys(result.metadata).length > 0 ? (
              <div className="bg-white rounded border border-gray-200 p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Page Metadata</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(result.metadata).map(([key, value], index) => (
                    <div key={index} className="border-b border-gray-100 pb-2">
                      <p className="text-xs font-medium text-gray-500">{key}</p>
                      <p className="text-sm text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No metadata found</p>
            )}
          </div>
        );
      
      case 'scripts':
        return (
          <div>
            {result.scripts && result.scripts.length > 0 ? (
              <div className="space-y-4">
                {result.scripts.map((script, index) => (
                  <div key={index} className="bg-gray-50 rounded border border-gray-200">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Script {index + 1}</h4>
                        {script.src && (
                          <span className="text-xs text-gray-500 truncate max-w-xs">{script.src}</span>
                        )}
                      </div>
                    </div>
                    {script.content && (
                      <div className="p-1 text-xs">
                        <SyntaxHighlighter 
                          language="javascript" 
                          style={atomOneDark}
                          customStyle={{ margin: 0, borderRadius: '0.25rem' }}
                          showLineNumbers
                        >
                          {script.content.length > 500 
                            ? script.content.substring(0, 500) + '...' 
                            : script.content}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No scripts found or script extraction was disabled</p>
            )}
          </div>
        );
      
      case 'styles':
        return (
          <div>
            {result.styles && result.styles.length > 0 ? (
              <div className="space-y-4">
                {result.styles.map((style, index) => (
                  <div key={index} className="bg-gray-50 rounded border border-gray-200">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Stylesheet {index + 1}</h4>
                        {style.href && (
                          <span className="text-xs text-gray-500 truncate max-w-xs">{style.href}</span>
                        )}
                      </div>
                    </div>
                    {style.content && (
                      <div className="p-1 text-xs">
                        <SyntaxHighlighter 
                          language="css" 
                          style={atomOneDark}
                          customStyle={{ margin: 0, borderRadius: '0.25rem' }}
                          showLineNumbers
                        >
                          {style.content.length > 500 
                            ? style.content.substring(0, 500) + '...' 
                            : style.content}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No stylesheets found or stylesheet extraction was disabled</p>
            )}
          </div>
        );
      
      case 'html':
        return (
          <div>
            {result.rawHtml ? (
              <div className="bg-gray-50 rounded border border-gray-200">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">Raw HTML</h4>
                </div>
                <div className="p-1 text-xs">
                  <SyntaxHighlighter 
                    language="html" 
                    style={atomOneDark}
                    customStyle={{ margin: 0, borderRadius: '0.25rem' }}
                    showLineNumbers
                  >
                    {result.rawHtml.length > 10000 
                      ? result.rawHtml.substring(0, 10000) + '...' 
                      : result.rawHtml}
                  </SyntaxHighlighter>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">Raw HTML extraction was disabled</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden w-full max-w-4xl">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <h2 className="text-xl font-semibold text-blue-800">{result.title || 'Untitled Page'}</h2>
      </div>
      
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'headings' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('headings')}
        >
          <Heading size={16} className="mr-1" /> Headings ({result.headings.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'links' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('links')}
        >
          <Link2 size={16} className="mr-1" /> Links ({result.links.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'images' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('images')}
        >
          <Image size={16} className="mr-1" /> Images ({result.images.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'paragraphs' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('paragraphs')}
        >
          <FileText size={16} className="mr-1" /> Paragraphs ({result.paragraphs.length})
        </button>
        
        {options.extractTables && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'tables' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tables')}
          >
            <Table2 size={16} className="mr-1" /> Tables ({result.tables?.length || 0})
          </button>
        )}
        
        {options.extractLists && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'lists' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('lists')}
          >
            <List size={16} className="mr-1" /> Lists ({result.lists?.length || 0})
          </button>
        )}
        
        {options.includeMetadata && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'metadata' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('metadata')}
          >
            <FileJson size={16} className="mr-1" /> Metadata
          </button>
        )}
        
        {options.extractScripts && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'scripts' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('scripts')}
          >
            <FileCode size={16} className="mr-1" /> Scripts ({result.scripts?.length || 0})
          </button>
        )}
        
        {options.extractStyles && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'styles' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('styles')}
          >
            <Code size={16} className="mr-1" /> Styles ({result.styles?.length || 0})
          </button>
        )}
        
        {options.includeRawHtml && (
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center ${activeTab === 'html' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('html')}
          >
            <Code size={16} className="mr-1" /> HTML
          </button>
        )}
      </div>
      
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default ScrapingResults;