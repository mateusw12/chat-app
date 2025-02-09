import { LIMIT_MESSAGES } from '@/lib/constants';
import { useMessages } from '@/lib/store/messages';
import { supabaseBrowser } from '@/lib/supabase/client';
import { getFromAndTo } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function LoadMoreMessages() {
  const page = useMessages((state) => state.page);
  const setMessages = useMessages((state) => state.setMessages);
  const hasMore = useMessages((state) => state.hasMore);

  async function fetchMore() {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGES);
    const supabase = supabaseBrowser();

    const { data, error } = await (await supabase)
      .from('messages')
      .select('*, users(*)')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  }

  if (hasMore) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={fetchMore}
      >
        Ver mais mensagens
      </Button>
    );
  }
  return <></>;
}
