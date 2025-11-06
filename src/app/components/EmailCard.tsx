'use client';

import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Trash2, Edit3, Clock, Mail, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface EmailCardProps {
  email: string;
  onRefresh: () => void;
  onDelete: () => void;
  onChange: () => void;
}

export function EmailCard({ email, onRefresh, onDelete, onChange }: EmailCardProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

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

  // Copy email to clipboard
  const copyEmail = async () => {
    if (!email) return;
    
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy email');
    }
  };

  const handleRefresh = () => {
    onRefresh();
    setTimeLeft(600);
    setIsActive(true);
    toast.success('New email generated!');
  };

  const handleDelete = () => {
    onDelete();
    setTimeLeft(0);
    setIsActive(false);
    toast.success('Email deleted');
  };

  const handleChange = () => {
    onChange();
    setTimeLeft(600);
    setIsActive(true);
    toast.success('Email changed!');
  };

  return (
    <Card className="relative overflow-hidden border-2 border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Temporary Email
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Your disposable email address
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isActive && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </Badge>
            )}
            {!isActive && timeLeft === 0 && (
              <Badge variant="destructive">Expired</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Email Display */}
        <div className="relative">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <p className="text-lg font-mono text-gray-900 break-all select-all">
                  {email}
                </p>
              </div>
              <Button
                onClick={copyEmail}
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isActive && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Time remaining</span>
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 600) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleRefresh}
            variant="default"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            New Email
          </Button>
          <Button
            onClick={handleChange}
            variant="outline"
            className="flex-1"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Change
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-green-600 font-semibold text-sm">100%</div>
            <div className="text-xs text-gray-600">Anonymous</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-semibold text-sm">10min</div>
            <div className="text-xs text-gray-600">Lifespan</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-semibold text-sm">Instant</div>
            <div className="text-xs text-gray-600">Generation</div>
          </div>
        </div>
      </CardContent>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full translate-y-12 -translate-x-12" />
    </Card>
  );
}