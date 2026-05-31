import { Zap, Copy, FileText, ArrowRight, Paperclip, Mic, Send } from 'lucide-react';

export function ChatView() {
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex-1 overflow-y-auto pt-8 pb-40 px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* User Message */}
          <div className="flex flex-col items-end gap-2">
            <div className="bg-surface-container-high text-on-surface py-3 px-5 rounded-2xl rounded-tr-sm max-w-[80%] border border-outline-variant shadow-sm">
              <p className="text-body-md">Analyze the Q4 financials for trends in cloud spending.</p>
            </div>
            <span className="text-label-caps text-on-surface-variant opacity-50 mr-1">JUST NOW</span>
          </div>

          {/* AI Response */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-start gap-4 max-w-[95%]">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex-shrink-0 flex items-center justify-center mt-1 shadow-md">
                <Zap className="text-white w-4 h-4" />
              </div>
              <div className="space-y-4">
                <div className="text-body-md leading-relaxed text-on-surface">
                  <p className="mb-4">
                    Based on the uploaded <strong className="text-primary font-semibold">Q4 Financials.pdf</strong>, cloud spending increased by 15% due to higher demand for GPU-accelerated computing and auto-scaling events in the production clusters.
                  </p>
                  <p className="mb-4">I've identified three key spending drivers:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-6 text-on-surface-variant">
                    <li>Legacy infrastructure egress costs peaked in October</li>
                    <li>Provisioned throughput for model inference grew 22% MoM</li>
                    <li>Development sandbox environments remained idle for 30% of billing hours</li>
                  </ul>
                  
                  {/* Code Block */}
                  <div className="bg-[#070B14] rounded-xl border border-outline-variant overflow-hidden my-6">
                    <div className="bg-surface-container-high px-4 py-2 flex justify-between items-center border-b border-outline-variant/50">
                      <span className="text-[11px] font-mono text-on-surface-variant">cost_analysis.py</span>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                         <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-code">
                      <code className="text-[#8B5CF6]">def</code> <code className="text-on-surface">calculate_cloud_trend(data):</code>{'\n'}
                      <code className="text-outline">    # Calculate percentage change in cloud spending</code>{'\n'}
                      <code className="text-on-surface">    spending = [d[</code><code className="text-[#4ae176]">'amount'</code><code className="text-on-surface">] </code><code className="text-[#8B5CF6]">for</code> <code className="text-on-surface">d </code><code className="text-[#8B5CF6]">in</code> <code className="text-on-surface">data]</code>{'\n'}
                      <code className="text-on-surface">    increase = (spending[-1] - spending[0]) / spending[0] * 100</code>{'\n'}
                      <code className="text-[#8B5CF6]">    return</code> <code className="text-[#4ae176]">{'f"{increase:.2f}%"'}</code>
                    </pre>
                  </div>

                  {/* Attachment Reference */}
                  <div className="glass-card rounded-xl p-4 flex items-center gap-4 w-fit cursor-pointer hover:border-primary/50 transition-all group">
                    <div className="w-10 h-10 rounded bg-error/10 flex items-center justify-center text-error">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold group-hover:text-primary transition-colors">Q4 Financials.pdf</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">SOURCE DOCUMENT • PDF (2.4 MB)</p>
                    </div>
                    <ArrowRight className="text-on-surface-variant ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="absolute bottom-0 right-0 left-0 p-8 pt-12 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-surface-container-high border border-outline-variant rounded-3xl p-2 flex items-end shadow-2xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <button className="p-3 text-on-surface-variant hover:text-primary transition-colors rounded-full">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea 
               className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface py-3 px-2 resize-none max-h-40 min-h-[48px] outline-none text-body-md" 
               placeholder="Ask anything about your cloud infrastructure..." 
               rows={1}
            />
            <div className="flex items-center gap-1 mb-1 mr-1">
              <button className="p-3 text-on-surface-variant hover:text-primary transition-colors rounded-full">
                <Mic className="w-5 h-5" />
              </button>
              <button className="bg-primary hover:bg-primary/90 text-on-primary p-3 rounded-full shadow-lg transition-transform active:scale-95 flex items-center justify-center">
                <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
              </button>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-[10px] text-on-surface-variant/60 font-semibold tracking-widest uppercase text-center">Enterprise Secured • Advanced Model Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
