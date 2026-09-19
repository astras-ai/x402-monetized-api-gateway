import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ShieldCheck,
  Zap,
  Terminal,
  Globe,
  Coins,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Code2,
  Cpu,
  FileText,
  DollarSign,
  Layers,
  Lock,
  Unlock,
  Sparkles,
  Check,
  Bot,
  Send,
  ArrowRight,
  BookOpen
} from 'lucide-react';

// 4D Cosmic Hypercube Visual Component
const CosmicHypercube = () => {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center my-2">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-xl animate-pulse" />
      <svg className="w-24 h-24 text-cyan-400" viewBox="0 0 100 100" fill="none">
        <polygon points="20,20 80,20 80,80 20,80" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.8" />
        <polygon points="35,35 65,35 65,65 35,65" stroke="#818cf8" strokeWidth="1.2" strokeOpacity="0.9" />
        <line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="20" x2="65" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="80" x2="65" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="20" y1="80" x2="35" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'catalog', 'sdks', 'x402spec'
  const [selectedNetwork, setSelectedNetwork] = useState('base-sepolia');
  const [notification, setNotification] = useState(null);

  // Simulator State
  const [selectedTool, setSelectedTool] = useState('openspec.plan');
  const [payMode, setPayMode] = useState('x402_header'); // 'unpaid', 'x402_header', 'l402_token'
  const [customPrompt, setCustomPrompt] = useState('{\n  "goal": "Build an AI monetized image generator on Cloudflare Workers"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);

  // SDK Code Tab State
  const [sdkLang, setSdkLang] = useState('python'); // 'python', 'typescript', 'curl'

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRunTool = async () => {
    setIsExecuting(true);
    setExecResult(null);
    setResponseHeaders(null);

    try {
      let bodyData = {};
      try {
        bodyData = JSON.parse(customPrompt);
      } catch (e) {
        bodyData = { prompt: customPrompt };
      }

      const headers = {
        'Content-Type': 'application/json'
      };

      if (payMode === 'x402_header') {
        headers['X-402-Settle-Paid'] = 'true';
      } else if (payMode === 'l402_token') {
        headers['Authorization'] = 'Bearer l402_macaroon_jwt_demo_grant';
      }

      const res = await fetch(`/v1/tools/${selectedTool}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bodyData)
      });

      const hdrs = {};
      res.headers.forEach((val, key) => {
        hdrs[key] = val;
      });
      setResponseHeaders(hdrs);

      const data = await res.json();
      setExecResult({
        status: res.status,
        statusText: res.statusText,
        data
      });

      if (res.status === 200) {
        showToast(`200 OK — Paid $0.05 USDC & Executed ${selectedTool}`, 'success');
      } else if (res.status === 402) {
        showToast('HTTP 402 Payment Required Challenge Issued by x402 Gateway', 'warning');
      } else {
        showToast(`HTTP ${res.status} returned from edge`, 'error');
      }
    } catch (err) {
      showToast(`Execution error: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  return (
    <div className="min-h-screen bg-cosmic-950 text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-xs font-semibold flex items-center gap-2 animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' :
          notification.type === 'warning' ? 'bg-amber-950/90 border-amber-500/40 text-amber-300' :
          notification.type === 'error' ? 'bg-rose-950/90 border-rose-500/40 text-rose-300' :
          'bg-indigo-950/90 border-indigo-500/40 text-cyan-300'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {notification.type === 'error' && <XCircle className="w-4 h-4 text-rose-400" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Top Header */}
      <header className="border-b border-indigo-500/20 bg-cosmic-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-cosmic-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white cyan-text-glow">AIFoundry.sh</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-mono font-semibold text-indigo-300">
                  x402 AI Agent Gateway
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Autonomous Pay-Per-Call AI Tools on Cloudflare Edge</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Network Selector */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cosmic-850 border border-indigo-500/30 text-xs">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="bg-transparent text-gray-200 font-mono text-xs focus:outline-none cursor-pointer"
              >
                <option value="base-sepolia" className="bg-cosmic-900">Base Sepolia (84532)</option>
                <option value="solana-devnet" className="bg-cosmic-900">Solana Devnet</option>
                <option value="polygon-amoy" className="bg-cosmic-900">Polygon Amoy (80002)</option>
                <option value="arbitrum-sepolia" className="bg-cosmic-900">Arbitrum Sepolia (421614)</option>
                <option value="base" className="bg-cosmic-900">Base Mainnet (8453)</option>
              </select>
            </div>

            <button
              onClick={() => showToast('Simulated $10 USDC Testnet Faucet Credit Added!', 'success')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-500/30 transition-all shadow-md"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Faucet $10</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-cosmic-900/80 border border-indigo-500/20 p-4 rounded-3xl space-y-6">
          <div className="p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-center space-y-1">
            <CosmicHypercube />
            <div className="text-[11px] font-bold text-cyan-300 font-mono">x402 Payment Standard</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>HTTP 402 Active</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'glass-panel-glow text-cyan-300 border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
              }`}
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Interactive x402 Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>AI Tools Catalog ($0.05/call)</span>
            </button>

            <button
              onClick={() => setActiveTab('sdks')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sdks'
                  ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
              }`}
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Agent SDKs & Code Snippets</span>
            </button>

            <button
              onClick={() => setActiveTab('x402spec')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'x402spec'
                  ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>x402 Protocol Discovery</span>
            </button>
          </nav>

          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-gray-300 font-mono space-y-1">
            <span className="text-cyan-300 font-bold">Pay-To Address:</span>
            <div className="text-[10px] text-gray-400 truncate">0x71C74B532b2C34a5d89f816d8F349582f3402B89</div>
            <div className="text-[10px] text-emerald-400 pt-1">USDC Base/Solana Accepted</div>
          </div>
        </aside>

        {/* Main Panel Content */}
        <main className="flex-1 space-y-6">

          {/* TAB 1: INTERACTIVE x402 SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                    <Play className="w-5 h-5 text-cyan-400" />
                    How an Autonomous AI Pays & Consumes Services
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">Simulate real-time HTTP 402 payment negotiation and instant AI execution</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  $0.05 USDC / call
                </div>
              </div>

              {/* Step 1 & 2 Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-extrabold flex items-center justify-center">1</span>
                    Select AI Micro-Tool:
                  </label>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="openspec.plan">OpenSpec Software Architecture Generator (`openspec.plan`)</option>
                    <option value="review.kimi">Alibaba Open Code Review (`review.kimi`)</option>
                    <option value="audit.cf">Cloudflare Security Audit (`audit.cf`)</option>
                    <option value="design.402">OpenDesign UI Spec Generator (`design.402`)</option>
                    <option value="nemotron.chat">Workers AI Edge Chat (`nemotron.chat`)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-extrabold flex items-center justify-center">2</span>
                    Payment / Settlement Mode:
                  </label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs text-gray-200 font-mono focus:outline-none focus:border-cyan-400"
                  >
                    <option value="unpaid">Unpaid / No Header (Triggers HTTP 402 Challenge)</option>
                    <option value="x402_header">x402 Micropayment Header (X-402-Settle-Paid: true)</option>
                    <option value="l402_token">L402 Macaroon Token (Authorization: Bearer l402_...)</option>
                  </select>
                </div>
              </div>

              {/* JSON Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-extrabold flex items-center justify-center">3</span>
                  JSON Payload / Goal Prompt:
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={5}
                  className="w-full p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleRunTool}
                disabled={isExecuting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-bold text-xs text-white shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send Request to Gateway Endpoint (`/v1/tools/{selectedTool}`)</span>
              </button>

              {/* Response Display */}
              {execResult && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-cosmic-950 border border-indigo-500/30 space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-gray-400">Response Code:</span>
                        <span className={`px-2.5 py-0.5 rounded-md font-bold ${
                          execResult.status === 200 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          execResult.status === 402 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          HTTP {execResult.status} {execResult.status === 200 ? 'OK (PAID & GRANTED)' : execResult.status === 402 ? 'PAYMENT REQUIRED' : 'ERROR'}
                        </span>
                      </div>
                    </div>

                    {/* Headers Inspector */}
                    {responseHeaders && (
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-indigo-300 font-mono">x402 Protocol Headers:</span>
                        <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-gray-300 space-y-1 overflow-x-auto">
                          {Object.entries(responseHeaders).map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <span className="text-cyan-400">{k}:</span>
                              <span className="text-emerald-300">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* JSON Output Body */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-300 font-mono">JSON Body Payload:</span>
                      <pre className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[300px]">
                        {JSON.stringify(execResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI TOOLS CATALOG */}
          {activeTab === 'catalog' && (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    Monetized AI Tool Catalog ($0.05 USDC / call)
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">Capability-gated micro-services available to autonomous agents</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300 font-mono">`openspec.plan`</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">$0.05 USDC</span>
                  </div>
                  <p className="text-xs text-gray-300">Software Architecture Generator via Fission AI OpenSpec & DeepSeek R1 reasoning chain.</p>
                  <div className="text-[10px] text-gray-500 font-mono">Provider: Fission AI + Workers AI</div>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300 font-mono">`review.kimi`</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">$0.05 USDC</span>
                  </div>
                  <p className="text-xs text-gray-300">Alibaba Open Code Review engine with AST pre-screening and exact token receipt meter.</p>
                  <div className="text-[10px] text-gray-500 font-mono">Provider: Alibaba Open Code Review</div>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300 font-mono">`audit.cf`</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">$0.05 USDC</span>
                  </div>
                  <p className="text-xs text-gray-300">Scans Wrangler configs and Worker code for exposed secret keys and insecure bindings.</p>
                  <div className="text-[10px] text-gray-500 font-mono">Provider: Cloudflare Security Audit Skill</div>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300 font-mono">`design.402`</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">$0.05 USDC</span>
                  </div>
                  <p className="text-xs text-gray-300">Generates tailwind design tokens, layout specs, and UI component hierarchies.</p>
                  <div className="text-[10px] text-gray-500 font-mono">Provider: OpenDesign DeepSeek</div>
                </div>

                <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-cyan-300 font-mono">`nemotron.chat`</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">$0.05 USDC</span>
                  </div>
                  <p className="text-xs text-gray-300">Sub-20ms edge LLM chat completion proxy directly on Cloudflare Workers AI.</p>
                  <div className="text-[10px] text-gray-500 font-mono">Provider: Cloudflare Workers AI</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AGENT SDKs */}
          {activeTab === 'sdks' && (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                    AI Agent Integration Code Snippets
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">Drop into Python, TypeScript, LangChain, or ElizaOS in 1 line of code</p>
                </div>

                <div className="flex p-1 rounded-xl bg-cosmic-850 border border-indigo-500/30 text-xs">
                  <button
                    onClick={() => setSdkLang('python')}
                    className={`px-3 py-1 rounded-lg transition-all font-mono font-bold ${
                      sdkLang === 'python' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Python
                  </button>
                  <button
                    onClick={() => setSdkLang('typescript')}
                    className={`px-3 py-1 rounded-lg transition-all font-mono font-bold ${
                      sdkLang === 'typescript' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    onClick={() => setSdkLang('curl')}
                    className={`px-3 py-1 rounded-lg transition-all font-mono font-bold ${
                      sdkLang === 'curl' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    cURL
                  </button>
                </div>
              </div>

              {/* Code Panel */}
              <div className="relative p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs text-cyan-300 overflow-x-auto">
                <button
                  onClick={() => handleCopy(
                    sdkLang === 'python' ? `import requests\n\n# 1. Call x402 AI Gateway tool\nurl = "https://gateway.aifoundry.sh/v1/tools/openspec.plan"\nheaders = {"X-402-Settle-Paid": "true"}\npayload = {"goal": "Build an AI vision proxy"}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())` :
                    sdkLang === 'typescript' ? `// TypeScript / Node.js AI Agent Call\nconst res = await fetch('https://gateway.aifoundry.sh/v1/tools/review.kimi', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json',\n    'X-402-Settle-Paid': 'true'\n  },\n  body: JSON.stringify({ code: 'const x = 10;' })\n});\nconst data = await res.json();\nconsole.log(data);` :
                    `curl -X POST "https://gateway.aifoundry.sh/v1/tools/audit.cf" \\\n  -H "Content-Type: application/json" \\\n  -H "X-402-Settle-Paid: true" \\\n  -d '{"wrangler_config": "{\"name\": \"my-worker\"}"}'`,
                    'SDK Code'
                  )}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-cosmic-850 hover:bg-cosmic-800 border border-indigo-500/30 text-gray-300 hover:text-white text-[11px] flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>

                {sdkLang === 'python' && (
                  <pre className="whitespace-pre">{`import requests

# 1. Autonomous AI Agent calls x402 Tool Endpoint
url = "https://gateway.aifoundry.sh/v1/tools/openspec.plan"
headers = {
    "X-402-Settle-Paid": "true", # Or attach L402 Macaroon Header
    "Content-Type": "application/json"
}
payload = {
    "goal": "Build a x402 AI edge gateway on Cloudflare Workers"
}

res = requests.post(url, json=payload, headers=headers)

if res.status_code == 200:
    print("AI Tool Result:", res.json())
elif res.status_code == 402:
    challenge = res.json()["x402"]
    print(f"Payment Required: Settle {challenge['price_usd']} USDC on {challenge['network']}")`}</pre>
                )}

                {sdkLang === 'typescript' && (
                  <pre className="whitespace-pre">{`// TypeScript / Node.js AI Agent (ElizaOS / LangChain)
import fetch from 'node-fetch';

async function executeX402Tool(toolName: string, promptPayload: object) {
  const url = \`https://gateway.aifoundry.sh/v1/tools/\${toolName}\`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-402-Settle-Paid': 'true', // Settles $0.05 USDC micropayment
    },
    body: JSON.stringify(promptPayload)
  });

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else if (response.status === 402) {
    throw new Error('x402 Payment Challenge Issued');
  }
}`}</pre>
                )}

                {sdkLang === 'curl' && (
                  <pre className="whitespace-pre">{`# Direct cURL call for AI Agents & Terminal CLIs
curl -X POST "https://gateway.aifoundry.sh/v1/tools/audit.cf" \\
  -H "Content-Type: application/json" \\
  -H "X-402-Settle-Paid: true" \\
  -d '{
    "wrangler_config": "{\\"name\\": \\"my-ai-worker\\", \\"vars\\": {\\"NETWORK\\": \\"base-sepolia\\"}}"
  }'`}</pre>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: x402 SPECIFICATION */}
          {activeTab === 'x402spec' && (
            <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Machine-Readable Payment Standard Manifest (`/.well-known/x402`)
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">Standardized protocol response for web crawler & agent payment discovery</p>
                </div>
              </div>

              <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto">
{JSON.stringify({
  "x402_version": 1,
  "gateway": "AIFoundry.sh",
  "supported_networks": ["base-sepolia", "solana-devnet", "polygon-amoy", "arbitrum-sepolia", "base"],
  "accepted_assets": ["USDC"],
  "default_price_usd": 0.05,
  "facilitator_url": "https://x402.org/facilitator",
  "pay_to": "0x71C74B532b2C34a5d89f816d8F349582f3402B89",
  "tools": [
    { "id": "openspec.plan", "price_usd": 0.05, "endpoint": "/v1/tools/openspec.plan" },
    { "id": "review.kimi", "price_usd": 0.05, "endpoint": "/v1/tools/review.kimi" },
    { "id": "audit.cf", "price_usd": 0.05, "endpoint": "/v1/tools/audit.cf" },
    { "id": "design.402", "price_usd": 0.05, "endpoint": "/v1/tools/design.402" },
    { "id": "nemotron.chat", "price_usd": 0.05, "endpoint": "/v1/tools/nemotron.chat" }
  ]
}, null, 2)}
              </pre>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
