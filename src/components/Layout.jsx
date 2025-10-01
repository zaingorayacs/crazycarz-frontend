import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MotionWrapper, { fadeIn } from '../components/MotionWrapper';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 font-body">
      <Navbar />
      <main className="flex-grow">
        <MotionWrapper animation={fadeIn}>
          {children}
        </MotionWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;