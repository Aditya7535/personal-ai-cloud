import { UploadCloud, FileText, Eye, Trash2, Zap } from 'lucide-react';

export function KnowledgeBaseView() {
  return (
    <div className="h-full flex overflow-hidden">
       <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
         <section>
          <h2 className="text-headline-lg mb-2">Knowledge Base</h2>
          <p className="text-body-md text-on-surface-variant">Manage and index your personal documents for AI retrieval.</p>
         </section>

         {/* Upload Zone */}
         <section className="w-full">
           <div className="border-2 border-dashed border-outline-variant/60 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group p-12 flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
             </div>
             <h3 className="text-headline-md mb-2">Drag & Drop Documents</h3>
             <p className="text-body-sm text-on-surface-variant mb-4">Click to browse or drag and drop files here</p>
             <div className="flex gap-2">
               <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant text-code text-on-surface-variant">PDF</span>
               <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant text-code text-on-surface-variant">DOCX</span>
               <span className="px-3 py-1 bg-surface-container rounded border border-outline-variant text-code text-on-surface-variant">TXT</span>
             </div>
           </div>
         </section>

         {/* Table */}
         <section className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
             <h4 className="text-label-caps text-on-surface-variant">RECENT DOCUMENTS</h4>
             <span className="text-body-sm text-on-surface-variant">3 Files • 12.4 MB</span>
           </div>
           
           <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
             <table className="w-full border-collapse text-left">
               <thead>
                 <tr className="border-b border-outline-variant bg-surface-container-high/50">
                   <th className="px-6 py-4 text-label-caps text-on-surface-variant">Name</th>
                   <th className="px-6 py-4 text-label-caps text-on-surface-variant">Size</th>
                   <th className="px-6 py-4 text-label-caps text-on-surface-variant">Date</th>
                   <th className="px-6 py-4 text-label-caps text-on-surface-variant text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-outline-variant/30">
                 <DocRow name="Q4 Financials.pdf" size="2.4 MB" date="Oct 12, 2023" />
                 <DocRow name="RAG Pipeline specs.pdf" size="8.1 MB" date="Oct 14, 2023" active />
                 <DocRow name="Customer Feedback.pdf" size="1.9 MB" date="Oct 15, 2023" />
               </tbody>
             </table>
           </div>
         </section>
       </div>
       
       {/* Mock Slide out detail panel */}
       <aside className="w-[400px] h-full glass-card border-l border-outline-variant flex flex-col shadow-2xl relative right-0 border-y-0 rounded-none z-10 border-r-0">
          <div className="p-6 border-b border-outline-variant">
            <h5 className="text-headline-md">Document Details</h5>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-auto">
            <div className="aspect-video bg-surface-container-lowest border border-outline-variant rounded-lg flex items-center justify-center flex-col gap-2">
              <FileText className="w-8 h-8 text-on-surface-variant/50" />
              <span className="text-label-caps text-on-surface-variant">PREVIEW UNAVAILABLE</span>
            </div>
            
            <div>
              <h6 className="text-label-caps text-on-surface-variant mb-2">METADATA</h6>
              <div className="bg-surface-container-low rounded-lg p-4 space-y-3 border border-outline-variant/50">
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">File Name</span>
                  <span className="text-body-sm font-semibold truncate max-w-[200px]">RAG Pipeline specs.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-sm text-on-surface-variant">Tokens Indexed</span>
                  <span className="text-code text-primary">142,502</span>
                </div>
              </div>
            </div>

            <div>
              <h6 className="text-label-caps text-on-surface-variant mb-2">AI SUMMARY</h6>
              <div className="bg-primary/5 p-4 rounded-lg border-l-2 border-primary">
                 <p className="text-body-sm italic leading-relaxed text-on-surface">"Technical specifications for the Retrieval-Augmented Generation (RAG) architecture, detailing vector database embeddings and context window optimization strategies."</p>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-outline-variant flex gap-3 bg-surface/50">
            <button className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
               <Zap className="w-4 h-4" /> Ask about this
            </button>
          </div>
       </aside>
    </div>
  );
}

function DocRow({ name, size, date, active = false }: any) {
  return (
    <tr className={`group hover:bg-surface-variant/30 transition-colors cursor-pointer ${active ? 'bg-primary-container/5 border-l-2 border-l-primary' : ''}`}>
       <td className="px-6 py-4">
         <div className="flex items-center gap-3">
           <FileText className="w-5 h-5 text-error" />
           <span className="font-semibold text-body-md">{name}</span>
         </div>
       </td>
       <td className="px-6 py-4 text-code text-on-surface-variant">{size}</td>
       <td className="px-6 py-4 text-body-sm text-on-surface-variant">{date}</td>
       <td className="px-6 py-4 text-right">
         <div className={`flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity`}>
           <button className="p-2 hover:bg-surface-container-highest rounded text-primary transition-colors"><Eye className="w-4 h-4" /></button>
           <button className="p-2 hover:bg-error/20 rounded text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
         </div>
       </td>
    </tr>
  )
}
