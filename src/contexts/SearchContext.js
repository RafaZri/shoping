'use client';

import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { user, refreshAuth } = useAuth();
  const [searchData, setSearchData] = useState({
    showHomePage: true,
    messages: [],
    isLoading: false,
    selectedProduct: null,
    searchQuery: '',
    searchResults: [],
    error: null,
    hasActiveSearch: false,
    lastSearchQuery: '',
    showSearchHistory: false
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

      // Get the auth token from cookies - simpler approach
      const getAuthToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'auth-token') {
            return value;
          }
        }
        return null;
      };

      const authToken = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        // If no cookie, try to get token from /api/auth/me
        try {
          const authResponse = await fetch('/api/auth/me');
          if (authResponse.ok) {
            const authData = await authResponse.json();
            // If user is authenticated, we can still save search history
            headers['X-User-Id'] = authData.user.id;
          }
        } catch (authError) {
          // Continue without auth
        }
      }

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: headers,
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
        loadMoreProducts: data.loadMoreProducts || [],
        hasMoreProducts: data.hasMoreProducts || false,
        messages: [
          ...prev.messages,
          {
            role: 'assistant',
            content: `Found ${data.products?.length || 0} products for "${query}"`,
            products: data.products || [],
            loadMoreProducts: data.loadMoreProducts || [],
            hasMoreProducts: data.hasMoreProducts || false
          }
        ]
      }));

      // Refresh user data to get updated search history
      try {
        await refreshAuth();
      } catch (authError) {
        // Continue without updating user data
      }

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

  const fetchNikeProducts = async (query) => {
    try {
      const response = await fetch('/api/nike-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      }
    } catch (error) {
      console.error('Error fetching Nike products:', error);
    }
    return [];
  };

  const value = {
    ...searchData,
    setSearchData : (update) => setSearchData (prev => ({ ...prev, ...update })),
    handleSearch,
    fetchNikeProducts,
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

