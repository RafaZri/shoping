'use client';

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import HomePage from "../components/HomePage";

import ProductGrid from "../components/ProductGrid";
import ChatSection from "../components/ChatSection";
import styles from "./page.module.css";
import { useSearch } from "../contexts/SearchContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getTranslation } from "../utils/translations";
import LanguageSwitcher from "../components/LanguageSwitcher";
import Link from 'next/link';

function PageContent() {
  const { 
    showHomePage, 
    messages, 
    isLoading, 
    selectedProduct, 
    setSearchData,
    clearActiveSearch,
    searchData,
    handleSearch
  } = useSearch() || {};
  
  const { currentLanguage } = useLanguage();
  const { user, loading: authLoading, refreshAuth } = useAuth();
  const questionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHistoryDropdown) {
        try {
          const dropdown = document.querySelector(`.${styles.searchHistoryDropdown}`);
          const button = document.querySelector(`.${styles.searchHistoryButton}`);
          if (dropdown && !dropdown.contains(event.target) && button && !button.contains(event.target)) {
            setShowHistoryDropdown(false);
          }
        } catch (error) {
          console.error('Error in click outside handler:', error);
          setShowHistoryDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      try {
        document.removeEventListener('mousedown', handleClickOutside);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  }, [showHistoryDropdown]);



  // Handle URL parameters for success messages
  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(decodeURIComponent(message));
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      // If it's a sign-in success message, refresh auth status
      if (message.includes('Sign in successful')) {
        // Small delay to ensure the cookie is set
        setTimeout(() => {
          refreshAuth();
        }, 100);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (questionRef.current) {
      try {
        const offset = 100;
        const topPos = questionRef.current.offsetTop - offset;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      } catch (error) {
        console.error('Error scrolling to question:', error);
      }
    }
  }, [messages.filter(msg => msg.role === "user").length]);

  // Auto-scroll to the latest message when new messages are added
  useEffect(() => {
    if (messages.length > 1) { // Only auto-scroll if there's more than one message
      setTimeout(() => {
        try {
          const userMessages = document.querySelectorAll('.userBubble');
          if (userMessages.length > 0) {
            const latestMessage = userMessages[userMessages.length - 1];
            if (latestMessage && typeof latestMessage.scrollIntoView === 'function') {
              latestMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
              });
            }
          }
        } catch (error) {
          console.error('Error in auto-scroll:', error);
        }
      }, 500); // Increased delay to ensure rendering is complete
    }
  }, [messages.length]);

  const handleProductSelect = (product) => {
    setSearchData({
      selectedProduct: product,
      isChatOpen: true
    });
  };

  // Copy message function
  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <main className={styles.main} id="home2">
      <div className={styles.topBar}>
        <div className={styles.rightControls}>
          {!authLoading && !user && (
            <div className={styles.authIconsContainer}>
              <div className={styles.signInContainer}>
                <Link href="/signin" className={styles.signInButton}>
                  <span className={styles.signInText}>{getTranslation('signIn', currentLanguage)}</span>
                  <span className={styles.signInTooltip}>{getTranslation('signIn', currentLanguage)}</span>
                </Link>
              </div>
              <div className={styles.signUpContainer}>
                <Link href="/signup" className={styles.signUpButton}>
                  <span className={styles.signUpText}>{getTranslation('signUp', currentLanguage)}</span>
                  <span className={styles.signUpTooltip}>{getTranslation('signUp', currentLanguage)}</span>
                </Link>
              </div>
            </div>
          )}
          {!authLoading && user && (
            <div className={styles.profileContainer}>
              <Link href="/dashboard" className={styles.profileLink}>
                <div className={styles.profileAvatar}>
                  <svg className="w-3 h-3" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className={styles.profileTooltip}>{getTranslation('viewProfile', currentLanguage)}</span>
              </Link>
            </div>
          )}
          <LanguageSwitcher />
          <div className={styles.newChatContainer}>
            <button
              onClick={() => {
                setSearchData({
                  showHomePage: true,
                  messages: [],
                  isLoading: false,
                  selectedProduct: null,
                  searchQuery: '',
                  searchResults: [],
                  error: null,
                  hasActiveSearch: false,
                  lastSearchQuery: ''
                });
              }}
              className={styles.newChatButton}
            >
              <svg className="w-3 h-3" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className={styles.newChatTooltip}>{getTranslation('newChat', currentLanguage)}</span>
            </button>
          </div>
          {!authLoading && user && (
            <div className={styles.savedProductsContainer}>
              <button
                className={styles.savedProductsButton}
                onClick={() => {/* TODO: Implement saved products functionality */}}
              >
                <svg className="w-3 h-3" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className={styles.savedProductsTooltip}>{getTranslation('savedProducts', currentLanguage)}</span>
              </button>
            </div>
          )}
          {!authLoading && user && (
            <div className={styles.searchHistoryContainer}>
              <button
                className={styles.searchHistoryButton}
                onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              >
                <svg className="w-3 h-3" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={styles.searchHistoryTooltip}>{getTranslation('searchHistory', currentLanguage)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Search History Dropdown */}
      {showHistoryDropdown && (
        <div className={styles.searchHistoryDropdown}>
          <div className={styles.searchHistoryHeader}>
            <h3 className={styles.searchHistoryTitle}>Recent Searches</h3>
            <button
              onClick={() => setShowHistoryDropdown(false)}
              className={styles.closeButton}
            >
              <svg className="w-4 h-4" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={styles.searchHistoryList}>
            {user && user.searchHistory && user.searchHistory.length > 0 ? (
              user.searchHistory.slice(0, 10).map((search, index) => (
                <div key={index} className={styles.searchHistoryItem}>
                  <div className={styles.searchHistoryContent}>
                    <p className={styles.searchQuery}>{search.query}</p>
                    <p className={styles.searchDate}>
                      {new Date(search.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={styles.searchHistoryActions}>
                    <button
                      onClick={() => {
                        handleSearch(search.query);
                        setShowHistoryDropdown(false);
                      }}
                      className={styles.searchAgainButton}
                      title="Search Again"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(search.query)}
                      className={styles.copyButton}
                      title="Copy Query"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="#115e59" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noSearchHistory}>
                <p>{user ? 'No search history yet' : 'Sign in to see your search history'}</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Success Message Display */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg shadow-lg text-sm">
          {successMessage}
        </div>
      )}
      


      {showHomePage ? (
        <HomePage />
      ) : (
        <>
          <div className={styles.middleContainer}>
            <SearchBar />
            <div className={styles.productsColumn}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.role === "user" 
                    ? styles.userMessage 
                    : styles.assistantMessage}
                >
                  {msg.role === "user" ? (
                    <>
                      <div ref={questionRef} className={styles.userBubble}>
                        <div className={styles.messageText}>
                          {msg.content}
                        </div>
                      </div>
                      <div className={styles.messageActions}>
                        <button 
                          onClick={() => copyMessage(msg.content)}
                          className={styles.copyButton}
                          title={getTranslation('copy', currentLanguage)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#115e59"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.aiMessageBlock}>
                      {/* Affichage des erreurs */}
                      {msg.error && (
                        <div className={styles.error}>{getTranslation('error', currentLanguage)}</div>
                      )}
                      
                      {/* Contenu normal si pas d'erreur */}
                      {!msg.error && (
                        <>
                          {/* Search Results Summary */}
                          {msg.content && (
                            <div className={styles.searchSummary}>
                              <p>{msg.content}</p>
                            </div>
                          )}
                          
                          {/* Products Grid - Displayed below AI response */}
                          {msg.products?.length > 0 ? (
                            <div className={styles.productsContainer}>
                              <ProductGrid
                                products={msg.products}
                                onProductSelect={handleProductSelect}
                                loadMoreProducts={msg.loadMoreProducts || []}
                                hasMoreProducts={msg.hasMoreProducts || false}
                              />
                            </div>
                          ) : (
                            !isLoading && (
                              <div className={styles.noProducts}>
                                {getTranslation('noProducts', currentLanguage)}
                              </div>
                            )
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Indicateur de chargement amélioré */}
              {isLoading && (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  {getTranslation('analyzing', currentLanguage)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}