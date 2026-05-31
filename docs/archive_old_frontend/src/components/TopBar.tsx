import { Search, Bell, Moon, MoreVertical } from 'lucide-react';
import type { ViewState } from '../App';

export function TopBar({ currentView }: { currentView: ViewState }) {
  return (
    <header className="fixed top-0 right-0 left-[280px] z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center h-16 px-8">
      <div className="flex items-center gap-4 flex-1">
        {currentView !== 'chat' && (
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search workspace..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-body-sm focus:outline-none focus:border-primary transition-all text-on-surface"
            />
          </div>
        )}
        {currentView === 'chat' && (
           <h2 className="text-headline-md">Analysis Session</h2>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-6 text-label-caps tracking-widest text-on-surface-variant">
          <button className="text-primary border-b-2 border-primary pb-5 mt-5">Workspace</button>
          <button className="hover:text-on-surface transition-colors pb-5 mt-5">Library</button>
          <button className="hover:text-on-surface transition-colors pb-5 mt-5">Models</button>
        </div>
        
        <div className="h-6 w-[1px] bg-outline-variant mx-2 hidden lg:block"></div>
        
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-label-caps hover:opacity-90 transition-opacity">
            UPGRADE
          </button>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <button className="p-2 hover:text-on-surface transition-colors rounded-full hover:bg-surface-variant/50"><Bell className="w-5 h-5" /></button>
            <button className="p-2 hover:text-on-surface transition-colors rounded-full hover:bg-surface-variant/50"><Moon className="w-5 h-5" /></button>
            <button className="p-2 hover:text-on-surface transition-colors rounded-full hover:bg-surface-variant/50"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </header>
  );
}
