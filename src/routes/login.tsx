import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in or sign up — PathWise AI" },
      { name: "description", content: "Access your PathWise AI career workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { localStorage.setItem("pw-auth", "1"); } catch {}
    setTimeout(() => {
      const onboarded = typeof localStorage !== "undefined" && localStorage.getItem("pw-onboarded") === "1";
      navigate({ to: onboarded ? "/app" : "/onboarding" });
    }, 500);
  };

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { 
      localStorage.setItem("pw-auth", "1");
      localStorage.removeItem("pw-onboarded");
      localStorage.removeItem("pw-profile");
    } catch {}
    setTimeout(() => {
      navigate({ to: "/onboarding" });
    }, 500);
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden md:grid-cols-2">
      <div className="aurora" />

      <div className="relative z-10 flex flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto my-auto w-full max-w-sm"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Continue your career journey with PathWise AI.</p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 rounded-full">
              <TabsTrigger value="login" className="rounded-full">Log in</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={submitLogin} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full gradient-brand text-white">
                  {loading ? "Signing in…" : (<>Log in <ArrowRight className="ml-1 h-4 w-4" /></>)}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={submitSignup} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" type="text" placeholder="Alex Chen" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" type="email" placeholder="you@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" type="password" placeholder="At least 8 characters" required />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-full gradient-brand text-white">
                  {loading ? "Creating…" : (<>Create account <ArrowRight className="ml-1 h-4 w-4" /></>)}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </motion.div>

        <div className="text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back home</Link>
        </div>
      </div>

      <div className="relative hidden overflow-hidden md:block">
        <div className="absolute inset-0 gradient-brand" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white, transparent 40%)" }} />
        <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
          <blockquote className="max-w-md font-display text-2xl leading-tight">
            "PathWise mapped my career in 5 minutes. Three months later I had two offers."
          </blockquote>
          <div className="mt-4 text-sm text-white/80">— Maya, Software Engineer at Nimbus</div>
        </div>
      </div>
    </div>
  );
}
