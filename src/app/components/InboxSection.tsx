'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Mail, Clock, User, AlertCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
}

interface InboxSectionProps {
  emails: Email[];
  onDeleteEmail: (id: string) => void;
}

export function InboxSection({ emails, onDeleteEmail }: InboxSectionProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate checking for new emails
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeleteEmail = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteEmail(emailId);
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
    toast.success('Email deleted');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Inbox refreshed');
    }, 1000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Inbox
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {emails.length} message{emails.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {emails.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="p-4 rounded-full bg-gray-100 text-gray-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              No Messages Yet
            </h3>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Your messages will appear here automatically. Messages are delivered instantly to your temporary email.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Messages List */}
            <div className="max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="font-medium text-gray-900 text-sm">
                  Recent Messages
                </h4>
              </div>
              <div className="divide-y divide-gray-100">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedEmail?.id === email.id 
                        ? 'bg-blue-50 border-r-2 border-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="p-1 rounded-full bg-gray-200 text-gray-600 shrink-0">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm truncate">
                          {email.from}
                        </span>
                        {!email.read && (
                          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-xs text-gray-500">
                          {email.time}
                        </span>
                        <Button
                          onClick={(e) => handleDeleteEmail(email.id, e)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <h5 className="font-medium text-gray-800 mb-1 text-sm line-clamp-1">
                      {email.subject}
                    </h5>
                    <p className="text-gray-600 text-xs line-clamp-2">
                      {email.preview}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Preview */}
            <div className="lg:max-h-96 lg:overflow-y-auto">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="font-medium text-gray-900 text-sm">
                  Message Preview
                </h4>
              </div>
              
              {selectedEmail ? (
                <div className="p-4">
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2 text-base">
                      {selectedEmail.subject}
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span><strong>From:</strong> {selectedEmail.from}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span><strong>Time:</strong> {selectedEmail.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p>{selectedEmail.preview}</p>
                    </div>
                  </div>
                  {!selectedEmail.read && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        ✨ This message was marked as read
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="p-4 rounded-full bg-gray-100 text-gray-400 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-6 w-6" />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Select a message to preview its content
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}