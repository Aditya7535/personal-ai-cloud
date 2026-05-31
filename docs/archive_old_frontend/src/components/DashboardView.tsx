import { MessageSquare, FileText, Zap, Database, History, Terminal, LineChart } from 'lucide-react';

export function DashboardView() {
  return (
    <div className="h-full overflow-y-auto pt-8 pb-32 px-8">
      <div className="max-w-container_max_width mx-auto">
        <div className="mb-10">
          <h2 className="text-headline-lg mb-2">Workspace Overview</h2>
          <p className="text-on-surface-variant text-body-md">Welcome back. Your neural cloud is synchronized and active.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Widget title="Total Chats" value="248" change="+12%" icon={MessageSquare} />
          <Widget title="Uploaded Docs" value="12" change="Stable" type="neutral" icon={FileText} />
          <Widget title="AI Queries" value="1.2k" change="+2.4k" icon={Zap} />
          <div className="glass-card p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary-container/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <span className="text-error text-label-caps">42% Used</span>
            </div>
            <div>
              <p className="text-on-surface-variant text-label-caps mb-1">STORAGE</p>
              <div className="flex items-end gap-2 mb-2">
                <p className="text-headline-lg">420MB</p>
                <p className="text-on-surface-variant pb-1">/ 1GB</p>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[42%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8 rounded-xl relative overflow-hidden border-t-2 border-t-[#8B5CF6]">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-headline-md">AI Query Intelligence</h3>
                <p className="text-body-sm text-on-surface-variant mt-1">Volume trends over the last 7 days</p>
              </div>
              <div className="flex gap-2 bg-surface-container-highest p-1 rounded-lg">
                <button className="px-3 py-1 bg-surface-variant text-label-caps rounded-[4px] shadow-sm">7D</button>
                <button className="px-3 py-1 text-label-caps rounded-md text-on-surface-variant hover:text-on-surface transition-colors">30D</button>
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-64 w-full relative flex items-end justify-between px-2">
              <div className="absolute inset-0 border-b border-outline-variant/30 flex flex-col justify-between py-2">
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full border-t border-outline-variant/10"></div>
                <div className="w-full"></div>
              </div>
              <svg className="absolute inset-0 w-full h-64 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 256">
                <defs>
                  <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"></stop>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,200 Q100,180 150,120 T300,140 T450,60 T600,100 T800,40" fill="none" stroke="#3B82F6" strokeWidth="3"></path>
                <path d="M0,200 Q100,180 150,120 T300,140 T450,60 T600,100 T800,40 V256 H0 Z" fill="url(#lineGrad)"></path>
                <circle cx="150" cy="120" r="4" fill="#3B82F6"></circle>
                <circle cx="450" cy="60" r="4" fill="#3B82F6"></circle>
                <circle cx="800" cy="40" r="4" fill="#3B82F6"></circle>
              </svg>
              <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-label-caps text-on-surface-variant">
                <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-8 rounded-xl flex flex-col">
            <h3 className="text-headline-md mb-6">Recent Activity</h3>
            <div className="space-y-6 flex-1 overflow-y-auto">
               <ActivityRow icon={MessageSquare} title="Chat: Project Alpha Strategy" time="Modified 2m ago" />
               <ActivityRow icon={FileText} title="PDF Upload: Q4 Financials.pdf" time="Processed 1h ago" color="text-tertiary" bg="bg-tertiary/10" />
               <ActivityRow icon={Terminal} title="Query: Llama 3.2 Performance" time="Completed 3h ago" color="text-primary" bg="bg-primary/10" />
               <ActivityRow icon={History} title="View History" time="See all activity" color="text-on-surface-variant" bg="bg-surface-variant" opacity="opacity-60" />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
           <div className="glass-card p-4 rounded-xl flex items-center gap-4 bg-surface-container-low/50 border-none">
              <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
              <span className="text-code text-on-surface-variant">Model Status: Latency Optimal</span>
           </div>
           <div className="glass-card p-4 rounded-xl flex items-center gap-4 bg-surface-container-low/50 border-none">
              <span className="text-code text-on-surface-variant">Last Sync: Today, 14:02:44</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function Widget({ title, value, change, icon: Icon, type = 'positive' }: { title: string, value: string, change: string, icon: any, type?: 'positive'|'neutral'|'negative' }) {
  const colorClass = type === 'positive' ? 'text-tertiary' : type === 'neutral' ? 'text-on-surface-variant' : 'text-error';
  return (
    <div className="glass-card p-6 rounded-xl flex flex-col justify-between group hover:border-primary/40 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary-container/10 rounded-lg group-hover:bg-primary-container/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className={`${colorClass} text-label-caps`}>{change}</span>
      </div>
      <div>
        <p className="text-on-surface-variant text-label-caps mb-1 uppercase">{title}</p>
        <p className="text-headline-lg">{value}</p>
      </div>
    </div>
  );
}

function ActivityRow({ icon: Icon, title, time, color = 'text-primary', bg = 'bg-primary/10', opacity = 'opacity-100' }: any) {
  return (
    <div className={`flex gap-4 group cursor-pointer ${opacity}`}>
      <div className={`w-10 h-10 shrink-0 rounded-lg ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold truncate group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[12px] text-on-surface-variant">{time}</p>
      </div>
    </div>
  );
}
