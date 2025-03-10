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

import { useState, useEffect, useRef } from 'react';
import styles from './ChatSection.module.css';

const SubmitIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
  </svg>
);

// ToggleIcon: Icon for the sidebar toggle button
const ToggleIcon = ({ isOpen }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
  >
    <path d="M12 2l8 8H4l8-8zm0 20l-8-8h16l-8 8z" fill="currentColor" />
  </svg>
);

// ChatSection: The main component for displaying product details, price comparison, and chat
const ChatSection = ({ selectedProduct }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [prices, setPrices] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar starts closed
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    if (selectedProduct) {
      const productPrices = selectedProduct.prices || [];
      setPrices(productPrices);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: query }]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: selectedProduct, query }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.aiResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    }

    setQuery('');
  };

  return (
    <div className={`${styles.chatSection} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={styles.toggleButton}
      >
        <h3>CHAT</h3>
        <ToggleIcon isOpen={isSidebarOpen} />
      </button>

      {/* Sidebar content */}
      {isSidebarOpen && (
        <div className={styles.topHalf} style={{ overflowX: 'hidden' }}>
          {selectedProduct && (
            <div className={styles.productHeader}>
              <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className={styles.productImage}
                />
              </a>
              <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer">
                <h3 className={styles.productName}>{selectedProduct.title}</h3>
              </a>
              <div className={styles.productDetails}>
                <span className={styles.productPrice}>{selectedProduct.price}</span>
                <span className={styles.productCompany}>{selectedProduct.company}</span>
              </div>
            </div>
          )}
          {selectedProduct && (
            <div className={styles.priceComparison}>
              {prices.length > 0 ? (
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
                <p className={styles.noComparison}>No comparisons found.</p>
                
              )}
            </div>
            
          )}
        </div>
      )}
      
      {/* Chat messages and input */}
      <div className={styles.bottomHalf}>
        
        <div className={styles.chatMessages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about this product..."
            className={styles.chatInput}
          />
          <button onClick={handleQuerySubmit} className={styles.submitButton}>
            <SubmitIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
