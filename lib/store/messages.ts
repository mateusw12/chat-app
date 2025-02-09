import { create } from 'zustand';
import { LIMIT_MESSAGES } from '../constants';

export interface IMessage {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
    avatar_url: string | null;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
}

interface MessagesState {
  page: number;
  hasMore: boolean;
  messages: IMessage[];
  optimisticIds: string[];
  actionMessage: IMessage | undefined;
  setOptimisticIds: (id: string) => void;
  addMessages: (message: IMessage) => void;
  setActionMessage: (message: IMessage | undefined) => void;
  optimisticDeleteMessage: (messageId: string) => void;
  optimisticUpdateMessage: (message: IMessage) => void;
  setMessages: (messages: IMessage[]) => void;
}

export const useMessages = create<MessagesState>((set) => ({
  page: 1,
  hasMore: true,
  messages: [],
  optimisticIds: [],
  actionMessage: undefined,

  setOptimisticIds: (id) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),

  addMessages: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),

  setActionMessage: (message) => set(() => ({ actionMessage: message })),

  optimisticDeleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    })),

  optimisticUpdateMessage: (updateMessage) =>
    set((state) => ({
      messages: state.messages.filter((msg) => {
        if (msg.id === updateMessage.id) {
          msg.text = updateMessage.text;
          msg.is_edit = updateMessage.is_edit;
        }
        return msg;
      }),
    })),
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.page + 1,
      hasMore: messages.length >= LIMIT_MESSAGES,
    })),
}));
