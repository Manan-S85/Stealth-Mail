'use client';

import App from './App.tsx';
import Footer from './components/Footer.jsx';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Full Site - Always Visible */}
      <App />
      
      <Footer />
    </div>
  );
}