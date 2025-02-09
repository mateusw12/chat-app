'use client';

import { supabaseBrowser } from '@/lib/supabase/client';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { v4 as uuid } from 'uuid';
import { useUser } from '@/lib/store/user';
import { IMessage, useMessages } from '@/lib/store/messages';

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessages = useMessages((state) => state.addMessages);
  const setOptimisticIds = useMessages((state) => state.setOptimisticIds);
  const supabase = supabaseBrowser();

  async function handleSendMessage(text: string) {
    if (text.trim()) {
      const newMessage = {
        id: uuid(),
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
        },
      };

      addMessages(newMessage as IMessage);
      setOptimisticIds(newMessage.id);

      const { error } = await supabase.from('messages').insert({ text });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error('A mensagem não pode estar vazia!');
    }
  }
  return (
    <div className="p-4 h-[70px] border-t">
      <Input
        placeholder="envie uma mensagem"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
    </div>
  );
}
