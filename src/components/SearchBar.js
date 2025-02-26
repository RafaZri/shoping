'use client';
import { useState, useEffect } from 'react';
import './SearchBar.css'; 
import { useSearch } from '../contexts/SearchContext';

export default function SearchBar({isHomePage}) {
  const { handleSearch, isLoading } = useSearch();
  const [query, setQuery] = useState('');;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query); // Utilisation directe du contexte
      setQuery('');
    }
  };

  return (
    <form className={`searchBar ${isLoading ? 'loading' : ''} ${isHomePage ? 'homePageVariant' : ''}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
        className="input rounded-full"
        disabled={isLoading}
      />
      <button type="submit" className="button rounded-1xl" disabled={isLoading}>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}