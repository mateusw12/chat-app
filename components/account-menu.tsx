'use client';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/lib/store/user';
import { supabaseBrowser } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import { Avatar, AvatarImage } from './ui/avatar';

export function AccountMenu() {
  const { setTheme } = useTheme();
  const user = useUser((state) => state.user);

  function handleLogout() {
    const supabase = supabaseBrowser();
    supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.user_metadata?.avatar_url}
              alt={`Imagem de ${user?.user_metadata?.name}`}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-sm font-medium">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user_metadata?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.user_metadata?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Temas
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          Sistema
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Conta
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={handleLogout}>
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
