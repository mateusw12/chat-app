'use client';

import { useUser } from '@/lib/store/user';
import { AccountMenu } from './account-menu';

export default function Header() {
  const user = useUser((state) => state.user);

  return (
    <header className="flex items-center justify-start h-[70px] p-2 border-b sm:border-t sm:border-b-0 gap-2">
      <AccountMenu />

      <div className="flex flex-col">
        <span className="text-sm font-semibold ">
          {user?.user_metadata?.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {user?.user_metadata?.user_name}
        </span>
      </div>
    </header>
  );
}
