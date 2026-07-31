import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthPage from '../pages/AuthPage';
import FeedPage from '../pages/FeedPage';
import ExplorePage from '../pages/ExplorePage';
import DestinationDetailPage from '../pages/DestinationDetailPage';
import ProfilePage from '../pages/ProfilePage';
import AddDestinationModal from '../components/destination/AddDestinationModal';
import { useAuth } from '../context/AuthContext';
import { useDestinations } from '../hooks/useDestinations';
import { useAppData } from '../hooks/useAppData';

export default function AppRoutes() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // We keep this here just for the global Add Modal
  const { handleAddDestination } = useDestinations(user);
  const { tags } = useAppData();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <>
      <MainLayout currentUser={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<FeedPage currentUser={user} />} />
          <Route path="/explore" element={<ExplorePage onOpenAddModal={() => setIsAddModalOpen(true)} />} />
          <Route path="/destination/:id" element={<DestinationDetailPage currentUser={user} />} />
          <Route path="/profile/:id" element={<ProfilePage currentUser={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>

      <AddDestinationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        tags={tags}
        onAddDestination={handleAddDestination}
      />
    </>
  );
}
