import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Trash2, Shield, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Progress } from './components/ui/progress';
import { toast } from 'sonner';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
}

// API functions for Mail.tm integration
const createTempEmail = async () => {
  try {
    const response = await fetch('/api/mail/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    // Handle both success and fallback responses
    if (data.success) {
      return data;
    } else if (data.fallback) {
      return {
        success: true,
        email: data.fallback.email,
        id: 'fallback_' + Date.now(),
        token: null,
        message: data.fallback.message
      };
    }
    
    throw new Error('No valid response from API');
  } catch (error) {
    console.error('Error creating email:', error);
    // Fallback to demo data
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const randomStr = Array.from({ length: 8 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return {
      success: true,
      email: `${randomStr}@2200freefonts.com`,
      id: 'demo_' + Date.now(),
      token: null,
      message: 'Demo email (Mail.tm unavailable)'
    };
  }
};

const fetchInboxMessages = async (email: string, token: string) => {
  try {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`/api/mail/inbox?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, messages: [] };
  }
};

const mockEmails: Email[] = [
  {
    id: '1',
    from: 'noreply@github.com',
    subject: 'Verify your email address',
    preview: 'Please click the link below to verify your email address and complete your registration...',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    from: 'notifications@twitter.com',
    subject: 'Your weekly summary is ready',
    preview: 'Here\'s what happened on Twitter this week. You have 47 new followers and...',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '3',
    from: 'support@stripe.com',
    subject: 'Confirm your email for Stripe',
    preview: 'Thanks for signing up! Please confirm your email address to complete your account setup...',
    time: '3 hours ago',
    read: false,
  },
];

export default function App() {
  const [email, setEmail] = useState('');
  const [emailId, setEmailId] = useState('');
  const [token, setToken] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isCreatingEmail, setIsCreatingEmail] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isViewingMessage, setIsViewingMessage] = useState(false);

  // Initialize client-side and create real email
  useEffect(() => {
    setIsClient(true);
    createNewEmail();
  }, []);

  // Create new email using Mail.tm API
  const createNewEmail = async () => {
    setIsCreatingEmail(true);
    try {
      const result = await createTempEmail();
      if (result.success) {
        setEmail(result.email);
        setEmailId(result.id);
        setToken(result.token || '');
        setTimeLeft(600);
        setIsActive(true);
        
        // Start fetching messages periodically if we have a token
        if (result.token) {
          startMessagePolling(result.email, result.token);
        }
        
        toast.success('New temporary email created!');
      }
    } catch (error) {
      console.error('Error creating email:', error);
      toast.error('Failed to create email');
    } finally {
      setIsCreatingEmail(false);
    }
  };

  // Poll for messages every 30 seconds
  const startMessagePolling = (emailAddress: string, authToken: string) => {
    const pollMessages = async () => {
      const result = await fetchInboxMessages(emailAddress, authToken);
      if (result.success && result.messages) {
        // Convert API messages to our format
        const formattedMessages: Email[] = result.messages.map((msg: any) => ({
          id: msg.id,
          from: msg.from?.address || msg.from || 'Unknown',
          subject: msg.subject || 'No Subject',
          preview: msg.intro || msg.text || (msg.html ? msg.html.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '') || 'No preview available',
          time: new Date(msg.createdAt).toLocaleString(),
          read: msg.seen || false
        }));
        setEmails(formattedMessages);
      }
    };

    // Poll immediately and then every 30 seconds
    pollMessages();
    const interval = setInterval(pollMessages, 30000);
    
    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  };

  // Timer effect
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Reset timer when email changes
  useEffect(() => {
    setTimeLeft(600);
    setIsActive(true);
  }, [email]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = ((600 - timeLeft) / 600) * 100;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      toast.success('Email address copied!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy email address');
    }
  };

  const handleRefresh = () => {
    createNewEmail();
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  // Fetch and view a specific message
  const handleViewMessage = async (messageId: string) => {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/mail/message/${messageId}`, {
        method: 'GET',
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedMessage(data.message);
          setIsViewingMessage(true);
          
          // Mark message as read
          setEmails(prev => prev.map(email => 
            email.id === messageId ? { ...email, read: true } : email
          ));
        }
      } else {
        toast.error('Failed to load message');
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      toast.error('Failed to load message');
    }
  };

  const handleCloseMessage = () => {
    setSelectedMessage(null);
    setIsViewingMessage(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Stealth Mail</h1>
            <p className="text-sm text-gray-500">Disposable Email Service</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            👑 Go Premium
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            ⚙️
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Two Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Protected Email Card */}
          <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-gray-600 font-medium">Protected</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Temporary Email</h2>
              <p className="text-gray-500">Use this address to sign up anonymously</p>
            </div>

            <div className="mb-6">
              <div className="text-2xl font-mono font-bold text-gray-900 mb-4">
                {!isClient ? (
                  'loading@2200freefonts.com'
                ) : isCreatingEmail ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Creating email...
                  </div>
                ) : (
                  email || 'No email created'
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleCopy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
              >
                📋 Copy Address
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isCreatingEmail}
                className="p-3 rounded-xl"
              >
                <RefreshCw className={`h-5 w-5 ${isCreatingEmail ? 'animate-spin' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="p-3 rounded-xl"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Auto-Expires Timer Card */}
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-sm text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <span className="text-white/90 font-medium">Auto-Expires</span>
            </div>

            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-2">
                {isClient ? formatTime(timeLeft) : '10:00'}
              </div>
              <p className="text-blue-100 text-lg">minutes remaining</p>
            </div>

            <div className="mb-6">
              <Progress 
                value={isClient ? progressPercentage : 0} 
                className="h-2 bg-white/20"
              />
            </div>

            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-white/90 text-sm leading-relaxed">
                Your email will be automatically deleted when the timer expires, ensuring complete privacy.
              </p>
            </div>
          </Card>
        </div>

        {/* Inbox Section */}
        <Card className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                📧
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Inbox</h3>
                <p className="text-gray-500">Received messages</p>
              </div>
            </div>
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
              {emails.length}
            </div>
          </div>

          {emails.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📬
              </div>
              <h4 className="text-lg font-medium text-gray-500 mb-2">No Messages Yet</h4>
              <p className="text-gray-400 text-sm">
                Your messages will appear here automatically
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {emails.map((message) => (
                <div
                  key={message.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleViewMessage(message.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      message.read ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {message.from.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{message.from}</p>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-gray-600">{message.subject}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{message.preview}</p>
                    </div>
                  </div>
                  {!message.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Message Viewer Modal */}
        {isViewingMessage && selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMessage.subject || 'No Subject'}</h3>
                  <p className="text-gray-500 text-sm">
                    From: {selectedMessage.from?.address || selectedMessage.from || 'Unknown'}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCloseMessage}
                  className="rounded-full"
                >
                  ✕
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {selectedMessage.html ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedMessage.html }}
                  />
                ) : selectedMessage.text ? (
                  <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
                    {selectedMessage.text}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No message content available</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Message ID: {selectedMessage.id}
                </div>
                <Button
                  onClick={handleCloseMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}