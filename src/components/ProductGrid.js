
import React from 'react'; // Import React
import styles from './ProductGrid.module.css'; // Import CSS module for component-specific styling

// InfoIcon: A reusable SVG icon for displaying additional information
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
  </svg>
);

// ProductsGrid Component: Displays a grid of product cards
const ProductsGrid = ({ products, onProductSelect }) => {
  // If there are no products, return nothing (or a fallback message)
  if (!products || products.length === 0) {
    return null; // or <p>No products found.</p>
  }

  // Function: Get the logo URL based on the company name
  const getLogo = (company) => {
    if (company === 'Amazon') {
      return 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
    }
    if (company === 'Nike') {
      return 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg';
    }
    return ''; // Return an empty string if the company is not recognized
  };

  // Function: Hide the scroll bar but keep the page scrollable
  const hideScrollBar = () => {
    document.body.style.overflow = 'hidden';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 px-6 md:px-16 lg:px-32 mt-6 pb-14 w-full" onMouseEnter={hideScrollBar} onMouseLeave={() => document.body.style.overflow = 'auto'}>
      {/* Map through the products array and render a card for each product */}
      {products.map((item) => (
        <div key={item.id} className={styles.productCard}>
          {/* Clickable image container */}
          

          {/* Text content */}
          <div className={styles.cardBody}>
            {/* Truncated product title */}
            <h4 className={styles.productTitle}>{item.title}</h4>

            {/* Price Container */}
            <div className={styles.priceContainer}>
              {/* Current price */}
              <span className={styles.currentPrice}>{item.price}</span>
              {/* Old price (if available) */}
              {item.oldPrice && (
                <span className={styles.oldPrice}>{item.oldPrice}</span>
              )}
            </div>

            {/* Logo and Icon Container */}
            <div className={styles.logoIconContainer}>
              {/* Company logo */}
              <div className={styles.logoContainer}>
                <img
                  src={getLogo(item.company)}
                  alt={`${item.company} logo`}
                  className={styles.logo}
                />
              </div>
              {/* Info icon (clickable) */}
              <div className={styles.iconContainer} onClick={() => onProductSelect(item)}>
                <InfoIcon />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid; // Export the component for use in other parts of the app

