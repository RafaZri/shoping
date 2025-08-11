'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearch } from '../../contexts/SearchContext';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { hasActiveSearch, lastSearchQuery, handleSearch } = useSearch();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setSearchHistory(userData.user.searchHistory || []);
          setSavedProducts(userData.user.savedProducts || []);
        } else {
          // Not authenticated, redirect to signin
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBackToSearch = () => {
    if (hasActiveSearch && lastSearchQuery) {
      // Just go back to the search results page without making a new search
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                New Search
              </Link>
              {hasActiveSearch && lastSearchQuery && (
                <button
                  onClick={handleBackToSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                >
                  Continue Search
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search History */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Searches
            </h3>
            {searchHistory.length > 0 ? (
              <div className="space-y-3">
                {searchHistory.slice(0, 5).map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{search.query}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(search.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/?q=${encodeURIComponent(search.query)}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Search Again
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No search history yet.</p>
            )}
          </div>
        </div>

        {/* Saved Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Saved Products
            </h3>
            {savedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {savedProducts.slice(0, 6).map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{product.price}</p>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Product
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No saved products yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 