'use client';

import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Mail, Clock, CheckCircle } from 'lucide-react';

export default function EmailBox() {
  const [email, setEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);

  // Generate new email
  const generateEmail = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/mail/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmail(data.email);
        setTimeLeft(600); // Reset timer
        setIsActive(true);
      } else {
        console.error('Failed to generate email');
        // Fallback for demo
        const randomId = Math.random().toString(36).substring(2, 15);
        setEmail(`${randomId}@stealthmail.com`);
        setTimeLeft(600);
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error generating email:', error);
      // Fallback for demo
      const randomId = Math.random().toString(36).substring(2, 15);
      setEmail(`${randomId}@stealthmail.com`);
      setTimeLeft(600);
      setIsActive(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy email to clipboard
  const copyEmail = async () => {
    if (!email) return;
    
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setEmail('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-6">
          <Mail className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generate Temporary Email
          </h2>
          <p className="text-gray-600">
            Get a disposable email address that expires in 10 minutes
          </p>
        </div>

        {!email ? (
          <div className="text-center">
            <button
              onClick={generateEmail}
              disabled={isGenerating}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate Email'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Email Display */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Temporary Email
                  </label>
                  <p className="text-lg font-mono text-gray-900 break-all">
                    {email}
                  </p>
                </div>
                <button
                  onClick={copyEmail}
                  className="ml-4 flex items-center space-x-2 btn-secondary"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Timer and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Time remaining: <strong className="text-primary-600">{formatTime(timeLeft)}</strong>
                </span>
              </div>
              <button
                onClick={generateEmail}
                className="btn-secondary text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                New Email
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 600) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}