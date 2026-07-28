/* Documented App view router states */
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import FeedView from './components/FeedView';
import ExploreView from './components/ExploreView';
import DestinationDetail from './components/DestinationDetail';
import ProfileView from './components/ProfileView';
import AddDestinationModal from './components/AddDestinationModal';
import { AuthProvider, useAuth } from './components/authcontext';

function AppContent() {
  // App-level State (empty by default; data will come from the API)
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [tags] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [follows, setFollows] = useState([]);
  const { user, isAuthenticated, logout } = useAuth();
  const currentUser = user;

  // Navigation State
  const [currentView, setCurrentView] = useState('feed');
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['feed']);

  // Handle Auth States
  const handleLogout = () => {
    logout();
    setCurrentView('auth');
    setNavigationHistory([]);
  };

  // Navigation Handlers
  const handleViewChange = (view, targetId = null) => {
    setNavigationHistory((prev) => [...prev, currentView]);

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
    setDestinations((prev) => [
      {
        id: newId,
        posted_by: currentUser?.id ?? null,
        ...newDest
      },
      ...prev
    ]);
  };

  const handleAddReview = (newReview) => {
    const newId = reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    setReviews((prev) => [
      ...prev,
      {
        id: newId,
        ...newReview
      }
    ]);
  };

  const handleFollowToggle = (targetUserId) => {
    const isFollowing = follows.some(
      (f) => f.followerId === currentUser?.id && f.followingId === targetUserId
    );

    if (isFollowing) {
      setFollows((prev) => prev.filter(
        (f) => !(f.followerId === currentUser?.id && f.followingId === targetUserId)
      ));
    } else {
      const newId = follows.reduce((max, f) => Math.max(max, f.id), 0) + 1;
      setFollows((prev) => [
        ...prev,
        {
          id: newId,
          followerId: currentUser?.id ?? null,
          followingId: targetUserId
        }
      ]);
    }
  };

  return (
    <div>
      {!isAuthenticated || currentView === 'auth' ? (
        <AuthPage />
      ) : (
        <>
          <Navbar
            activeView={currentView}
            onViewChange={handleViewChange}
            currentUser={currentUser}
            onLogout={handleLogout}
          />

          <main>
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
