'use client';
import { useEffect, useRef } from "react";
import '../../styles/global.css';
import SearchBar from "../components/SearchBar";
import HomePage from "../components/HomePage";
import AIResponse from "../components/AIResponse";
import ProductGrid from "../components/ProductGrid";
import ChatSection from "../components/ChatSection";
import styles from "./page.module.css";
import { useSearch } from "../contexts/SearchContext";

export default function Page() {
  const { 
    showHomePage, 
    messages, 
    isLoading, 
    selectedProduct, 
    setSearchData 
  } = useSearch();
  
  const questionRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      const offset = 100;
      const topPos = questionRef.current.offsetTop - offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  }, [messages.filter(msg => msg.role === "user").length]);

  const handleProductSelect = (product) => {
    setSearchData({
      selectedProduct: product,
      isChatOpen: true
    });
  };

  return (
    <main className={styles.main} id="home2">
      {showHomePage ? (
        <HomePage />
      ) : (
        <>
          <div className={styles.leftContainer}></div>
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
                    <div ref={questionRef} className={styles.userBubble}>
                      {msg.content}
                    </div>
                  ) : (
                    <div className={styles.aiMessageBlock}>
                      {/* Affichage des erreurs */}
                      {msg.error && (
                        <div className={styles.error}>{msg.error}</div>
                      )}
                      
                      {/* Contenu normal si pas d'erreur */}
                      {!msg.error && (
                        <>
                          <AIResponse answer={msg.content} />
                          
                          {msg.products?.length > 0 ? (
                            <ProductGrid
                              products={msg.products}
                              onProductSelect={handleProductSelect}
                            />
                          ) : (
                            !isLoading && (
                              <div className={styles.noProducts}>
                                Aucun produit trouvé pour cette recherche
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
                  Analyse en cours...
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