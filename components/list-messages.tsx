/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { IMessage, useMessages } from '@/lib/store/messages';
import { supabaseBrowser } from '@/lib/supabase/client';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Message } from './message';
import { DeleteAlert, EditAlert } from './message-actions';
import { Button } from './ui/button';
import LoadMoreMessages from './load-more-messages';

export function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(0);

  const {
    messages,
    addMessages,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdateMessage,
  } = useMessages((state) => state);
  const supabase = supabaseBrowser();

  function handleOnScroll() {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  }

  function scrollDown() {
    if (scrollRef.current) {
      setNotification(0);
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    const chanel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from('users')
              .select('*')
              .eq('id', payload.new.send_by)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = { ...payload.new, users: data };
              addMessages(newMessage as IMessage);
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer &&
            scrollContainer.scrollTop <
              scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((prev) => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          optimisticUpdateMessage(payload.new as IMessage);
        }
      )
      .subscribe();
    return () => {
      chanel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-1 flex flex-col p-2 overflow-y-auto h-full m-2"
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className="flex-1 pb-4">
        <LoadMoreMessages />
      </div>
      <div className="space-y-5">
        {messages.map((value, index) => {
          return <Message key={index} message={value} />;
        })}
      </div>
      {userScrolled && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          {notification ? (
            <Button size="sm" onClick={scrollDown}>
              {notification === 1
                ? '1 nova mensagem'
                : `${notification} novas mensagens`}
            </Button>
          ) : (
            <Button size="icon" onClick={scrollDown}>
              <ArrowDown />
            </Button>
          )}
        </div>
      )}

      <DeleteAlert />
      <EditAlert />
    </div>
  );
}
