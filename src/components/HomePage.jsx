'use client';
import { useEffect } from 'react';
import SearchBar from "../components/SearchBar";
import "./HomePage.css";
import { useSearch } from "../contexts/SearchContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { getTranslation } from "../utils/translations";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { handleSearch } = useSearch();
  const { currentLanguage } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();



  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden">
      <div className="text-center mb-6 md:mb-8 w-full max-w-2xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-800 mb-2 md:mb-3 leading-tight" style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '-0.025em'
        }}>
          Find the Best Deals
        </h1>
        <div className="text-sm md:text-lg leading-tight">
          <div className="text-amber-500 font-bold">
            Compare prices across multiple retailers
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-2xl mb-6 md:mb-8 mx-auto relative z-10">
        <SearchBar isHomePage={true} />
      </div>

      {/* Mobile-friendly illustration container - BELOW search bar */}
      <div className="flex justify-center items-center gap-4 md:gap-6 px-4 mt-2 md:mt-4">
        {/* Box - Even bigger on mobile */}
        <img 
          src="/box.png" 
          alt="Box" 
          className="w-28 h-auto md:w-32 lg:w-36 opacity-80"
        />
        
        {/* Price Tag - Even bigger on mobile */}
        <img 
          src="/price-tag.png" 
          alt="Price tag" 
          className="w-28 h-auto md:w-32 lg:w-36 opacity-80"
        />
        
        {/* Robot - Even bigger on mobile */}
        <img 
          src="/robot-cart.png" 
          alt="Robot pushing shopping cart" 
          className="w-32 h-auto md:w-40 lg:w-48 opacity-90"
        />
      </div>
      

      

      

    </div>
  );
};

export default HomePage;