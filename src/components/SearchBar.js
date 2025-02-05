'use client';
import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';
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
    <form className={`${styles.searchBar} ${isLoading ? styles.loading : ''} ${isHomePage ? styles.homePageVariant : ''}`} onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search product..."
        className={styles.input}
        disabled={isLoading}
      />
      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? (
          <div className={styles.spinner}></div>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}