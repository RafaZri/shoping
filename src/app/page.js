'use client';

import { useEffect, useRef, useState } from "react";
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

export default function Page() {
  const { 
    showHomePage, 
    messages, 
    isLoading, 
    selectedProduct, 
    setSearchData 
  } = useSearch();
  
  const { currentLanguage } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const questionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      const offset = 100;
      const topPos = questionRef.current.offsetTop - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  }, [messages.filter(msg => msg.role === "user").length]);

  // Auto-scroll to the latest message when new messages are added
  useEffect(() => {
    if (messages.length > 1) { // Only auto-scroll if there's more than one message
      setTimeout(() => {
        const userMessages = document.querySelectorAll('.userBubble');
        if (userMessages.length > 0) {
          const latestMessage = userMessages[userMessages.length - 1];
          latestMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
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
      <LanguageSwitcher />
      {showHomePage ? (
        <HomePage />
      ) : (
        <>
          <div className={styles.leftContainer}></div>
          <div className={styles.middleContainer}>
            <div className={styles.headerContainer}>
              <SearchBar />
              {!authLoading && user && (
                <div className={styles.profileIcon}>
                  <Link href="/dashboard" className={styles.profileLink}>
                    <div className={styles.profileAvatar}>
                      <span className={styles.profileInitial}>
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className={styles.profileTooltip}>View Profile</span>
                  </Link>
                </div>
              )}
            </div>
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
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
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
          <div className={styles.rightContainer}>
            <ChatSection
              selectedProduct={selectedProduct}
              onClose={() => setSearchData({ selectedProduct: null })}
            />
          </div>
        </>
      )}
    </main>
  );
}