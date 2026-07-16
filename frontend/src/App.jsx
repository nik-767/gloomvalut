import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import FeedView from './components/FeedView';
import ExploreView from './components/ExploreView';
import DestinationDetail from './components/DestinationDetail';
import ProfileView from './components/ProfileView';
import AddDestinationModal from './components/AddDestinationModal';

import {
  initialUsers,
  initialProfiles,
  initialTags,
  initialDestinations,
  initialReviews,
  initialFollows
} from './mockData';

export default function App() {
  // App-level State (Simulated Backend DB)
  const [users, setUsers] = useState(initialUsers);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [tags] = useState(initialTags);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [reviews, setReviews] = useState(initialReviews);
  const [follows, setFollows] = useState(initialFollows);

  // Auth Session State
  const [currentUser, setCurrentUser] = useState(users[0]); // Starts logged in as 'castle_explorer'

  // Navigation State
  const [currentView, setCurrentView] = useState('feed');
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['feed']);

  // Handle Auth States
  const handleLoginSuccess = (userObj) => {
    // Add user if they don't exist
    const userExists = users.some(u => u.username === userObj.username);
    if (!userExists) {
      setUsers(prev => [...prev, { ...userObj, isCurrentUser: false }]);
      // Create a profile for them
      setProfiles(prev => [...prev, {
        id: prev.length + 1,
        userId: userObj.id,
        bio: 'Welcome to my castle journal! Ready to explore and write reviews.',
        picUrl: '',
        created: new Date().toISOString()
      }]);
    }
    
    // Find the exact user object in state
    const matchedUser = users.find(u => u.username === userObj.username) || userObj;
    setCurrentUser(matchedUser);
    handleViewChange('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
    setNavigationHistory([]);
  };

  // Navigation Handlers
  const handleViewChange = (view, targetId = null) => {
    setNavigationHistory(prev => [...prev, currentView]);
    
    if (view === 'destination-detail') {
      setSelectedDestinationId(targetId);
    } else if (view === 'profile') {
      setSelectedUserId(targetId);
    }
    
    setCurrentView(view);
  };

  const handleBack = () => {
    if (navigationHistory.length === 0) {
      handleViewChange('feed');
      return;
    }
    
    const history = [...navigationHistory];
    const prevView = history.pop();
    setNavigationHistory(history);
    
    // Reset selections depending on view we go back to
    if (prevView === 'destination-detail') {
      // Keep selected ID
    } else if (prevView === 'profile') {
      // Keep selected user ID
    } else {
      setSelectedDestinationId(null);
      setSelectedUserId(null);
    }
    
    setCurrentView(prevView);
  };

  // Business Logic Handlers
  const handleAddDestination = (newDest) => {
    const newId = destinations.reduce((max, d) => Math.max(max, d.id), 0) + 1;
    setDestinations(prev => [
      {
        id: newId,
        posted_by: currentUser.id,
        ...newDest
      },
      ...prev
    ]);
  };

  const handleAddReview = (newReview) => {
    const newId = reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setReviews(prev => [
      ...prev,
      {
        id: newId,
        ...newReview
      }
    ]);
  };

  const handleFollowToggle = (targetUserId) => {
    const isFollowing = follows.some(
      f => f.followerId === currentUser.id && f.followingId === targetUserId
    );

    if (isFollowing) {
      setFollows(prev => prev.filter(
        f => !(f.followerId === currentUser.id && f.followingId === targetUserId)
      ));
    } else {
      const newId = follows.reduce((max, f) => Math.max(max, f.id), 0) + 1;
      setFollows(prev => [
        ...prev,
        {
          id: newId,
          followerId: currentUser.id,
          followingId: targetUserId
        }
      ]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic Backgrounds */}
      <div className="bg-glow-top" />
      <div className="bg-glow-bottom" />

      {/* Main Render Route switcher */}
      {currentUser === null || currentView === 'auth' ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Navbar 
            activeView={currentView} 
            onViewChange={handleViewChange} 
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main style={{ flexGrow: 1, padding: '16px 0' }}>
            {currentView === 'feed' && (
              <FeedView
                currentUser={currentUser}
                users={users}
                destinations={destinations}
                reviews={reviews}
                follows={follows}
                onFollowToggle={handleFollowToggle}
                onSelectUser={(id) => handleViewChange('profile', id)}
                onSelectDestination={(id) => handleViewChange('destination-detail', id)}
                onNavigateToExplore={() => handleViewChange('explore')}
              />
            )}

            {currentView === 'explore' && (
              <ExploreView
                destinations={destinations}
                users={users}
                tags={tags}
                onSelectDestination={(id) => handleViewChange('destination-detail', id)}
                onSelectUser={(id) => handleViewChange('profile', id)}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            )}

            {currentView === 'destination-detail' && (
              <DestinationDetail
                destinationId={selectedDestinationId}
                destinations={destinations}
                users={users}
                tags={tags}
                reviews={reviews}
                currentUser={currentUser}
                onAddReview={handleAddReview}
                onBack={handleBack}
                onSelectUser={(id) => handleViewChange('profile', id)}
              />
            )}

            {currentView === 'profile' && (
              <ProfileView
                userId={selectedUserId}
                users={users}
                profiles={profiles}
                destinations={destinations}
                reviews={reviews}
                follows={follows}
                currentUser={currentUser}
                onFollowToggle={handleFollowToggle}
                onSelectDestination={(id) => handleViewChange('destination-detail', id)}
                onSelectUser={(id) => handleViewChange('profile', id)}
                onBack={handleBack}
              />
            )}
          </main>

          {/* Add Castle Modal */}
          <AddDestinationModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            tags={tags}
            onAddDestination={handleAddDestination}
          />
        </>
      )}
    </div>
  );
}
