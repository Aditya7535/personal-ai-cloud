import { Cloud, MessageSquarePlus, History, Database, Settings, UserCircle, FolderOpen, SlidersHorizontal } from 'lucide-react';
import type { ViewState } from '../App';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[280px] h-full fixed left-0 top-0 border-r border-outline-variant bg-surface-dim flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center border border-primary/30">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-headline-md text-primary">Personal AI Cloud</h1>
            <p className="text-label-caps text-on-surface-variant opacity-70 mt-1">AI Operating System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {(
          [
            { id: 'chat', label: 'New Chat', icon: MessageSquarePlus },
            { id: 'dashboard', label: 'Dashboard', icon: History },
            { id: 'knowledge', label: 'Knowledge Base', icon: Database },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
              currentView === item.id 
                ? 'text-primary border-l-2 border-primary bg-primary-container/10 font-bold' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-body-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 space-y-1 border-t border-outline-variant pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors rounded-md">
          <FolderOpen className="w-5 h-5" />
          <span className="text-body-sm">Knowledge Base</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 transition-colors rounded-md">
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-body-sm">Settings</span>
        </button>
        <div className="mt-4 px-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container border border-outline-variant overflow-hidden">
             <UserCircle className="w-full h-full text-on-surface-variant" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-body-sm font-bold truncate">Developer Workspace</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Pro Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
