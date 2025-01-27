import React, { useEffect, useRef, useState } from 'react'
import SearchBar from '../components/SearchBar';
import './HomePage.css'

const HomePage = () => {

  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const questionRef = useRef(null); 

  
  const handleSearch = async (query) => {
    if (!query.trim()) return; // Ignore empty queries
    setLoading(true); // Set loading state to true

    const userMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]); // Add the user's query to the messages array

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations'); // Handle API errors

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.aiResponse,
        products: data.products || [], // Include product recommendations if available
      };
      setMessages((prev) => [...prev, assistantMessage]); // Add the assistant's response to the messages array
    } catch (error) {
      console.error('Error fetching recommendations:', error); // Log errors
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
          products: [],
        },
      ]); // Display an error message in the chat if the API request fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    if (questionRef.current) {
      const offset = 100; // Adjust this value based on the search bar's height
      const topPos = questionRef.current.offsetTop - offset;

      window.scrollTo({
        top: topPos,
        behavior: 'smooth', // Smooth scrolling for better UX
      });
    }
  }, [messages.filter((msg) => msg.role === 'user').length]); 

  return (
    <div className="container">
      <div className="header">All shopping price comparisons, one engine</div>
      <div className="input-container">
        <form>
        <input type="text" placeholder="Search product..." />
        <button>Get started</button>
        </form>
      </div>
      <div className="note">
        By clicking "Get Started," you agree to Engine's <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
      <div className="features">
        <div className="feature">
          <img src="cart.jpg" alt="Shop" />
          <p>Shop with us today</p>
        </div>
        <div className="feature">
          <img src="airplane.jpg" alt="Fly" />
          <p>Book your flight now</p>
        </div>
        <div className="feature">
          <img src="hotel.jpg" alt="Hotel" />
          <p>Find your perfect hotel today</p>
        </div>
        <div className="feature">
          <img src="suitcase.jpg" alt="No contracts" />
          <p>No contracts</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;