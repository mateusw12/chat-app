/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { IMessage, useMessages } from '@/lib/store/messages';
import { supabaseBrowser } from '@/lib/supabase/client';
import { useRef } from 'react';
import { toast } from 'sonner';

export function DeleteAlert() {
  const actionMessage = useMessages((state) => state.actionMessage);
  const optimisticDeleteMessage = useMessages(
    (state) => state.optimisticDeleteMessage
  );

  async function handleDelete() {
    const supabase = supabaseBrowser();
    optimisticDeleteMessage(actionMessage?.id!);

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', actionMessage?.id!);

    if (error) {
      toast.error('Erro ao excluir a mensagem');
    } else {
      toast.success('Mensagem excluída com sucesso');
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger id="trigger-delete"></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja continuar?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação é irreversível. Sua mensagem será excluída
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            Excluir mensagem
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function EditAlert() {
  const actionMessage = useMessages((state) => state.actionMessage);
  const optimisticUpdateMessage = useMessages(
    (state) => state.optimisticUpdateMessage
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = supabaseBrowser();

  async function handleEdit() {
    const text = inputRef.current?.value.trim();
    if (text) {
      optimisticUpdateMessage({
        ...actionMessage,
        text,
        is_edit: true,
      } as IMessage);
      const { error } = await supabase
        .from('messages')
        .update({ text, is_edit: true })
        .eq('id', actionMessage?.id!);

      if (error) {
        toast.error('Erro ao editar a mensagem');
      } else {
        toast.success('Mensagem editada com sucesso');
      }
      document.getElementById('trigger-edit')?.click();
    } else {
      document.getElementById('trigger-edit')?.click();
      document.getElementById('trigger-delete')?.click();
    }
  }

  return (
    <Dialog>
      <DialogTrigger id="trigger-edit"></DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Editar mensagem</DialogTitle>
        </DialogHeader>

        <Input ref={inputRef} defaultValue={actionMessage?.text} />

        <DialogFooter>
          <Button onClick={handleEdit}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
