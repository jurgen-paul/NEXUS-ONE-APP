import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  FilePlus, 
  Eye, 
  Download, 
  Trash2, 
  X, 
  Check, 
  Clock, 
  Building2, 
  DollarSign, 
  UserCheck, 
  Sparkles, 
  Link2, 
  Save, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  FileCode,
  Globe,
  Plus
} from "lucide-react";
import { db } from "@/src/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { cn } from "@/src/lib/utils";

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  templateType: string;
  date: string;
  content: string;
  variables: Record<string, string>;
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: any;
  defaultTitle: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type: "text" | "date" | "number" | "textarea";
  }[];
  generateContent: (vars: Record<string, string>) => string;
}

const TEMPLATES: Template[] = [
  {
    id: "nda",
    name: "Mutual Non-Disclosure Agreement",
    type: "Legal",
    description: "Standard confidential sharing agreement for corporate partnerships.",
    icon: UserCheck,
    defaultTitle: "NDA - {{partyB}}",
    fields: [
      { key: "partyA", label: "Disclosing Party (Company A)", placeholder: "Nexus One Ltd.", type: "text" },
      { key: "partyB", label: "Receiving Party (Company B)", placeholder: "Apex Cybernetics", type: "text" },
      { key: "purpose", label: "Purpose of Disclosure", placeholder: "Evaluating potential technical collaboration in quantum-AI interfaces.", type: "text" },
      { key: "effectiveDate", label: "Effective Date", placeholder: "2026-07-02", type: "date" },
    ],
    generateContent: (vars) => `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on this ${vars.effectiveDate || "2026-07-02"} ("Effective Date"), by and between:

DISCLOSING PARTY ("Company A"): ${vars.partyA || "Nexus One Ltd."}
RECEIVING PARTY ("Company B"): ${vars.partyB || "Apex Cybernetics"}

1. PURPOSE OF DISCLOSURE
The parties wish to explore a potential business opportunity of mutual interest concerning:
"${vars.purpose || "Evaluating potential technical collaboration in quantum-AI interfaces."}"

2. CONFIDENTIAL INFORMATION
Confidential Information refers to any proprietary information, technical data, trade secrets, or know-how disclosed by one party to another, which is designated as confidential or should reasonably be understood to be confidential.

3. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to hold all Confidential Information in strict confidence and shall not use such information for any purpose other than evaluating the Purpose stated above.

4. TERM AND TERMINATION
This Agreement and the obligations hereunder shall remain in effect for a period of five (5) years from the Effective Date, unless terminated earlier by written agreement.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

For Company A:
Signed: __________________________
Title: Chief Executive Officer

For Company B:
Signed: __________________________
Title: Representative`
  },
  {
    id: "invoice",
    name: "Service Invoice",
    type: "Billing",
    description: "Sleek professional invoice template for services rendered.",
    icon: DollarSign,
    defaultTitle: "Invoice #{{invoiceNum}} - {{clientName}}",
    fields: [
      { key: "invoiceNum", label: "Invoice Number", placeholder: "INV-2026-004", type: "text" },
      { key: "clientName", label: "Client Name", placeholder: "Genesis Tech Corp", type: "text" },
      { key: "description", label: "Description of Services", placeholder: "System Migration & Multi-Node Cluster Configuration", type: "textarea" },
      { key: "amount", label: "Total Amount Due ($)", placeholder: "12500", type: "number" },
      { key: "dueDate", label: "Due Date", placeholder: "2026-07-31", type: "date" },
    ],
    generateContent: (vars) => `INVOICE

Invoice Number: ${vars.invoiceNum || "INV-2026-004"}
Date of Issue: 2026-07-02
Payment Due Date: ${vars.dueDate || "2026-07-31"}

PREPARED FOR:
Client Name: ${vars.clientName || "Genesis Tech Corp"}

DESCRIPTION OF WORK:
----------------------------------------------------------------------
${vars.description || "System Migration & Multi-Node Cluster Configuration"}
----------------------------------------------------------------------

TOTAL AMOUNT DUE: $${Number(vars.amount || 12500).toLocaleString()}

PAYMENT TERMS:
Please send payments via wire transfer to the account provided in your master service agreement. Net 30 terms apply. Thank you for your continued business.`
  },
  {
    id: "contract",
    name: "Master Service Agreement",
    type: "Business",
    description: "Comprehensive independent contractor or consulting contract.",
    icon: Building2,
    defaultTitle: "Service Agreement - {{clientName}}",
    fields: [
      { key: "clientName", label: "Client Name", placeholder: "Oracle Syndicate", type: "text" },
      { key: "providerName", label: "Provider Name", placeholder: "Nexus One Systems", type: "text" },
      { key: "scope", label: "Scope of Services", placeholder: "Full-stack development of the primary responsive portal with Live Sync capabilities.", type: "textarea" },
      { key: "rate", label: "Compensation Rate ($/hour)", placeholder: "185", type: "number" },
      { key: "endDate", label: "Project Target Completion Date", placeholder: "2026-12-15", type: "date" },
    ],
    generateContent: (vars) => `MASTER SERVICES CONTRACT

This Master Services Contract ("Agreement") is executed and effective as of July 2, 2026, by and between:

CLIENT: ${vars.clientName || "Oracle Syndicate"}
SERVICE PROVIDER: ${vars.providerName || "Nexus One Systems"}

1. SERVICES RENDERED
The Provider shall perform the following professional services for the Client:
"${vars.scope || "Full-stack development of the primary responsive portal with Live Sync capabilities."}"

2. PAYMENT AND COMPENSATION
The Client shall compensate the Provider at a rate of $${vars.rate || "185"} per hour, payable on a bi-weekly basis upon submission of verified timesheets.

3. WORK PRODUCT OWNERSHIP
All intellectual property, code, mockups, design patterns, and systems developed under this contract shall belong exclusively to the Client upon receipt of full payment.

4. ENGAGEMENT TIMELINE
This contract is active immediately and is scheduled for completion or review on or before ${vars.endDate || "2026-12-15"}.

IN WITNESS WHEREOF, the parties hereto have set their hands on this agreement.

Client Representative: __________________________
Provider Representative: __________________________`
  }
];

export const SmartDocs = () => {
  const [syncProfileId, setSyncProfileId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nexus_sync_profile_id") || "default-commander";
    }
    return "default-commander";
  });

  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: "demo-1",
      title: "Service Agreement - Zenith Corp",
      type: "Business",
      templateType: "contract",
      date: "2 mins ago",
      variables: { clientName: "Zenith Corp", rate: "150" },
      content: `MASTER SERVICES CONTRACT\n\nCLIENT: Zenith Corp\nSERVICE PROVIDER: Nexus One Systems\n\n1. SERVICES RENDERED\nConsultation and core infrastructure migration.`
    },
    {
      id: "demo-2",
      title: "NDA - Apex Cybernetics",
      type: "Legal",
      templateType: "nda",
      date: "1 hour ago",
      variables: { partyB: "Apex Cybernetics" },
      content: `MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between Nexus One and Apex Cybernetics...`
    }
  ]);

  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline" | "loading">("loading");
  
  // Dropdown states
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);

  // Modal Wizard states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  
  // Preview / Editor modal states
  const [activePreviewDoc, setActivePreviewDoc] = useState<DocumentItem | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContentText, setEditedContentText] = useState("");

  // Subscribe to Cloud Firestore sync profile
  useEffect(() => {
    setSyncStatus("loading");
    const docRef = doc(db, "nexus_profiles", syncProfileId);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.documents) {
          setDocuments(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(data.documents)) {
              return data.documents;
            }
            return prev;
          });
          setSyncStatus("synced");
        } else {
          setSyncStatus("synced");
        }
      } else {
        // Init with demo documents
        setDoc(docRef, { documents }, { merge: true })
          .then(() => setSyncStatus("synced"))
          .catch(() => setSyncStatus("offline"));
      }
    }, (err) => {
      console.error("SmartDocs firestore subscription error:", err);
      setSyncStatus("offline");
    });

    return () => unsubscribe();
  }, [syncProfileId]);

  // Sync back to cloud on document modifications
  const syncDocumentsToCloud = (nextDocs: DocumentItem[]) => {
    setSyncStatus("saving");
    const docRef = doc(db, "nexus_profiles", syncProfileId);
    setDoc(docRef, { documents: nextDocs }, { merge: true })
      .then(() => setSyncStatus("synced"))
      .catch((err) => {
        console.error("SmartDocs firestore update error:", err);
        setSyncStatus("offline");
      });
  };

  const openWizard = (template: Template) => {
    setSelectedTemplate(template);
    // Initialize form values with defaults or empty strings
    const initialValues: Record<string, string> = {};
    template.fields.forEach(f => {
      initialValues[f.key] = f.placeholder;
    });
    setFormValues(initialValues);
    setIsWizardOpen(true);
    setIsTemplateDropdownOpen(false);
  };

  const handleFieldChange = (key: string, val: string) => {
    setFormValues(prev => ({ ...prev, [key]: val }));
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resolve Title
    let title = selectedTemplate.defaultTitle;
    selectedTemplate.fields.forEach(f => {
      const val = formValues[f.key] || f.placeholder;
      title = title.replace(`{{${f.key}}}`, val);
    });

    const docContent = selectedTemplate.generateContent(formValues);

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title,
      type: selectedTemplate.type,
      templateType: selectedTemplate.id,
      date: "Just now",
      content: docContent,
      variables: formValues
    };

    const nextDocs = [newDoc, ...documents];
    setDocuments(nextDocs);
    syncDocumentsToCloud(nextDocs);
    setIsWizardOpen(false);

    // Auto-open preview of the newly created document
    setActivePreviewDoc(newDoc);
  };

  const handleDeleteDoc = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextDocs = documents.filter(d => d.id !== id);
    setDocuments(nextDocs);
    syncDocumentsToCloud(nextDocs);
    if (activePreviewDoc?.id === id) {
      setActivePreviewDoc(null);
    }
  };

  const handleSaveEditedContent = () => {
    if (!activePreviewDoc) return;
    const updatedDoc = { ...activePreviewDoc, content: editedContentText, date: "Edited just now" };
    const nextDocs = documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
    setDocuments(nextDocs);
    setActivePreviewDoc(updatedDoc);
    syncDocumentsToCloud(nextDocs);
    setIsEditingContent(false);
  };

  const handleDownloadDoc = (docItem: DocumentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const blob = new Blob([docItem.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docItem.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header with Selector */}
      <header className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold uppercase tracking-tight neon-text">Smart Documents</h2>
          <p className="text-nexus-text-dim mt-1">Automated form and compliant legal document generator.</p>
        </div>

        {/* Dropdown Menu Template Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
            className="px-6 py-2.5 bg-nexus-accent text-black font-bold rounded-xl flex items-center gap-2 hover:bg-white hover:shadow-[0_0_20px_rgba(5,255,161,0.4)] transition-all text-xs uppercase tracking-wider"
          >
            <FilePlus className="w-4 h-4 text-black" />
            Create Document
            {isTemplateDropdownOpen ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>

          <AnimatePresence>
            {isTemplateDropdownOpen && (
              <>
                {/* Backdrop clicks */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsTemplateDropdownOpen(false)} 
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 glass border border-nexus-accent/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/5 bg-nexus-accent/5">
                    <span className="text-[9px] font-mono font-bold text-nexus-accent uppercase tracking-widest">Select a Template Protocol</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {TEMPLATES.map((tmpl) => {
                      const Icon = tmpl.icon;
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => openWizard(tmpl)}
                          className="w-full text-left p-3.5 hover:bg-nexus-accent/10 flex items-start gap-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-nexus-accent/20 transition-colors">
                            <Icon className="w-4 h-4 text-nexus-text-dim group-hover:text-nexus-accent" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-xs text-white group-hover:text-nexus-accent transition-colors">{tmpl.name}</h4>
                              <span className="text-[8px] font-mono px-1 border border-white/10 rounded uppercase text-nexus-text-dim">{tmpl.type}</span>
                            </div>
                            <p className="text-[9px] text-nexus-text-dim mt-1 font-mono leading-relaxed">{tmpl.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Cloud Sync Status and active passkey banner */}
      <div className="glass p-3 px-4 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-nexus-text-dim">
          <Clock className="w-3.5 h-3.5" />
          <span>REAL-TIME DIRECTORY SYNC:</span>
          <span className="text-nexus-accent uppercase font-bold">{syncProfileId}</span>
        </div>
        <div>
          {syncStatus === "loading" && <span className="text-yellow-500 animate-pulse">● RECONSTRUCTING DB...</span>}
          {syncStatus === "saving" && <span className="text-cyan-400 animate-pulse">● COMMITTING DOCUMENT STATE...</span>}
          {syncStatus === "synced" && <span className="text-nexus-accent">● ALL DOCUMENTS SYNCED</span>}
          {syncStatus === "offline" && <span className="text-red-500">● OFFLINE PERSISTENCE ACTIVE</span>}
        </div>
      </div>

      {/* Document Library Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((docItem) => (
          <div 
            key={docItem.id} 
            onClick={() => setActivePreviewDoc(docItem)}
            className="glass p-6 rounded-2xl group hover:border-nexus-accent/30 hover:bg-nexus-accent/[0.02] transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-nexus-accent/10 transition-colors">
                {docItem.templateType === "invoice" ? (
                  <DollarSign className="w-6 h-6 text-nexus-text-dim group-hover:text-nexus-accent transition-colors" />
                ) : docItem.templateType === "nda" ? (
                  <UserCheck className="w-6 h-6 text-nexus-text-dim group-hover:text-nexus-accent transition-colors" />
                ) : (
                  <Building2 className="w-6 h-6 text-nexus-text-dim group-hover:text-nexus-accent transition-colors" />
                )}
              </div>
              <h4 className="font-bold mb-1 font-display leading-tight text-white group-hover:text-nexus-accent transition-colors">
                {docItem.title}
              </h4>
              <p className="text-xs text-nexus-text-dim uppercase tracking-widest font-mono">{docItem.type}</p>
            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-[10px] text-nexus-text-dim font-mono uppercase">{docItem.date}</span>
              <div className="flex gap-1.5">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePreviewDoc(docItem);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-all"
                  title="View Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleDownloadDoc(docItem, e)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-nexus-text-dim hover:text-white transition-all"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleDeleteDoc(docItem.id, e)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-nexus-text-dim hover:text-red-400 transition-all"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty library placeholder box */}
        {documents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-white/10 rounded-3xl">
            <FileCode className="w-12 h-12 text-nexus-text-dim/20 mb-4" />
            <p className="text-xs font-mono text-nexus-text-dim uppercase">Empty directory vault. Click "Create Document" to start.</p>
          </div>
        )}
      </div>

      {/* DOCUMENT COMPILATION FORM (MODAL WIZARD) */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass max-w-lg w-full rounded-3xl border border-nexus-accent/30 overflow-hidden shadow-[0_0_50px_rgba(5,255,161,0.15)] flex flex-col max-h-[90vh]"
            >
              <header className="p-6 border-b border-white/5 flex items-center justify-between bg-nexus-accent/5 shrink-0">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-nexus-accent animate-pulse" />
                  <div>
                    <h3 className="font-display font-bold text-base text-white uppercase tracking-tight">Compile {selectedTemplate.name}</h3>
                    <p className="text-[10px] text-nexus-text-dim font-mono uppercase tracking-wider mt-0.5">Parameters Wizard</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsWizardOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all"
                >
                  <X className="w-5 h-5 text-nexus-text-dim" />
                </button>
              </header>

              <form onSubmit={handleCreateDocument} className="p-6 overflow-y-auto space-y-4 flex-1">
                <p className="text-[10px] font-mono text-nexus-text-dim uppercase leading-relaxed mb-4">
                  Fill out the parameters for this official template. The smart processor will compile these into legally styled text automatically.
                </p>

                {selectedTemplate.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-[9px] text-nexus-accent font-mono uppercase tracking-widest block">{field.label}</label>
                    
                    {field.type === "textarea" ? (
                      <textarea
                        required
                        placeholder={field.placeholder}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-nexus-accent/50 focus:bg-white/[0.02] transition-all font-display"
                      />
                    ) : (
                      <input
                        required
                        type={field.type}
                        placeholder={field.placeholder}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-nexus-accent/50 focus:bg-white/[0.02] transition-all font-display"
                      />
                    )}
                  </div>
                ))}

                <div className="pt-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsWizardOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-bold uppercase text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-nexus-accent text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(5,255,161,0.5)] hover:bg-white transition-all font-mono text-xs uppercase flex items-center gap-2"
                  >
                    Compile document
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DOCUMENT PREVIEW & DIRECT TEXT EDITOR MODAL */}
      <AnimatePresence>
        {activePreviewDoc && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass max-w-4xl w-full h-[85vh] rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col"
            >
              {/* Preview Header */}
              <header className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.01]">
                <div>
                  <h3 className="font-display font-bold text-lg text-white leading-tight">{activePreviewDoc.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-nexus-text-dim uppercase">
                    <span>TYPE: {activePreviewDoc.type}</span>
                    <span>•</span>
                    <span>LAST COMPILED: {activePreviewDoc.date}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isEditingContent ? (
                    <>
                      <button
                        onClick={handleSaveEditedContent}
                        className="px-4 py-1.5 bg-nexus-accent text-black font-bold rounded-xl hover:bg-white transition-all text-xs flex items-center gap-1.5 uppercase font-mono"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingContent(false)}
                        className="px-3 py-1.5 hover:bg-white/5 rounded-xl text-xs uppercase font-mono text-white transition-colors"
                      >
                        Discard
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditedContentText(activePreviewDoc.content);
                          setIsEditingContent(true);
                        }}
                        className="px-4 py-1.5 glass text-white hover:text-nexus-accent hover:border-nexus-accent/30 font-bold rounded-xl transition-all text-xs uppercase font-mono"
                      >
                        Edit Text
                      </button>
                      <button
                        onClick={() => handleDownloadDoc(activePreviewDoc)}
                        className="p-2 hover:bg-white/5 rounded-xl text-nexus-text-dim hover:text-white transition-all"
                        title="Download Raw File"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(activePreviewDoc.id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl text-nexus-text-dim hover:text-red-400 transition-all"
                        title="Delete Document"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  
                  <div className="h-6 w-px bg-white/10 mx-2" />

                  <button
                    onClick={() => {
                      setActivePreviewDoc(null);
                      setIsEditingContent(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5 text-nexus-text-dim" />
                  </button>
                </div>
              </header>

              {/* Main Document Body Section */}
              <div className="flex-1 overflow-y-auto p-8 bg-black/30 flex justify-center">
                {isEditingContent ? (
                  <div className="w-full max-w-3xl h-full flex flex-col space-y-2">
                    <span className="text-[10px] font-mono text-nexus-accent uppercase tracking-widest">Interactive Raw Document Compiler Editor</span>
                    <textarea
                      value={editedContentText}
                      onChange={(e) => setEditedContentText(e.target.value)}
                      className="w-full flex-1 bg-[#12141c] border border-nexus-accent/20 rounded-2xl p-6 text-sm font-mono text-white/90 outline-none focus:border-nexus-accent/50 focus:ring-1 focus:ring-nexus-accent/20 leading-relaxed overflow-y-auto"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-2xl bg-white text-gray-900 shadow-2xl p-12 md:p-16 rounded-2xl font-serif text-sm leading-relaxed relative min-h-[600px] border border-gray-200 select-text overflow-x-hidden">
                    {/* Immersive Legal Letterhead Header */}
                    <div className="border-b-2 border-gray-800 pb-6 mb-8 font-sans flex justify-between items-end">
                      <div>
                        <h1 className="font-extrabold text-xl tracking-tight text-gray-900 uppercase">NEXUS CO. LEGAL SERVICES</h1>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5 tracking-wider">OFFICIAL SYSTEM DOCUMENT RECORD</p>
                      </div>
                      <div className="text-right text-[10px] text-gray-500 font-mono">
                        <p>ID: {activePreviewDoc.id}</p>
                        <p>SECURITY: CLASS-IV</p>
                      </div>
                    </div>

                    {/* Pre-formatted printed document text content */}
                    <pre className="whitespace-pre-wrap font-serif text-sm text-gray-800 tracking-wide select-text">
                      {activePreviewDoc.content}
                    </pre>

                    {/* Bottom stamp decoration */}
                    <div className="mt-16 pt-8 border-t border-gray-100 font-sans flex items-center justify-between text-[10px] text-gray-400">
                      <span>NEXUS ONE COMPLIANCE SYSTEM PROTOCOL v.2.4</span>
                      <span className="font-mono">COMPILED: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default SmartDocs;
