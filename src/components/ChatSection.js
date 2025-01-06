/**
 * ChatSection Component
 * 
 * This component provides a chat interface for interacting with a selected product.
 * It includes:
 * - A top section displaying product details and price comparisons.
 * - A bottom section for chat messages and user input.
 * 
 * Props:
 * - selectedProduct (object): The currently selected product to display and chat about.
 */

import { useState, useEffect, useRef } from 'react'; // Import React hooks for state, side effects, and refs
import styles from './ChatSection.module.css'; // Import CSS module for component-specific styling

// SubmitIcon: A reusable SVG icon for the submit button
const SubmitIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
  </svg>
);

// ChatSection: The main component for displaying product details, price comparison, and chat
const ChatSection = ({ selectedProduct }) => {
  // State for managing the user's input query
  const [query, setQuery] = useState('');
  // State for storing chat messages (user and assistant)
  const [messages, setMessages] = useState([]);
  // State for storing product prices from different retailers
  const [prices, setPrices] = useState([]);
  // Ref for scrolling to the bottom of the chat messages
  const messagesEndRef = useRef(null);

  // Effect: Reset chat and update prices when the selected product changes
  useEffect(() => {
    setMessages([]); // Clear all chat messages when a new product is selected

    if (selectedProduct) {
      // Extract prices from the selected product or default to an empty array
      const productPrices = selectedProduct.prices || [];
      setPrices(productPrices); // Update the prices state with the new product's prices
    }
  }, [selectedProduct]); // Dependency: Runs when selectedProduct changes

  // Effect: Automatically scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the latest message
    }
  }, [messages]); // Dependency: Runs when messages are updated

  // Function: Handle the submission of a user query
  const handleQuerySubmit = async () => {
    if (!query.trim()) return; // Ignore empty queries

    // Add the user's query to the messages array
    setMessages((prev) => [...prev, { role: 'user', content: query }]);

    try {
      // Send the query and selected product data to the backend API
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: selectedProduct, query }),
      });
      const data = await res.json(); // Parse the API response

      // Add the assistant's response to the messages array
      setMessages((prev) => [...prev, { role: 'assistant', content: data.aiResponse }]);
    } catch (error) {
      console.error('Error:', error); // Log any errors
      // Display an error message in the chat if the API request fails
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    }

    setQuery(''); // Clear the input field after submission
  };

  return (
    <div className={styles.chatSection}>
      {/* Top Half: Display product details and price comparison */}
      <div className={styles.topHalf}>
        {selectedProduct && ( // Only render if a product is selected
          <div className={styles.productHeader}>
            {/* Clickable Product Image */}
            <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className={styles.productImage}
              />
            </a>

            {/* Clickable Product Name */}
            <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">
              <h3 className={styles.productName}>{selectedProduct.title}</h3>
            </a>

            {/* Display Product Price and Company */}
            <div className={styles.productDetails}>
              <span className={styles.productPrice}>{selectedProduct.price}</span>
              <span className={styles.productCompany}>{selectedProduct.company}</span>
            </div>
          </div>
        )}

        {/* Price Comparison Table */}
        {selectedProduct && (
          <div className={styles.priceComparison}>
            {prices.length > 0 ? ( // Check if there are prices to display
              <table className={styles.priceTable}>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Retailer</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price, index) => (
                    <tr key={index}>
                      <td>{price.productName}</td>
                      <td>{price.amount}</td>
                      <td>
                        <a href={price.providerUrl} target="_blank" rel="noopener noreferrer">
                          <img
                            src={price.providerIcon}
                            alt={price.provider}
                            className={styles.providerLogo}
                          />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noComparison}>No comparisons found.</p> // Fallback if no prices are available
            )}
          </div>
        )}
      </div>

      {/* Bottom Half: Chat Messages and Input */}
      <div className={styles.bottomHalf}>
        <div className={styles.chatMessages}>
          {/* Render chat messages */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              {msg.content}
            </div>
          ))}
          {/* Invisible div for auto-scrolling to the latest message */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field and Submit Button */}
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update query state as the user types
            placeholder="Ask about this product..."
            className={styles.chatInput}
          />
          <button onClick={handleQuerySubmit} className={styles.submitButton}>
            <SubmitIcon /> {/* Render the submit icon */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection; // Export the component for use in other parts of the app

