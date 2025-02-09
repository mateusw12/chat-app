'use client';

import { useUser } from '@/lib/store/user';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface PresenceData {
  user_id: string;
  user_name: string;
}

export default function ChatPresence() {
  const user = useUser((state) => state.user);
  const supabase = supabaseBrowser();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('room1');

    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const usernames: string[] = [];

        for (const id in presenceState) {
          const users = presenceState[id] as unknown as PresenceData[];
          if (users?.[0]?.user_name) {
            usernames.push(users[0].user_name);
          }
        }
        setOnlineUsers([...new Set(usernames)]);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: user.id,
            user_name: user.user_metadata?.user_name,
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, supabase]);

  if (!user) return null;

  return (
    <ul className="flex-1 hidden sm:block p-4 space-y-2">
      {onlineUsers.map((username, index) => (
        <li key={index} className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {username}
        </li>
      ))}
    </ul>
  );
}
