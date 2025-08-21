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
const ProductsGrid = ({ products, onProductSelect, loadMoreProducts = [], hasMoreProducts = false }) => {
  const { currentLanguage } = useLanguage();
  const { fetchNikeProducts } = useSearch();
  const [visibleProducts, setVisibleProducts] = useState(8); // Show 8 products initially for ultra-fast loading
  const [nikeProducts, setNikeProducts] = useState([]);
  const [isLoadingNike, setIsLoadingNike] = useState(false);
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

  // Function to handle load more button click
  const handleLoadMore = async () => {
    // If we haven't loaded Nike products yet and this is a relevant search, fetch them
    if (nikeProducts.length === 0 && !isLoadingNike) {
      const searchQuery = products[0]?.title || ''; // Get search context from first product
      const isNikeRelevant = searchQuery.toLowerCase().includes('shoe') || 
                            searchQuery.toLowerCase().includes('sneaker') || 
                            searchQuery.toLowerCase().includes('nike') || 
                            searchQuery.toLowerCase().includes('athletic') ||
                            searchQuery.toLowerCase().includes('running') ||
                            searchQuery.toLowerCase().includes('training') ||
                            searchQuery.toLowerCase().includes('sport');
      
      if (isNikeRelevant) {
        setIsLoadingNike(true);
        const nikeResults = await fetchNikeProducts(searchQuery);
        setNikeProducts(nikeResults);
        setIsLoadingNike(false);
      }
    }
    
    // Always add more products to the existing list
    setVisibleProducts(prev => prev + 4);
  };

  // Combine Amazon products with Nike products and load more products
  const allProducts = [...products, ...nikeProducts, ...loadMoreProducts];
  const displayedProducts = allProducts.slice(0, visibleProducts);
  const canLoadMore = visibleProducts < allProducts.length || isLoadingNike;

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

    return {
      rating: product.rating || null, // Only real ratings, no fake data
      reviews: product.reviews || null, // Only real reviews, no fake data
      discount: calculateDiscount(product.price, product.oldPrice, product.discountPercentage)
    };
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.productsGrid}>
        {displayedProducts.map((item, index) => {
          const details = getProductDetails(item);

          return (
            <div key={`${item.company}-${item.id || index}-${item.title?.slice(0, 20)}`} className={styles.productCard}>
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

                {/* Rating - Only show if real data exists */}
                {details.rating && details.reviews && (
                  <div className={styles.ratingContainer}>
                    <StarRating rating={details.rating} />
                    <span className={styles.reviewCount}>
                      ({details.reviews.toLocaleString()})
                    </span>
                  </div>
                )}

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


              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreButton}
            onClick={handleLoadMore}
          >
            {getTranslation('loadMore', currentLanguage)}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;


