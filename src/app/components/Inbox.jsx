'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Mail, Clock, User, AlertCircle } from 'lucide-react';

export default function Inbox({ email }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  // Fetch messages
  const fetchMessages = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/mail/inbox?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setLastChecked(new Date());
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh messages
  useEffect(() => {
    if (!email) return;

    // Initial fetch
    fetchMessages();

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [email]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!email) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="card">
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              No Email Generated
            </h3>
            <p className="text-gray-400">
              Generate a temporary email address to start receiving messages
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Inbox</h3>
            <p className="text-sm text-gray-600 mt-1">
              {email} • {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {lastChecked && (
              <p className="text-xs text-gray-500">
                Last checked: {formatDate(lastChecked)}
              </p>
            )}
            <button
              onClick={fetchMessages}
              disabled={isLoading}
              className="btn-secondary disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Notice about message delay */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Message Delivery Notice
            </p>
            <p className="text-sm text-blue-700">
              New messages may take 30 seconds to 1 minute to appear in your inbox. 
              Click refresh to check for new messages manually.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 pb-2 border-b border-gray-200">
              Messages
            </h4>
            
            {isLoading && messages.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">No Messages Yet</h4>
                <p className="text-gray-400 text-sm">
                  Your messages will appear here automatically
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id || index}
                  onClick={() => setSelectedMessage(message)}
                  className={`cursor-pointer border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="font-medium text-gray-900 text-sm">
                        {message.from || 'Unknown Sender'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
                        {formatDate(message.createdAt || message.date)}
                      </p>
                    </div>
                  </div>
                  <h5 className="font-medium text-gray-800 mb-1 text-sm">
                    {message.subject || 'No Subject'}
                  </h5>
                  <p className="text-gray-600 text-xs">
                    {truncateText(message.intro || message.text || 'No content')}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Message Preview */}
          <div>
            <h4 className="font-medium text-gray-900 pb-2 border-b border-gray-200 mb-4">
              Message Preview
            </h4>
            
            {selectedMessage ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    {selectedMessage.subject || 'No Subject'}
                  </h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>From:</strong> {selectedMessage.from || 'Unknown'}</p>
                    <p><strong>To:</strong> {selectedMessage.to || email}</p>
                    <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt || selectedMessage.date)}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div 
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedMessage.html || 
                               selectedMessage.text?.replace(/\n/g, '<br>') || 
                               'No content available' 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}