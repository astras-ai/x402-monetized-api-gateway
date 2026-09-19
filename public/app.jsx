import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck,
  Zap,
  Key,
  BarChart3,
  Terminal,
  Settings,
  Globe,
  Coins,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Code2,
  Cpu,
  FileText,
  QrCode,
  DollarSign,
  Layers,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Wallet,
  Check,
  HelpCircle,
  Eye,
  Server,
  BookOpen,
  ChevronDown,
  Languages,
  Rocket,
  Store,
  Calculator,
  TrendingUp,
  Bot,
  Send,
  Sliders,
  CheckSquare,
  HelpCircle as FaqIcon
} from 'lucide-react';

// Multi-language translation dictionary
const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', dir: 'ltr' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
];

const I18N_DICT = {
  en: {
    app_title: "AIFoundry.sh",
    app_subtitle: "x402 Monetized Edge Gateway & AI Agent Foundry",
    view_storefront: "Public API Storefront",
    view_admin: "Admin & Developer Portal",
    store_hero_badge: "HTTP 402 Standard • L402 Macaroons • Cloudflare Edge",
    store_hero_title: "Prepaid Capability-Gated AI Tools Built for Autonomous Agents",
    store_hero_subtitle: "Pay fractions of a cent ($0.05) per AI tool call using Web3 USDC signatures, L402 Lightning macaroons, or pre-funded balances.",
    store_hero_cta_explore: "Explore API Catalog",
    store_hero_cta_try: "Test Tool 1: Security Agent",
    store_hero_cta_admin: "Open Admin Console",
    
    nav_tool_1: "Tool 1: Security Agent (audit.cf)",
    nav_playground: "Interactive Testbench",
    nav_routes: "Monetized Routes",
    nav_keys: "API Keys & Ledger",
    nav_secrets: "Workspace Variables",
    nav_logs: "Logs & Revenue",
    nav_deploy: "Production Guide",
  }
};

// 4D Cosmic Hypercube Animation Component
const CosmicHypercube = () => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl animate-quantum-pulse" />
      <svg className="w-40 h-40 animate-tesseract-rotate text-cyan-400" viewBox="0 0 100 100" fill="none">
        {/* Outer Tesseract Cube */}
        <polygon points="20,20 80,20 80,80 20,80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
        {/* Inner 4D Hypercube Projection */}
        <polygon points="35,35 65,35 65,65 35,65" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.9" />
        {/* Inter-dimensional Lattice Vectors */}
        <line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="20" x2="65" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="80" x2="65" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="20" y1="80" x2="35" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        {/* 5D Quantum Core Node */}
        <circle cx="50" cy="50" r="4" fill="#22d3ee" className="animate-ping" />
        <circle cx="50" cy="50" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
};

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [mainView, setMainView] = useState('admin'); // 'storefront' or 'admin'
  const [activeTab, setActiveTab] = useState('tool_1_security'); // 'tool_1_security', 'playground', 'routes', 'keys', 'secrets', 'logs', 'deploy'
  
  const [stats, setStats] = useState({
    total_revenue_usd: 0.15,
    total_requests: 3,
    total_paid_requests: 2,
    total_402_challenges: 1,
    avg_latency_ms: 6,
    active_api_keys: 2
  });

  const [notification, setNotification] = useState(null);

  // Tool 1: Security Agent State
  const [auditInputType, setAuditInputType] = useState('insecure_wrangler');
  const [auditWranglerConfig, setAuditWranglerConfig] = useState(
    JSON.stringify({
      name: "aifoundry-gateway-worker",
      main: "src/index.ts",
      compatibility_date: "2024-09-23",
      vars: {
        PAY_TO: "0x71C74B532b2C34a5d89f816d8F349582f3402B89",
        JWT_SECRET: "raw_secret_in_file_12345"
      }
    }, null, 2)
  );
  const [auditSourceCode, setAuditSourceCode] = useState('const apiKey = "sk-proj-x402secret990011223344";');
  const [auditAuthMode, setAuditAuthMode] = useState('sandbox'); // 'sandbox', 'unauthenticated', 'api_key'
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditRawHeaders, setAuditRawHeaders] = useState(null);

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handlePresetSelect = (preset) => {
    setAuditInputType(preset);
    if (preset === 'insecure_wrangler') {
      setAuditWranglerConfig(JSON.stringify({
        name: "insecure-worker",
        main: "src/index.ts",
        vars: {
          PAY_TO: "0x71C74B532b2C34a5d89f816d8F349582f3402B89",
          JWT_SECRET: "exposed_jwt_secret_in_json"
        }
      }, null, 2));
      setAuditSourceCode('const OPENAI_KEY = "sk-proj-x402secret990011223344";');
    } else if (preset === 'secure_wrangler') {
      setAuditWranglerConfig(JSON.stringify({
        name: "secure-aifoundry-worker",
        main: "src/index.ts",
        compatibility_date: "2024-09-23",
        vars: {
          NETWORK: "base-sepolia",
          BRAND: "AIFoundry.sh"
        }
      }, null, 2));
      setAuditSourceCode('const apiKey = env.OPENAI_API_KEY; // Correctly bound via Cloudflare Secrets');
    }
  };

  // Run Tool 1: Security Agent Test
  const handleRunSecurityAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    setAuditRawHeaders(null);

    const headers = { 'Content-Type': 'application/json' };
    if (auditAuthMode === 'sandbox') {
      headers['X-402-Sandbox-Key'] = 'sandbox_demo';
    } else if (auditAuthMode === 'api_key') {
      headers['X-API-Key'] = 'x402_live_demo888899990000';
    }

    try {
      let parsedWrangler = auditWranglerConfig;
      const res = await fetch('./v1/tools/audit.cf', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          wrangler_config: parsedWrangler,
          source_code: auditSourceCode,
          project_type: 'worker'
        })
      });

      const resHeaders = {};
      res.headers.forEach((v, k) => { resHeaders[k] = v; });
      setAuditRawHeaders(resHeaders);

      const data = await res.json();
      setAuditResult({
        status: res.status,
        statusText: res.statusText,
        data
      });

      if (res.status === 200) {
        showToast("Tool 1 Execution Success! Audit complete.", "success");
      } else if (res.status === 402) {
        showToast("HTTP 402 Payment Required returned!", "warning");
      }
    } catch (err) {
      setAuditResult({
        status: 500,
        statusText: "Client Error",
        data: { error: err.message }
      });
      showToast("Audit execution failed: " + err.message, "error");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col font-sans">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' :
          notification.type === 'warning' ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' :
          'bg-rose-950/90 border-rose-500/50 text-rose-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
           notification.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
           <XCircle className="w-5 h-5 text-rose-400" />}
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Main Cosmic Header */}
      <header className="sticky top-0 z-40 bg-cosmic-950/90 backdrop-blur-md border-b border-indigo-500/20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setMainView('storefront')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <ShieldCheck className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-white tracking-tight cyan-text-glow">AIFoundry.sh</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                  x402 Protocol
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden md:block">Prepaid Capability-Gated AI Gateway for Autonomous Agents</p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-3">
          <div className="bg-cosmic-900 border border-indigo-500/30 p-1 rounded-xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setMainView('admin')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mainView === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Developer Portal & Tool Verification</span>
            </button>
            <button
              onClick={() => setMainView('storefront')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mainView === 'storefront'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Public API Catalog</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Portal View */}
      {mainView === 'admin' && (
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-72 bg-cosmic-900/80 border-b md:border-b-0 md:border-r border-indigo-500/20 p-4 space-y-6">
            
            {/* 4D Hypercube Header Card */}
            <div className="glass-panel p-4 rounded-2xl text-center space-y-2 relative overflow-hidden">
              <CosmicHypercube />
              <div className="text-xs font-bold text-cyan-300 font-mono">4D/5D Quantum Lattice Node</div>
              <p className="text-[11px] text-gray-400">Cloudflare Edge Isolate Engine</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('tool_1_security')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'tool_1_security'
                    ? 'glass-panel-glow text-cyan-300 border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="truncate">Tool 1: Security Agent (audit.cf)</span>
              </button>

              <button
                onClick={() => setActiveTab('playground')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'playground'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <Play className="w-4 h-4 text-indigo-400" />
                <span>x402 Protocol Testbench</span>
              </button>

              <button
                onClick={() => setActiveTab('keys')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'keys'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>API Keys & Credit Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'logs'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Edge Request Audit Logs</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Pane */}
          <main className="flex-1 p-4 lg:p-8 space-y-6">
            
            {/* TOOL 1: Cloudflare Security Agent Verification Tab */}
            {activeTab === 'tool_1_security' && (
              <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="glass-panel-glow p-6 rounded-3xl space-y-3 relative overflow-hidden border-cyan-500/30">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white tracking-tight">Tool 1: Security Agent Verification</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">POST /v1/tools/audit.cf</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">
                        Audits Cloudflare Worker wrangler configurations, unencrypted secret variables, and source code key leaks.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input & Execution Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column: Test Configuration Input */}
                  <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-cyan-400" />
                        <span>1. Select Test Case / Input</span>
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePresetSelect('insecure_wrangler')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            auditInputType === 'insecure_wrangler'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-cosmic-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Insecure Config Case
                        </button>
                        <button
                          onClick={() => handlePresetSelect('secure_wrangler')}
                          className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                            auditInputType === 'secure_wrangler'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-cosmic-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          Clean Secure Case
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-300 font-medium">Wrangler Config JSON / TOML:</label>
                      <textarea
                        rows={8}
                        value={auditWranglerConfig}
                        onChange={(e) => setAuditWranglerConfig(e.target.value)}
                        className="w-full bg-cosmic-950 border border-indigo-500/30 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-gray-300 font-medium">Source Code Snippet to Scan:</label>
                      <input
                        type="text"
                        value={auditSourceCode}
                        onChange={(e) => setAuditSourceCode(e.target.value)}
                        className="w-full bg-cosmic-950 border border-indigo-500/30 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs text-gray-300 font-medium">Payment Authorization Header:</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setAuditAuthMode('sandbox')}
                          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                            auditAuthMode === 'sandbox'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                              : 'bg-cosmic-950 text-gray-400 border-indigo-500/20'
                          }`}
                        >
                          <span>Sandbox Paid ($0.05)</span>
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        </button>

                        <button
                          onClick={() => setAuditAuthMode('unauthenticated')}
                          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                            auditAuthMode === 'unauthenticated'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                              : 'bg-cosmic-950 text-gray-400 border-indigo-500/20'
                          }`}
                        >
                          <span>Unauthenticated (Trigger 402)</span>
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleRunSecurityAudit}
                      disabled={isAuditing}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      {isAuditing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                          <span>Scanning Code & Evaluating Rules...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current text-white" />
                          <span>Execute Tool 1: Security Agent (`audit.cf`)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Column: Execution Output */}
                  <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      <span>2. Tool Output & Cryptographic Proof</span>
                    </h2>

                    {!auditResult ? (
                      <div className="p-12 text-center text-gray-500 space-y-3 border border-dashed border-indigo-500/20 rounded-2xl">
                        <ShieldCheck className="w-10 h-10 mx-auto text-indigo-400/40 animate-pulse" />
                        <p className="text-xs">Click "Execute Tool 1" to run live security analysis.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        
                        {/* Status Header */}
                        <div className="flex items-center justify-between p-3 rounded-xl bg-cosmic-950 border border-indigo-500/30">
                          <span className="text-xs font-mono text-gray-400">Response Status:</span>
                          <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full ${
                            auditResult.status === 200 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {auditResult.status} {auditResult.statusText}
                          </span>
                        </div>

                        {/* Audit Score Meter if 200 OK */}
                        {auditResult.status === 200 && auditResult.data && (
                          <div className="p-4 rounded-2xl bg-cosmic-950 border border-indigo-500/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-300">Security Score:</span>
                              <span className={`text-lg font-bold font-mono ${
                                auditResult.data.audit_score >= 80 ? 'text-emerald-400' : 'text-rose-400'
                              }`}>
                                {auditResult.data.audit_score} / 100
                              </span>
                            </div>

                            {/* Issues list */}
                            {auditResult.data.issues && auditResult.data.issues.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-indigo-500/20">
                                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Security Violations Detected ({auditResult.data.issues.length}):</span>
                                </div>
                                {auditResult.data.issues.map((issue, idx) => (
                                  <div key={idx} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-rose-200">
                                      <span>[{issue.severity}] {issue.title}</span>
                                      <span className="font-mono text-[10px] text-gray-400">{issue.rule_id}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-300">{issue.description}</p>
                                    {issue.remediation_cmd && (
                                      <div className="mt-1 p-1.5 rounded bg-black/60 font-mono text-[10px] text-cyan-300 border border-cyan-500/30">
                                        CLI Fix: {issue.remediation_cmd}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Passed checks */}
                            {auditResult.data.passed_checks && (
                              <div className="space-y-1 pt-2 border-t border-indigo-500/20">
                                <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Passed Checks ({auditResult.data.passed_checks.length}):</span>
                                </div>
                                {auditResult.data.passed_checks.map((check, idx) => (
                                  <div key={idx} className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                    <span>{check}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Raw JSON Data */}
                        <div className="space-y-1">
                          <span className="text-[11px] text-gray-400 font-mono">Raw Response Data:</span>
                          <pre className="p-3 rounded-xl bg-cosmic-950 border border-indigo-500/20 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-60">
                            {JSON.stringify(auditResult.data, null, 2)}
                          </pre>
                        </div>

                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* Other Admin Tabs Placeholder */}
            {activeTab !== 'tool_1_security' && (
              <div className="glass-panel p-8 rounded-3xl text-center space-y-4">
                <Sparkles className="w-10 h-10 mx-auto text-cyan-400" />
                <h2 className="text-lg font-bold text-white">AIFoundry.sh Gateway Management</h2>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Tool 1 (`audit.cf`) is fully active and verified. Use the sidebar to switch back to Tool 1 or explore additional portal services.
                </p>
              </div>
            )}

          </main>

        </div>
      )}

      {/* Public Storefront View */}
      {mainView === 'storefront' && (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          <div className="glass-panel-glow p-8 rounded-3xl text-center space-y-4">
            <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto" />
            <h1 className="text-3xl font-bold text-white cyan-text-glow">AIFoundry.sh API Marketplace</h1>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              Prepaid capability-gated AI tools monetized via the x402 HTTP standard. Zero subscriptions required.
            </p>
            <button
              onClick={() => { setMainView('admin'); setActiveTab('tool_1_security'); }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Test Tool 1: Security Agent (`audit.cf`)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
