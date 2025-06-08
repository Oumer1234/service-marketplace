'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types';

interface ChatSidebarProps {
  conversations: Conversation[];
  serviceProvidersMap: Record<string, { name: string; profileImage: string }>;
}

const ChatSidebar = ({ conversations, serviceProvidersMap }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Get the conversation ID from the pathname
  const currentConversationId = pathname.split('/messages/')?.[1];

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const participant = conversation.participants.find((p) => serviceProvidersMap[p]);
    if (!participant) return false;

    return serviceProvidersMap[participant].name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  return (
    <div className="flex h-full w-full flex-col border-r">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
          <span className="sr-only">New conversation</span>
        </Button>
      </div>

      <div className="relative px-4 pb-2">
        <Search className="absolute left-6 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-px">
            {filteredConversations.map((conversation) => {
              // Find the service provider in this conversation
              const providerId = conversation.participants.find(
                (p) => serviceProvidersMap[p]
              );

              if (!providerId) return null;

              const provider = serviceProvidersMap[providerId];
              const isActive = currentConversationId === conversation.id;

              return (
                <button
                  key={conversation.id}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                    isActive ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={provider.profileImage}
                        alt={provider.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      {!conversation.lastMessage.isRead &&
                        conversation.lastMessage.receiverId === 'user1' && (
                        <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{provider.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.updatedAt), {
                            addSuffix: false,
                          })}
                        </span>
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
