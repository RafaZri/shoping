'use client';
import SearchBar from "../components/SearchBar";
import "./HomePage.css";
import { useSearch } from "../contexts/SearchContext";

const HomePage = () => {
  const { setSearchData } = useSearch();

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setSearchData({
      isLoading: true,
      showHomePage: false,
      messages: [{ role: 'user', content: query }]
    });

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      setSearchData(prev => ({
        isLoading: false,
        messages: [...prev.messages, {
          role: 'assistant',
          content: data.aiResponse,
          products: data.products || []
        }]
      }));

    } catch (error) {
      console.error('Error:', error);
      setSearchData(prev => ({
        isLoading: false,
        messages: [...prev.messages, {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          products: []
        }]
      }));
    }
  };

  return (
    <div className="overflow-hidden px-6 md:px-16 lg:px-32 relative w-full homepage">
      <div className="container">
        <div className="header ">All shopping price comparisons, one engine</div>
        <div className="input-container">
          <SearchBar onSearch={handleSearch} isHomePage={true} />
        </div>
        <div className="note">
          By clicking "Get Started," you agree to Engine's 
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
        <div className="features">
          {/* Vos caractéristiques restent inchangées */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;