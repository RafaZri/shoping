'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearch } from '../../contexts/SearchContext';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [editMessage, setEditMessage] = useState('');
  const router = useRouter();
  const { hasActiveSearch, lastSearchQuery, handleSearch, setSearchData, searchData } = useSearch();
  const { signOut } = useAuth();

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
      // Clear search state before signing out - force complete reset
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
      
      await signOut();
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

  const handleNewSearch = () => {
    // Clear the search state and go to fresh homepage - same as main page
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
    router.push('/');
  };

  const handleSearchAgain = async (query) => {
    try {
      // Clear current search state and set up for new search
      setSearchData({
        showHomePage: false,
        messages: [],
        isLoading: true,
        selectedProduct: null,
        searchQuery: query,
        searchResults: [],
        error: null,
        hasActiveSearch: true,
        lastSearchQuery: query
      });

      // Perform the search (this will add the user message and assistant response)
      await handleSearch(query);
      
      // Navigate to homepage to show results
      router.push('/');
    } catch (error) {
      console.error('Search again error:', error);
    }
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditForm({
      ...editForm,
      firstName: user.firstName,
      lastName: user.lastName
    });
    setEditMessage('');
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
    setEditForm({
      ...editForm,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditMessage('');
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setIsEditingPassword(false);
    setEditForm({
      firstName: '',
      lastName: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setEditMessage('');
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          firstName: editForm.firstName,
          lastName: editForm.lastName
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setIsEditingName(false);
        setEditMessage('Name updated successfully!');
        setTimeout(() => setEditMessage(''), 3000);
      } else {
        const error = await response.json();
        setEditMessage(error.message || 'Failed to update name');
      }
    } catch (error) {
      setEditMessage('Failed to update name');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (editForm.newPassword !== editForm.confirmPassword) {
      setEditMessage('New passwords do not match');
      return;
    }

    if (editForm.newPassword.length < 6) {
      setEditMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: editForm.currentPassword,
          newPassword: editForm.newPassword
        }),
      });

      if (response.ok) {
        setIsEditingPassword(false);
        setEditForm({
          ...editForm,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setEditMessage('Password updated successfully!');
        setTimeout(() => setEditMessage(''), 3000);
      } else {
        const error = await response.json();
        setEditMessage(error.message || 'Failed to update password');
      }
    } catch (error) {
      setEditMessage('Failed to update password');
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleNewSearch}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="New Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100 transition-colors"
                title="Back to Home"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.firstName}!</span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
            </div>
            
            {editMessage && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                editMessage.includes('successfully') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {editMessage}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                {!isEditingName ? (
                  <div className="flex items-center justify-between">
                    <p className="mt-1 text-sm text-gray-900">{user.firstName} {user.lastName}</p>
                    <button
                      onClick={handleEditName}
                      className="text-gray-600 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title="Edit Name"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateName} className="mt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          placeholder="First Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          placeholder="Last Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {!isEditingPassword ? (
                  <div className="flex items-center justify-between">
                    <p className="mt-1 text-sm text-gray-900">••••••••</p>
                    <button
                      onClick={handleEditPassword}
                      className="text-gray-600 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors"
                      title="Change Password"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="mt-2 space-y-3">
                    <div>
                      <input
                        type="password"
                        value={editForm.currentPassword}
                        onChange={(e) => setEditForm({...editForm, currentPassword: e.target.value})}
                        placeholder="Current Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={editForm.newPassword}
                        onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})}
                        placeholder="New Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={editForm.confirmPassword}
                        onChange={(e) => setEditForm({...editForm, confirmPassword: e.target.value})}
                        placeholder="Confirm New Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
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
      </div>
    </div>
  );
} 