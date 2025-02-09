'use client';

import { useEffect, useRef } from 'react';
import { IMessage, useMessages } from './messages';
import { LIMIT_MESSAGES } from '../constants';

export default function InitMessages({ messages }: { messages: IMessage[] }) {
  const initState = useRef(false);
  const hasMore = messages.length >= LIMIT_MESSAGES;
  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages, hasMore });
    }
    initState.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}
