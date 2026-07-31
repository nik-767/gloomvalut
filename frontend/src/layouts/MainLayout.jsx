import React from 'react';
import Navbar from '../components/layout/Navbar';

export default function MainLayout({ currentUser, onLogout, children }) {
  return (
    <>
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main>
        {children}
      </main>
    </>
  );
}
