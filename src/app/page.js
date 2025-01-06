/**
 * Home Page Component
 * 
 * This is the main page of the application. It includes:
 * - A search bar for user queries.
 * - A grid of AI responses and product recommendations.
 * - A chat section for interacting with a selected product.
 * 
 * State:
 * - messages (array): Stores chat messages (user and assistant).
 * - loading (boolean): Indicates whether a search is in progress.
 * - selectedProduct (object): The currently selected product for detailed chat.
 */

'use client'; // Marks this component as a Client Component in Next.js

import { useState, useEffect, useRef } from 'react'; // Import React hooks for state, side effects, and refs
import SearchBar from '../components/SearchBar'; // Import the SearchBar component
import AIResponse from '../components/AIResponse'; // Import the AIResponse component
import ProductGrid from '../components/ProductGrid'; // Import the ProductGrid component
import ChatSection from '../components/ChatSection'; // Import the ChatSection component
import styles from './page.module.css'; // Import CSS module for styling



export default function Home() {
  // State for storing chat messages (user and assistant)
  const [messages, setMessages] = useState([]); // Array of {role: 'user'|'assistant', content: string, products?: []}
  // State for managing loading state during API calls
  const [loading, setLoading] = useState(false);
  // State for storing the currently selected product
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Ref for scrolling to the latest user question
  const questionRef = useRef(null);

  // Effect: Scroll to the latest user question when a new query is submitted
  useEffect(() => {
    if (questionRef.current) {
      // Calculate the offset to account for the search bar's height
      const offset = 100; // Adjust this value based on the search bar's height
      const topPos = questionRef.current.offsetTop - offset;

      // Scroll to the question with the offset
      window.scrollTo({
        top: topPos,
        behavior: 'smooth', // Smooth scrolling for better UX
      });
    }
  }, [messages.filter((msg) => msg.role === 'user').length]); // Triggered only when a new user question is added

  // Function: Handle search queries
  const handleSearch = async (query) => {
    if (!query.trim()) return; // Ignore empty queries
    setLoading(true); // Set loading state to true

    // Add the user's query to the messages array
    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send the query to the backend API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations'); // Handle API errors

      // Parse the API response
      const data = await response.json();
      // Add the assistant's response and product recommendations to the messages array
      const assistantMessage = {
        role: 'assistant',
        content: data.aiResponse,
        products: data.products || [], // Include product recommendations if available
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching recommendations:', error); // Log errors
      // Display an error message in the chat if the API request fails
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          products: [],
        },
      ]);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function: Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product); // Update the selected product state
  };

  return (
    <main className={styles.main}>
      {/* Left Side: Empty for now */}
      <div className={styles.leftContainer}></div>

      {/* Middle: Search Bar, AI Answers, and Products */}
      <div className={styles.middleContainer}>
        {/* Search Bar Component */}
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {/* Display Messages and Products */}
        {messages.length > 0 ? (
          <div className={styles.productsColumn}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                {msg.role === 'user' ? (
                  // User Message Bubble
                  <div ref={questionRef} className={styles.userBubble}>
                    {msg.content}
                  </div>
                ) : (
                  // Assistant Message Block
                  <div className={styles.aiMessageBlock}>
                    {/* AI Response Component */}
                    <AIResponse answer={msg.content} />
                    {/* Product Grid Component (if products are available) */}
                    {msg.products.length > 0 ? (
                      <ProductGrid products={msg.products} onProductSelect={handleProductSelect} />
                    ) : (
                      <div className={styles.noProducts}></div> // Empty state if no products
                    )}
                  </div>
                )}
              </div>
            ))}
            {/* Loading Indicator */}
            {loading && <div className={styles.loading}>Searching...</div>}
          </div>
        ) : (
          // Hero Section (empty for now)
          <div className={styles.hero}></div>
        )}
      </div>

      {/* Right Side: Chat Section for Specific Product */}
      <div className={styles.rightContainer}>
        {/* ChatSection Component */}
        <ChatSection selectedProduct={selectedProduct} />
      </div>
    </main>
  );
}