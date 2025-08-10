import React, { useState, useEffect } from 'react';
import styles from './ChatSection.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

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

// Logo Component
const Logo = () => (
  <div className={styles.logoContainer}>
    <div className={styles.logoIcon}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#374151"/>
        <rect x="8" y="6" width="8" height="6" rx="2" fill="#3b82f6"/>
        <path d="M10 8h4v2h-4z" fill="white"/>
      </svg>
    </div>
    <div className={styles.logoText}>
      <div>Price</div>
      <div>Compare</div>
    </div>
  </div>
);

// Function to truncate product title
const truncateTitle = (title, maxWords = 3) => {
  const words = title.split(' ');
  if (words.length <= maxWords) return title;
  return words.slice(0, maxWords).join(' ') + '...';
};

// ChatSection: The main component for price comparison
const ChatSection = ({ selectedProduct, onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentLanguage } = useLanguage();

  // Auto-open sidebar when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      setIsSidebarOpen(true);
    }
  }, [selectedProduct]);

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen && onClose) {
      onClose();
    }
  };

  // Generate price comparison data based on actual scraped retailers
  const generatePriceComparison = () => {
    if (!selectedProduct) return [];
    
    const priceComparison = [];
    
    // Only include the current retailer where the product actually exists
    const currentRetailer = {
      name: selectedProduct.company,
      logo: selectedProduct.company === 'Amazon' 
        ? 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
        : 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
      price: selectedProduct.price,
      link: selectedProduct.url,
      inStock: true,
      shipping: getTranslation('freeShipping', currentLanguage),
      productName: selectedProduct.title
    };
    
    priceComparison.push(currentRetailer);
    
    // For now, we only show the retailer where the product actually exists
    // In the future, when you scrape the same product from multiple retailers,
    // you can add them here by checking if the exact same product exists
    // Example: if (sameProductExistsOnNike) { priceComparison.push(nikeData); }
    
    return priceComparison;
  };

  const priceComparison = generatePriceComparison();

  return (
    <div className={`${styles.chatSection} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      {/* Sidebar toggle button */}
      <button
        onClick={handleToggle}
        className={styles.toggleButton}
      >
        <Logo />
        <ToggleIcon isOpen={isSidebarOpen} />
      </button>

      {/* Price comparison content */}
      {isSidebarOpen && (
        <div className={styles.productContent}>
          {selectedProduct && (
            <>
              {/* Product Header */}
              <div className={styles.productHeader}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className={styles.productImage}
                />
                <h3 className={styles.productName}>{truncateTitle(selectedProduct.title)}</h3>
                <div className={styles.productPrice}>{selectedProduct.price}</div>
              </div>

              {/* Price Comparison Section */}
              <div className={styles.priceComparison}>
                <h3 className={styles.comparisonTitle}>{getTranslation('priceComparison', currentLanguage)}</h3>
                <div className={styles.priceTable}>
                  <table>
                    <thead>
                      <tr>
                        <th>{getTranslation('store', currentLanguage)}</th>
                        <th>{getTranslation('price', currentLanguage)}</th>
                        <th>{getTranslation('shipping', currentLanguage)}</th>
                        <th>{getTranslation('stock', currentLanguage)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceComparison.map((item, index) => (
                        <tr key={index} className={styles.inStock}>
                          <td>
                            <div className={styles.retailerInfo}>
                              <img src={item.logo} alt={item.name} className={styles.retailerLogo} />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className={styles.priceCell}>
                            {item.price}
                          </td>
                          <td>{item.shipping}</td>
                          <td>
                            <span className={styles.stockIn}>
                              {getTranslation('inStock', currentLanguage)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatSection; 