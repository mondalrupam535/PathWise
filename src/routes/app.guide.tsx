import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { PageTransition, SectionHeading } from "@/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithGuide } from "@/lib/ai";

export const Route = createFileRoute("/app/guide")({
  head: () => ({ meta: [{ title: "AI Guide — PathWise AI" }] }),
  component: Guide,
});

type Msg = { role: "user" | "ai"; text: string };

function Guide() {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let p = { name: "there" };
    try {
      const stored = localStorage.getItem("pw-profile");
      if (stored) p = JSON.parse(stored);
    } catch {}
    setProfile(p);
    setMessages([{ role: "ai", text: `Hi ${p.name}! I'm your AI career mentor. Ask me anything about your path, skills, or next steps.` }]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || isTyping) return;
    
    const newHistory = [...messages, { role: "user" as const, text: t }];
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await chatWithGuide({ data: { profile, message: t, history: messages } });
      setMessages([...newHistory, { role: "ai", text: reply }]);
    } catch (e) {
      setMessages([...newHistory, { role: "ai", text: "Sorry, I encountered an error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "What skill should I learn next?",
    "How can I improve my resume?",
    "What are common interview questions for this role?",
    "Help me build a portfolio project idea."
  ];

  return (
    <PageTransition>
      <SectionHeading eyebrow="AI Mentor" title="Talk to your AI career guide" sub="Personalized advice, anytime." />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,260px]">
        <div className="flex h-[70vh] flex-col overflow-hidden rounded-3xl border border-border bg-card">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "gradient-brand text-white rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground rounded-tl-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              </motion.div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI mentor…"
              className="rounded-full"
              disabled={isTyping}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-10 w-10 rounded-full gradient-brand text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" /> Suggested prompts
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={isTyping}
                className="rounded-2xl border border-border bg-background p-3 text-left text-sm transition hover:border-primary/40 hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </PageTransition>
  );
}
