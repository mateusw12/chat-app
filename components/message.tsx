/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IMessage, useMessages } from '@/lib/store/messages';
import { useUser } from '@/lib/store/user';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronDown } from 'lucide-react';

export function Message({ message }: { message: IMessage }) {
  const user = useUser((state) => state.user);
  return (
    <div className="flex gap-2">
      <Avatar className="h-9 w-9">
        <AvatarImage
          className="rounded-full"
          src={message.users?.avatar_url!}
          alt={`Imagem de ${message.users?.display_name}`}
        />
      </Avatar>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-1">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <h1 className="font-bold">{message.users?.display_name}</h1>
            <div className="flex gap-1">
              <h2 className="text-xs text-muted-foreground">
                {new Date(message.created_at).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </h2>
              {message.is_edit && (
                <span className="text-xs text-muted-foreground">editada</span>
              )}
            </div>
          </div>
          {message.users?.id === user?.id && <MessageMenu message={message} />}
        </div>
        <p>{message.text}</p>
      </div>
    </div>
  );
}

function MessageMenu({ message }: { message: IMessage }) {
  const setActionMessage = useMessages((state) => state.setActionMessage);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1 rounded-full hover:bg-muted transition">
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            document.getElementById('trigger-edit')?.click();
            setActionMessage(message);
          }}
        >
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            document.getElementById('trigger-delete')?.click();

            setActionMessage(message);
          }}
        >
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
