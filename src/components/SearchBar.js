/**
 * SearchBar Component
 * 
 * This component provides a search input field and a submit button.
 * It allows users to enter a search query and triggers a callback function
 * (`onSearch`) when the form is submitted. It also supports a loading state
 * to disable the input and button while a search is in progress.
 * 
 * Props:
 * - onSearch (function): A callback function triggered when the form is submitted.
 * - isLoading (boolean, optional): Indicates whether a search is in progress.
 * 
 * State:
 * - query (string): The current value of the search input field.
 */
import { useState } from 'react'; // Import React hooks for state management
import styles from './SearchBar.module.css'; // Import CSS module for component-specific styling
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ onSearch, isLoading = false }) {
  // State for managing the search query
  const [query, setQuery] = useState('');

  /**
   * handleSubmit Function
   * 
   * This function handles the form submission event.
   * It prevents the default form submission behavior, triggers the `onSearch`
   * callback with the current query, and resets the query state.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    onSearch(query); // Trigger the onSearch callback with the current query
    setQuery(''); // Reset the query state
  };

  return (
    <form
      className={`${styles.searchBar} ${isLoading ? styles.loading : ''}`} // Apply dynamic classes based on loading state
      onSubmit={handleSubmit} // Handle form submission
    >
      {/* Search Input Field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update query state as the user types
        placeholder="Search product..."
        className={styles.input}
        disabled={isLoading} // Disable input during loading
      />

      {/* Submit Button */}
      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? <div className={styles.spinner}></div> :'Search'} 
      </button>
    </form>
  );
}