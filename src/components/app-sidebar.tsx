import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Map, MessageSquare, FileText, Briefcase, LineChart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/brand";

const items = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Pathway", url: "/app/pathway", icon: Map },
  { title: "AI Guide", url: "/app/guide", icon: MessageSquare },
  { title: "Resume", url: "/app/resume", icon: FileText },
  { title: "Job Match", url: "/app/jobs", icon: Briefcase },
  { title: "Progress", url: "/app/progress", icon: LineChart },
];

function EditProfileDialog({ profile, onClose }: { profile: any, onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: profile.name || "",
    role: profile.role || "",
    education: profile.education || "",
    goal: profile.goal || ""
  });

  const handleSave = () => {
    const updatedProfile = { ...profile, ...formData };
    localStorage.setItem("pw-profile", JSON.stringify(updatedProfile));
    window.dispatchEvent(new Event("profile-updated"));
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
        >
          <div className="relative px-6 pt-6 pb-4 border-b border-border/50">
            <h2 className="font-display text-xl font-bold">Edit Profile</h2>
            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Name</label>
              <input 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Target Role</label>
              <input 
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Education</label>
              <input 
                value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">Career Goal</label>
              <input 
                value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-3 border-t border-border/50 p-6 bg-muted/20">
            <button onClick={onClose} className="flex-1 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 rounded-full gradient-brand px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">Save Changes</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [profile, setProfile] = useState<any>({ name: "Alex Chen", role: "Aspiring AI Engineer" });
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      try {
        const p = localStorage.getItem("pw-profile");
        if (p) setProfile(JSON.parse(p));
      } catch {}
    };
    loadProfile();
    window.addEventListener("profile-updated", loadProfile);
    return () => window.removeEventListener("profile-updated", loadProfile);
  }, []);

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Logo to="/app" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url, item.exact)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2 text-left hover:bg-sidebar-accent transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-brand text-white font-bold shadow-inner shrink-0">
            {profile.name ? profile.name.charAt(0) : "A"}
          </div>
          <div className="min-w-0 text-xs flex-1">
            <div className="truncate font-medium text-sidebar-foreground">{profile.name || "Alex Chen"}</div>
            <div className="truncate text-sidebar-foreground/70">{profile.role || "Aspiring AI Engineer"}</div>
          </div>
        </button>
        {isEditOpen && <EditProfileDialog profile={profile} onClose={() => setIsEditOpen(false)} />}
      </SidebarFooter>
    </Sidebar>
  );
}
