'use client';
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
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-8">
      <div className="text-center mb-8 w-full max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {getTranslation('homepageTitle', currentLanguage)}
        </h1>
        <p className="text-lg text-gray-600">
          {getTranslation('homepageSubtitle', currentLanguage)}
        </p>
      </div>
      
      <div className="w-full max-w-2xl mb-4 mx-auto">
        <SearchBar isHomePage={true} />
      </div>
      
      {!loading && !user && (
        <div className="text-center w-full max-w-2xl mx-auto mb-6">
          <p className="text-xs text-gray-400">
            Already have an account? <Link href="/signin" className="text-blue-500 hover:text-blue-700 hover:underline">Sign in</Link> • 
            New here? <Link href="/signup" className="text-blue-500 hover:text-blue-700 hover:underline">Create account</Link>
          </p>
        </div>
      )}
      
      <div className="text-center w-full max-w-2xl mx-auto">
        <p className="text-sm text-gray-500">
          By using our service, you agree to our 
          <Link href="/terms" className="text-blue-600 hover:underline mx-1">Terms of Service</Link> and 
          <Link href="/privacy" className="text-blue-600 hover:underline mx-1">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;