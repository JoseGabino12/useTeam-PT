import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/shared/components/header/Header";
import { useAuth } from "../hooks/useAuth";

export function LoginPage () {
  const { handleLogin, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;

    await handleLogin(email, password);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header withNav={ false } />
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md px-6">
          <div className="bg-background-light dark:bg-subtle-dark/50 p-8 rounded-xl border border-subtle-light dark:border-subtle-dark">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="text-muted-light dark:text-muted-dark mt-2">Log in to continue to your workspace.</p>
            </div>
            <form onSubmit={ handleSubmit } className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">Email Address</label>
                <Input id="email" name="email" placeholder="you@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium" htmlFor="password">Password</label>
                  <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot password?</a>
                </div>
                <Input id="password" name="password" placeholder="••••••••" type="password" />
              </div>
              <div>
                <Button className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity" type="submit" disabled={ loading }>
                  { loading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-secondary" /> : "Log In" }
                </Button>
              </div>
            </form>
            <p className="mt-8 text-center text-sm text-muted-light dark:text-muted-dark">
              Don't have an account?
              <a className="font-medium text-primary hover:underline ml-2" href="/sign-up">Sign up</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}