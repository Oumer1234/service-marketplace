'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Send, Paperclip, MoreVertical, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types';

interface ChatInterfaceProps {
  messages: Message[];
  recipient: {
    id: string;
    name: string;
    profileImage: string;
  };
  currentUserId: string;
  onSendMessage?: (content: string) => void;
  onBack?: () => void;
}

const ChatInterface = ({
  messages,
  recipient,
  currentUserId,
  onSendMessage,
  onBack,
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Chat header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="block md:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipient.profileImage} alt={recipient.name} />
              <AvatarFallback>
                {recipient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{recipient.name}</h3>
              {isTyping ? (
                <p className="text-xs text-primary">Typing...</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Last seen recently
                </p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
          const messageTime = new Date(message.timestamp);

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && showAvatar && (
                <div className="mr-2 flex-shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recipient.profileImage} alt={recipient.name} />
                    <AvatarFallback>
                      {recipient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
              {!isCurrentUser && !showAvatar && <div className="w-8 mr-2" />}

              <div className="max-w-[75%]">
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                <div
                  className={`mt-1 flex items-center text-xs text-muted-foreground ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{format(messageTime, 'h:mm a')}</span>
                  {isCurrentUser && (
                    <span className="ml-1">
                      {message.isRead ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            size="icon"
            className="flex-shrink-0"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
