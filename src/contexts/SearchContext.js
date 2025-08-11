'use client';

import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchData, setSearchData] = useState({
    showHomePage: true,
    messages: [],
    isLoading: false,
    selectedProduct: null,
    searchQuery: '',
    searchResults: [],
    error: null,
    hasActiveSearch: false,
    lastSearchQuery: ''
  });

  const handleSearch = async (query) => {
    try {
      setSearchData(prev => ({
        ...prev,
        isLoading: true,
        showHomePage: false,
        error: null,
        hasActiveSearch: true,
        lastSearchQuery: query,
        messages: [...prev.messages, { role: 'user', content: query }]
      }));

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur de recherche');
      }

      const data = await response.json();

      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        searchResults: data.products || [],
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: `Found ${data.products?.length || 0} products for "${query}"`,
            products: data.products || []
          }
        ]
      }));

    } catch (error) {
      console.error('Search Error:', error);
      setSearchData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: 'Erreur lors de la recherche: ' + error.message,
            products: []
          }
        ]
      }));
    }
  };

  const value = {
    ...searchData,
    setSearchData : (update) => setSearchData (prev => ({ ...prev, ...update })),
    handleSearch,
    clearActiveSearch: () => setSearchData(prev => ({ ...prev, hasActiveSearch: false, lastSearchQuery: '' }))
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

