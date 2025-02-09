'use client';

import { Button } from '@/components/ui/button';
import { supabaseBrowser } from '@/lib/supabase/client';
import { GithubLogo } from 'phosphor-react';

export default function LoginPage() {
  function handleLoginWithGithub() {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: location.origin + '/auth/callback',
      },
    });
  }

  return (
    <div className="flex flex-col justify-between items-center min-h-screen ">
      <div className="flex flex-col justify-center items-center flex-grow">
        <div className="flex flex-col justify-center items-center gap-6 py-10 px-8  border rounded-2xl shadow-xl w-full max-w-sm text-center bg-card">
          <h1 className="font-extrabold text-3xl">Login</h1>
          <h2 className="text-lg font-medium text-muted-foreground">
            Bem-vindo ao chat!
          </h2>

          <p className="text-sm text-muted-foreground">
            Faça login para enviar mensagens e interagir com outros usuários.
          </p>

          <Button
            onClick={handleLoginWithGithub}
            className=" w-full flex items-center justify-center gap-2"
          >
            <GithubLogo weight="bold" size={20} /> Login com Github
          </Button>
        </div>
      </div>

      <span className="text-center text-xs p-4 text-muted-foreground">
        desenvolvido por{' '}
        <a
          href="https://giovanaraphaelli.tech/"
          target="_blank"
          className="hover:text-primary transition-colors font-medium"
        >
          @giovanaraphaelli
        </a>
      </span>
    </div>
  );
}
