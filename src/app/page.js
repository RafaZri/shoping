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
import HomePage from '../components/HomePage';
import AIResponse from '../components/AIResponse'; // Import the AIResponse component
import ProductGrid from '../components/ProductGrid'; // Import the ProductGrid component
import ChatSection from '../components/ChatSection'; // Import the ChatSection component
import styles from './page.module.css'; // Import CSS module for styling
import '../../globals.css'
import RightSideBar from '../components/RightSidebar';

export default function Home() {
  // State for storing chat messages (user and assistant)
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false); // State for managing loading state during API calls
  const [selectedProduct, setSelectedProduct] = useState(null); // State for storing the currently selected product
  const questionRef = useRef(null); // Ref for scrolling to the latest user question
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false); // Nouvel état pour gérer l'affichage des résultats de recherche

  // Effect: Scroll to the latest user question when a new query is submitted
  useEffect(() => {
    if (questionRef.current) {
      const offset = 100; // Adjust this value based on the search bar's height
      const topPos = questionRef.current.offsetTop - offset;

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

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]); // Add the user's query to the messages array

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations'); // Handle API errors

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.aiResponse,
        products: data.products || [], // Include product recommendations if available
      };
      setMessages((prev) => [...prev, assistantMessage]); // Add the assistant's response to the messages array
      setShowSearchResults(true); // Afficher les résultats de recherche après la première recherche
    } catch (error) {
      console.error('Error fetching recommendations:', error); // Log errors
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          products: [],
        },
      ]); // Display an error message in the chat if the API request fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Function: Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product); // Mettre à jour le produit sélectionné
    setIsChatOpen(true); // Ouvrir la section de chat
  };
  
  return (
    <main className={styles.main} id='home2'>
      {/* <HomePage /> */}
      <div className={styles.leftContainer}></div>
      <div className={styles.middleContainer}>
        <SearchBar onSearch={handleSearch} isLoading={loading} />
        {messages.length > 0 ? (
          <div className={styles.productsColumn}>
            {messages.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                {msg.role === 'user' ? (
                  <div ref={questionRef} className={styles.userBubble}>
                    {msg.content}
                  </div>
                ) : (
                  <div className={styles.aiMessageBlock}>
                    <><AIResponse answer={msg.content} /> </>
                    {msg.products.length > 0 ? (
                      <ProductGrid products={msg.products} onProductSelect={handleProductSelect} />
                    ) : (
                      <div className={styles.noProducts}></div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && <div className={styles.loading}>Searching...</div>}
          </div>
        ) : (
          <div className={styles.hero}></div>
        )}
      </div>
      <div className={styles.rightContainer}>
        <ChatSection
          selectedProduct={selectedProduct}
          isChatOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </main>
  );
}