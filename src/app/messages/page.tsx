import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  return (
    <div className="container px-0 md:px-6 py-0 md:py-6 h-[calc(100vh-4rem)]">
      <div className="flex h-full overflow-hidden rounded-lg border bg-background">
        {/* Static message for export builds */}
        <div className="w-full flex flex-col items-center justify-center p-4 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Messaging Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            The real-time messaging functionality will be available in the final version of the application.
            This is a static preview of the service marketplace platform.
          </p>
          <Link href="/">
            <Button className="mt-4">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
