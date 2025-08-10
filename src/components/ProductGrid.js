/**
 * ProductsGrid Component
 * 
 * This component displays a grid of product cards in a modern Nike-style design.
 * Each card includes:
 * - A clickable product image linking to the product URL.
 * - The product title, current price, and old price (if available).
 * - Company badge and discount information.
 * - Clean, minimal design without expandable details.
 * 
 * Props:
 * - products (array): An array of product objects to display.
 * - onProductSelect (function): A callback function triggered when the info icon is clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './ProductGrid.module.css';
import { useSearch } from '../contexts/SearchContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../utils/translations';

// Star Rating Component
const StarRating = ({ rating, maxRating = 5 }) => {
  const stars = [];
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <span key={i} className={i <= rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    );
  }
  return <div className={styles.starRating}>{stars}</div>;
};

// ProductsGrid Component: Displays a grid of product cards
const ProductsGrid = ({ products, onProductSelect }) => {
  const { currentLanguage } = useLanguage();
  const [visibleProducts, setVisibleProducts] = useState(16); // Show 16 products initially (4 complete rows)
  const containerRef = useRef(null);

  // Auto-scroll to products when new search results are loaded
  useEffect(() => {
    if (products && products.length > 0 && containerRef.current) {
      // Smooth scroll to the products container
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [products]);

  // If there are no products, return nothing
  if (!products || products.length === 0) {
    return null;
  }

  // Function to load more products
  const loadMoreProducts = () => {
    setVisibleProducts(prev => Math.min(prev + 4, products.length)); // Load 4 more products at a time (1 complete row)
  };

  // Get the products to display (limited by visibleProducts)
  const displayedProducts = products.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < products.length;

  // Function: Generate product information
  const getProductDetails = (product) => {
    const title = product.title.toLowerCase();
    
    // Product type detection
    const isShoe = title.includes('shoe') || title.includes('sneaker') || title.includes('running') || 
                   title.includes('trainer') || title.includes('footwear') || title.includes('air max') ||
                   title.includes('jordan') || title.includes('vaporfly') || title.includes('pegasus');
    const isGamingLaptop = title.includes('gaming') || title.includes('rtx') || title.includes('gtx') || 
                           title.includes('geforce') || title.includes('gaming laptop') || title.includes('gaming computer');
    const isLaptop = title.includes('laptop') || title.includes('computer') || title.includes('pc') || 
                     title.includes('macbook') || title.includes('dell') || title.includes('hp') || 
                     title.includes('lenovo') || title.includes('asus') || title.includes('amd') || title.includes('ryzen') ||
                     title.includes('intel') || title.includes('core');
    const isElectronics = title.includes('phone') || title.includes('smartphone') || title.includes('tablet') ||
                          title.includes('headphone') || title.includes('earbud') || title.includes('camera');
    const isClothing = title.includes('shirt') || title.includes('pants') || title.includes('jacket') ||
                       title.includes('dress') || title.includes('hoodie') || title.includes('sweater') ||
                       title.includes('shorts') || title.includes('t-shirt') || title.includes('tank') ||
                       title.includes('leggings') || title.includes('joggers') || title.includes('track') ||
                       title.includes('sportswear') || title.includes('club') || title.includes('utility') ||
                       title.includes('cargo') || title.includes('capri') || title.includes('hyper ultra');

    // Calculate discount percentage
    const calculateDiscount = (currentPrice, oldPrice, discountPercentage) => {
      // If we have a discount percentage directly from the scraper, use it
      if (discountPercentage) {
        return parseInt(discountPercentage);
      }
      
      // Otherwise calculate from old and current price
      if (!oldPrice || !currentPrice) return null;
      
      const current = parseFloat(currentPrice.replace(/[$,]/g, ''));
      const old = parseFloat(oldPrice.replace(/[$,]/g, ''));
      
      if (old > current) {
        return Math.round(((old - current) / old) * 100);
      }
      return null;
    };

    // Generate best for description
    let bestFor = getTranslation('generalUse', currentLanguage);
    if (isShoe) {
      const activities = ['running', 'training', 'basketball', 'soccer', 'tennis', 'golf', 'hiking', 'walking'];
      const foundActivity = activities.find(activity => title.includes(activity));
      bestFor = foundActivity ? `${foundActivity.charAt(0).toUpperCase() + foundActivity.slice(1)}` : getTranslation('athleticActivities', currentLanguage);
    } else if (isGamingLaptop) {
      bestFor = getTranslation('gamingPerformance', currentLanguage);
    } else if (isLaptop) {
      bestFor = getTranslation('workProductivity', currentLanguage);
    } else if (isElectronics) {
      bestFor = getTranslation('dailyUse', currentLanguage);
    } else if (isClothing) {
      bestFor = getTranslation('casualWear', currentLanguage);
    }

    return {
      rating: product.rating || Math.floor(Math.random() * 2) + 4, // 4-5 stars
      reviews: product.reviews || Math.floor(Math.random() * 1000) + 100,
      bestFor,
      discount: calculateDiscount(product.price, product.oldPrice, product.discountPercentage)
    };
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.productsGrid}>
        {displayedProducts.map((item, index) => {
          const details = getProductDetails(item);

          return (
            <div key={item.id || index} className={styles.productCard}>
              {/* Product Image */}
              <div className={styles.imageContainer}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.productImageLink}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`${styles.productImage} ${item.company === 'Amazon' ? styles.amazonImage : styles.nikeImage}`}
                    loading="lazy"
                  />
                </a>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                {/* Product Title */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.productTitleLink}
                >
                  <h4 className={styles.productTitle}>{item.title}</h4>
                </a>

                {/* Rating */}
                <div className={styles.ratingContainer}>
                  <StarRating rating={details.rating} />
                  <span className={styles.reviewCount}>
                    ({details.reviews?.toLocaleString() || '0'})
                  </span>
                </div>

                {/* Price Container */}
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{item.price}</span>
                  {item.oldPrice && (
                    <span className={styles.oldPrice}>{item.oldPrice}</span>
                  )}
                  {details.discount && (
                    <span className={styles.discountBadge}>-{details.discount}%</span>
                  )}
                </div>

                {/* Quick Specs */}
                <div className={styles.quickSpecs}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>{getTranslation('bestFor', currentLanguage)}:</span>
                    <span className={styles.specValue}>{details.bestFor}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreButton}
            onClick={loadMoreProducts}
          >
            {getTranslation('loadMore', currentLanguage)}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;


