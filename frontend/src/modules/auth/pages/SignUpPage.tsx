import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/shared/components/header/Header";
import { SelectAvatar } from "../components/SelectAvatar";
import type { FunEmojiEyes, FunEmojiMouth } from "@/shared/types/avatar.types";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function SignUpPage () {
  const [avatarSelection, setAvatarSelection] = useState<{ eyes: FunEmojiEyes; mouth: FunEmojiMouth }>(
    { eyes: "plain", mouth: "plain" }
  );

  const { loading, error, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await signUp(formData, avatarSelection);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header withNav={ false } />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-xl border border-subtle-light p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?
              <a className="font-medium text-primary hover:text-primary/80 ml-1" href="/login">
                Log in
              </a>
            </p>
          </div>
          <form onSubmit={ handleSubmit } className="mt-8 space-y-6" method="POST">
            <div className="flex flex-col items-center space-y-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="avatar-upload">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <SelectAvatar value={ avatarSelection } onChange={ setAvatarSelection } />
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="full-name">Full name</label>
                <Input id="full-name" name="full-name" placeholder="Tobias Eaton" required type="text" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="email-address">Email address</label>
                <Input id="email-address" name="email" placeholder="tobias.eaton@example.com" required type="email" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="password">Password</label>
                <Input id="password" name="password" placeholder="********" required type="password" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium" htmlFor="confirm-password">Confirm password</label>
                <Input id="confirm-password" name="confirm-password" placeholder="********" required type="password" />
              </div>
            </div>
            { error && <p className="text-red-500 text-sm">{ error }</p> }
            <div>
              <Button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg bg-primary" type="submit" disabled={ loading }>
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}