'use client';

import { useState } from 'react';
import App from './App.tsx';
import Footer from './components/Footer.jsx';
import Articles from './components/Articles.jsx';

export default function HomePage() {
  const [showFullSite, setShowFullSite] = useState(false);

  return (
    <div className="min-h-screen">
      {!showFullSite ? (
        // New Figma Design - Main App
        <div>
          <App />
          
          {/* Toggle Button to Show Full Site */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setShowFullSite(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors duration-200 text-sm font-medium"
            >
              View Full Site
            </button>
          </div>
        </div>
      ) : (
        // Full Site with Articles and Features
        <div className="min-h-screen">
          <App />
          
          {/* Articles Section */}
          <section className="py-16 bg-gray-50">
            <Articles />
          </section>

          {/* Toggle Button to Hide Full Site */}
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setShowFullSite(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-lg transition-colors duration-200 text-sm font-medium"
            >
              Hide Full Site
            </button>
          </div>
          
          <Footer />
        </div>
      )}
    </div>
  );
}