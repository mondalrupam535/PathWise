import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Map,
  MessageSquare,
  FileText,
  Briefcase,
  LineChart,
  Sparkles,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin,
  Star,
  ChevronRight,
  Zap
} from "lucide-react";
import { Logo } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PathWise AI — Your AI Career Companion" },
      { name: "description", content: "Personalized roadmaps, resume intelligence, AI mentorship, and job matching — all in one platform." },
      { property: "og:title", content: "PathWise AI — Your AI Career Companion" },
      { property: "og:description", content: "AI-powered career guidance for students and job seekers." },
    ],
  }),
  component: Landing,
});

function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button asChild variant="ghost" className="rounded-full font-medium">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
          <Button asChild className="rounded-full gradient-brand text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-medium">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 flex items-center justify-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="aurora opacity-60" />
        {/* subtle noise texture can go here if needed */}
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex flex-col items-center"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span>Introducing PathWise AI 2.0</span>
          </div>
          
          <h1 className="font-display text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            Your AI Career <br className="hidden md:block" />
            <span className="text-gradient-brand">Companion</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            Personalized roadmaps, resume intelligence, AI mentorship, and job matching — all in one platform. Built for the modern job seeker.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 w-full sm:w-auto rounded-full gradient-brand text-white px-8 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Link to="/login">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 w-full sm:w-auto rounded-full px-8 text-base bg-background/50 backdrop-blur-sm border-border hover:bg-accent/50 transition-all">
              <a href="#features">
                Explore Features
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Floating Abstract UI */}
        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-[32px] border border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl overflow-hidden p-2 md:p-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-brand-2/10" />
            <div className="h-full w-full rounded-xl md:rounded-[24px] border border-border/50 bg-card overflow-hidden flex flex-col relative z-10 shadow-inner">
               {/* Mock Header */}
               <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-muted/30">
                 <div className="flex gap-1.5">
                   <div className="w-3 h-3 rounded-full bg-destructive/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                 </div>
                 <div className="ml-4 h-6 w-64 rounded-md bg-muted/50 border border-border/50" />
               </div>
               {/* Mock Content */}
               <div className="flex-1 flex p-6 gap-6 bg-background/50">
                 {/* Sidebar */}
                 <div className="hidden md:flex w-48 flex-col gap-3">
                   <div className="h-8 rounded-md bg-primary/20 border border-primary/20" />
                   <div className="h-8 rounded-md bg-muted/50" />
                   <div className="h-8 rounded-md bg-muted/50" />
                   <div className="h-8 rounded-md bg-muted/50" />
                 </div>
                 {/* Main Content */}
                 <div className="flex-1 flex flex-col gap-4">
                   <div className="h-12 w-1/3 rounded-lg bg-muted/80" />
                   <div className="flex gap-4">
                     <div className="flex-1 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-border/50" />
                     <div className="flex-1 h-32 rounded-xl bg-gradient-to-br from-brand-2/10 to-transparent border border-border/50" />
                     <div className="flex-1 h-32 rounded-xl bg-gradient-to-br from-accent to-transparent border border-border/50" />
                   </div>
                   <div className="flex-1 rounded-xl bg-card border border-border/50 relative overflow-hidden">
                     <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
                     <svg className="absolute inset-0 h-full w-full stroke-primary/30" fill="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0,100 L20,60 L40,80 L60,30 L80,50 L100,10" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                     </svg>
                   </div>
                 </div>
               </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -right-6 md:-right-12 top-20 z-20 hidden md:flex items-center gap-3 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Resume Scored</p>
                <p className="text-xs text-muted-foreground">92/100 ATS Match</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [10, -10, 10] }} 
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              className="absolute -left-6 md:-left-12 bottom-20 z-20 hidden md:flex items-center gap-3 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 shadow-xl"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">New Job Match</p>
                <p className="text-xs text-muted-foreground">Frontend Engineer at Vercel</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [
  { icon: Map, title: "AI Roadmaps", desc: "Generate step-by-step career pathways tailored to your specific goals and timeline." },
  { icon: FileText, title: "Resume Builder", desc: "Craft polished, modern resumes with intelligent auto-formatting and AI writing suggestions." },
  { icon: Sparkles, title: "Resume Analyzer", desc: "Get an instant ATS score and actionable feedback to optimize your application." },
  { icon: MessageSquare, title: "AI Guide", desc: "Chat with a specialized mentor that knows your background and guides your next moves." },
  { icon: Briefcase, title: "Job Match", desc: "Discover curated opportunities that perfectly align with your current skill set." },
  { icon: LineChart, title: "Progress Tracker", desc: "Visualize your growth and maintain momentum with a beautiful dashboard." },
];

function Features() {
  return (
    <section id="features" className="relative z-10 border-t border-border/50 bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16 md:mb-24">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to <span className="text-gradient-brand">succeed</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive suite of tools designed to accelerate your career growth and land your dream role.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { id: "01", title: "Signup & Profile", desc: "Share your background, skills, and ultimate career goals with us." },
  { id: "02", title: "Onboarding", desc: "Our AI analyzes your profile to create a custom starting point." },
  { id: "03", title: "Dashboard", desc: "Access your personalized roadmap, resume tools, and mentorship." },
  { id: "04", title: "Growth & Hiring", desc: "Complete milestones, refine your application, and get hired." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center mb-16 md:mb-24">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            From idea to <span className="text-gradient-brand">impact</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A streamlined workflow that takes the guesswork out of your career progression.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-px bg-border/80 md:left-1/2 md:-ml-px md:top-8 md:bottom-8" />
          
          <div className="space-y-12 md:space-y-24">
            {steps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-start gap-8 md:gap-12 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Number Node */}
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-[4px] border-background bg-primary text-white font-display font-bold shadow-lg md:absolute md:left-1/2 md:-ml-7">
                  {step.id}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right md:pr-24" : "md:text-left md:pl-24"} pt-2`}>
                  <div className="group rounded-3xl border border-border/50 bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
                    <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                    <p className="mt-3 text-muted-foreground text-lg">{step.desc}</p>
                  </div>
                </div>
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  { quote: "PathWise AI completely transformed my job hunt. The personalized roadmap gave me exactly what I needed to focus on, and I landed a job at a top tech company within 3 months.", author: "Sarah Jenkins", role: "Software Engineer", company: "TechCorp" },
  { quote: "The resume analyzer is mind-blowing. It pointed out flaws I never noticed and helped me tailor my experience to bypass ATS systems effortlessly.", author: "David Chen", role: "Product Manager", company: "Innovate" },
  { quote: "Having an AI mentor available 24/7 to answer my specific career questions gave me the confidence to pivot into a completely new industry.", author: "Emily Rodriguez", role: "UX Designer", company: "Creative Studio" },
];

function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 border-t border-border/50 bg-muted/20 py-24 md:py-32 overflow-hidden">
      <div className="absolute right-0 top-0 -translate-y-12 translate-x-1/3 opacity-30 blur-[100px] pointer-events-none">
        <div className="h-96 w-96 rounded-full bg-primary/40" />
      </div>
      
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
              Loved by <span className="text-gradient-brand">ambitious</span> builders
            </h2>
          </div>
          <Button variant="outline" className="rounded-full w-fit">
            Read more stories
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass relative flex flex-col justify-between rounded-3xl p-8 shadow-lg shadow-black/5"
            >
              <div>
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-brand-2 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role} @ {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[40px] bg-card border border-border p-10 md:p-20 text-center shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-brand-2/10" />
        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay"></div>
        
        <div className="relative z-10 mx-auto max-w-3xl">
          <Zap className="mx-auto h-12 w-12 text-primary mb-6" />
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Start building your <br />
            <span className="text-gradient-brand">future today</span>
          </h2>
          <p className="mx-auto mt-6 text-xl text-muted-foreground max-w-xl">
            Join thousands of professionals who are accelerating their career growth with PathWise AI.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="h-14 rounded-full gradient-brand text-white px-8 text-base shadow-xl hover:scale-105 transition-transform">
              <Link to="/login">
                Create Free Account
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Free to start</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> No credit card required</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/40 bg-background pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Empowering the next generation of builders with AI-driven career guidance, roadmaps, and tools.
            </p>
            <div className="mt-6 flex gap-4 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Roadmaps</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Resume Builder</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} PathWise AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
