import { Suspense } from 'react';
import { ListMessages } from './list-messages';
import { supabaseServer } from '@/lib/supabase/server';
import InitMessages from '@/lib/store/initMessage';
import { LIMIT_MESSAGES } from '@/lib/constants';

export async function ChatMessages() {
  const supabase = supabaseServer();

  const { data } = await (await supabase)
    .from('messages')
    .select('*, users(*)')
    .range(0, LIMIT_MESSAGES)
    .order('created_at', { ascending: false });

  return (
    <Suspense fallback={'carregando...'}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}
