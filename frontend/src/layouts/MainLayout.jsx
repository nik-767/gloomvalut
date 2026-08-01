import React from 'react';
import Navbar from '../components/layout/Navbar';

/**
 * Shared page shell with navigation and a centered content area.
 */
export default function MainLayout({ currentUser, onLogout, children }) {
  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main>{children}</main>
    </>
  );
}
