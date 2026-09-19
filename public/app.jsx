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
  Sparkles,
  Check,
  Bot,
  ArrowRight,
  BookOpen,
  ArrowUpRight,
  Activity,
  KeyRound
} from 'lucide-react';

const CosmicLogo = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 blur-md opacity-60 animate-pulse" />
      <div className="relative w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center shadow-inner">
        <Bot className="w-5 h-5 text-cyan-400" />
      </div>
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'catalog', 'sdks', 'x402spec'
  const [selectedNetwork, setSelectedNetwork] = useState('base-sepolia');
  const [notification, setNotification] = useState(null);

  // Simulator State
  const [selectedTool, setSelectedTool] = useState('openspec.plan');
  const [payMode, setPayMode] = useState('unpaid'); // 'unpaid' or 'paid'
  const [paymentTxHash, setPaymentTxHash] = useState('tx_0x9f8a32b...usdc_paid');
  const [customPrompt, setCustomPrompt] = useState('{\n  "goal": "Build an AI monetized image generator on Cloudflare Workers"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);

  // SDK Code Tab State
  const [sdkLang, setSdkLang] = useState('python');

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
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

      if (payMode === 'paid') {
        headers['X-402-Payment'] = paymentTxHash || 'tx_0x_settled_usdc';
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
        showToast('HTTP 402 Payment Required: AI agent challenge generated', 'warning');
      } else {
        showToast(`HTTP ${res.status} returned from edge`, 'error');
      }
    } catch (err) {
      showToast(`Execution error: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const toolDetails = {
    'openspec.plan': {
      title: 'OpenSpec Software Architecture',
      price: '$0.05 USDC',
      desc: 'Generates software dev plans, tech stacks, and team persona architectures.',
      provider: 'Fission AI OpenSpec + DeepSeek R1'
    },
    'review.kimi': {
      title: 'Alibaba Open Code Review',
      price: '$0.05 USDC',
      desc: 'AST code review with exact token receipt metering and security checks.',
      provider: 'Alibaba Open Code Review'
    },
    'audit.cf': {
      title: 'Cloudflare Workers Security Audit',
      price: '$0.05 USDC',
      desc: 'Scans Wrangler configs & Worker code for exposed keys and x402 compliance.',
      provider: 'Cloudflare Security Audit Skill'
    },
    'design.402': {
      title: 'OpenDesign UI Spec Generator',
      price: '$0.05 USDC',
      desc: 'Generates tailwind design tokens, component trees, and layout specs.',
      provider: 'OpenDesign DeepSeek'
    },
    'nemotron.chat': {
      title: 'Workers AI Edge Model Chat',
      price: '$0.05 USDC',
      desc: 'Sub-20ms direct edge LLM inference for autonomous AI agent pipelines.',
      provider: 'Cloudflare Workers AI'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : notification.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200'
          }`}
        >
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Zap className="w-5 h-5 text-cyan-400 shrink-0" />}
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CosmicLogo />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AIFoundry.sh
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  x402 Protocol
                </span>
              </div>
              <p className="text-xs text-slate-400">Direct Pay-Per-Call AI Gateway for Autonomous AI Agents</p>
            </div>
          </div>

          {/* Target Wallet / Pay-To info */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-slate-400">Gateway Pay-To:</span>
            <span className="text-cyan-300 font-semibold">0x71C7...2B89</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">$0.05 USDC / call</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-cyan-950/20 via-slate-950 to-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>No API keys. No subscriptions. Pay-per-call for AI Agents.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pay-Per-Call AI Edge Gateway for Autonomous Agents
            </h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              When an AI agent requests a tool without payment, the gateway responds with an <code className="text-cyan-300 font-mono">HTTP 402 Payment Required</code> challenge with exact pricing and recipient address. Once the payment proof is included, execution runs instantly.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Play className="w-4 h-4" />
              Live AI Simulator
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Tool Catalog ($0.05)
            </button>
            <button
              onClick={() => setActiveTab('sdks')}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                activeTab === 'sdks'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              AI Agent Integration Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: LIVE SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column: Request Configuration */}
              <div className="lg:w-1/2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    <h2 className="font-semibold text-sm text-slate-200">AI Agent Request Simulator</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">POST /v1/tools/{selectedTool}</span>
                </div>

                {/* Tool Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Select Target AI Tool ($0.05 USDC)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(toolDetails).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTool(key)}
                        className={`p-3 rounded-lg border text-left text-xs transition-all ${
                          selectedTool === key
                            ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-slate-200">{item.title}</div>
                        <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{item.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Payment Header State</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPayMode('unpaid')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        payMode === 'unpaid'
                          ? 'bg-rose-950/50 border-rose-500/60 text-rose-200'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <XCircle className="w-4 h-4 text-rose-400" />
                        No Payment Header
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Triggers HTTP 402 Payment Required challenge</p>
                    </button>

                    <button
                      onClick={() => setPayMode('paid')}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        payMode === 'paid'
                          ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        X-402-Payment Header Included
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Sends payment proof — executes tool instantly</p>
                    </button>
                  </div>
                </div>

                {payMode === 'paid' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">X-402-Payment Header Value</label>
                    <input
                      type="text"
                      value={paymentTxHash}
                      onChange={(e) => setPaymentTxHash(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                )}

                {/* Prompt JSON */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">JSON Request Body</label>
                  <textarea
                    rows={4}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Execute Button */}
                <button
                  onClick={handleRunTool}
                  disabled={isExecuting}
                  className={`w-full py-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isExecuting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  }`}
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Communicating with Edge Gateway...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Send AI Request ({payMode === 'unpaid' ? 'Test 402 Challenge' : 'Test Paid Request'})
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Gateway Response Inspector */}
              <div className="lg:w-1/2 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    <h2 className="font-semibold text-sm text-slate-200">Gateway Response Inspector</h2>
                  </div>
                  {execResult && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        execResult.status === 200
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : execResult.status === 402
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      HTTP {execResult.status} {execResult.statusText}
                    </span>
                  )}
                </div>

                {!execResult && (
                  <div className="h-80 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 text-xs p-6 text-center">
                    <Bot className="w-10 h-10 mb-3 opacity-30 text-cyan-400" />
                    <p className="font-semibold text-slate-400 mb-1">No request sent yet</p>
                    <p className="text-slate-500 max-w-xs">
                      Click <strong>"Send AI Request"</strong> to test how the x402 Gateway returns 402 challenges to unpaid AI agents vs. executing tool workloads for paid requests.
                    </p>
                  </div>
                )}

                {execResult && (
                  <div className="space-y-4">
                    {/* HTTP Headers */}
                    {responseHeaders && (
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Response Headers Exposed to AI Agent
                        </div>
                        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 space-y-1 overflow-x-auto">
                          {Object.entries(responseHeaders).map(([k, v]) => (
                            <div key={k} className="flex gap-2">
                              <span className="text-slate-500">{k}:</span>
                              <span className="text-slate-200 font-semibold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response JSON Body */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Response Payload (JSON)
                        </span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(execResult.data, null, 2), 'JSON response')}
                          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy JSON
                        </button>
                      </div>
                      <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto max-h-80 scrollbar-thin">
                        {JSON.stringify(execResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOOL CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-100">Monetized AI Tool Catalog</h2>
              <p className="text-xs text-slate-400 mt-1">All tools are priced at $0.05 USDC per execution and served via Cloudflare Workers edge nodes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(toolDetails).map(([key, item]) => (
                <div key={key} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-sm text-slate-100">{item.title}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <span>Provider:</span>
                      <span className="text-slate-300">{item.provider}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">/v1/tools/{key}</span>
                    <button
                      onClick={() => {
                        setSelectedTool(key);
                        setActiveTab('simulator');
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                    >
                      Test in Simulator <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: INTEGRATION CODE FOR AI AGENTS */}
        {activeTab === 'sdks' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-100">How an AI Agent Integrates with x402</h2>
              <p className="text-xs text-slate-400 mt-1">Autonomous AI agents make requests, handle `402 Payment Required` challenges automatically, and attach payment proofs.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSdkLang('python')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono ${
                  sdkLang === 'python' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Python (httpx / requests)
              </button>
              <button
                onClick={() => setSdkLang('typescript')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono ${
                  sdkLang === 'typescript' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                TypeScript / Node.js
              </button>
              <button
                onClick={() => setSdkLang('curl')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono ${
                  sdkLang === 'curl' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                cURL Command
              </button>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 relative">
              <button
                onClick={() => copyToClipboard(
                  sdkLang === 'python'
                    ? `import httpx\n\n# 1. AI Agent calls Gateway Tool\nresponse = httpx.post(\n    "https://gateway.aifoundry.sh/v1/tools/openspec.plan",\n    json={"goal": "Build an AI monetized app"}\n)\n\n# 2. Check for 402 Payment Required\nif response.status_code == 402:\n    challenge = response.json()["x402"]\n    pay_to = challenge["pay_to"]\n    amount_usd = challenge["price_usd"]\n    print(f"Payment Required: Send \${amount_usd} USDC to {pay_to}")\n    \n    # 3. AI Agent signs & submits USDC payment transaction on Base or Solana\n    tx_hash = "0x_signed_usdc_transaction_hash"\n    \n    # 4. Agent retries request with X-402-Payment header\n    paid_response = httpx.post(\n        "https://gateway.aifoundry.sh/v1/tools/openspec.plan",\n        json={"goal": "Build an AI monetized app"},\n        headers={"X-402-Payment": tx_hash}\n    )\n    print("Tool Output:", paid_response.json())`
                    : sdkLang === 'typescript'
                    ? `// AI Agent x402 Payment Handler\nasync function callX402Tool(toolName, payload) {\n  let res = await fetch(\`https://gateway.aifoundry.sh/v1/tools/\${toolName}\`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(payload)\n  });\n\n  if (res.status === 402) {\n    const challenge = await res.json();\n    console.log("402 Challenge:", challenge.x402);\n    \n    // AI Agent submits payment proof\n    const txHash = "0x_signed_usdc_transaction_hash";\n    \n    res = await fetch(\`https://gateway.aifoundry.sh/v1/tools/\${toolName}\`, {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json',\n        'X-402-Payment': txHash\n      },\n      body: JSON.stringify(payload)\n    });\n  }\n\n  return await res.json();\n}`
                    : `curl -X POST https://gateway.aifoundry.sh/v1/tools/openspec.plan \\\n  -H "Content-Type: application/json" \\\n  -H "X-402-Payment: tx_0x_usdc_payment_hash" \\\n  -d '{"goal":"Build monetized gateway"}'`,
                  'SDK Snippet'
                )}
                className="absolute top-4 right-4 text-xs text-cyan-400 flex items-center gap-1 hover:underline"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Snippet
              </button>

              <pre className="text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                {sdkLang === 'python' && `import httpx

# 1. AI Agent calls Gateway Tool
response = httpx.post(
    "https://gateway.aifoundry.sh/v1/tools/openspec.plan",
    json={"goal": "Build an AI monetized app"}
)

# 2. Check for 402 Payment Required
if response.status_code == 402:
    challenge = response.json()["x402"]
    pay_to = challenge["pay_to"]
    amount_usd = challenge["price_usd"]
    print(f"Payment Required: Send \${amount_usd} USDC to {pay_to}")
    
    # 3. AI Agent signs & submits USDC payment transaction on Base or Solana
    tx_hash = "0x_signed_usdc_transaction_hash"
    
    # 4. Agent retries request with X-402-Payment header
    paid_response = httpx.post(
        "https://gateway.aifoundry.sh/v1/tools/openspec.plan",
        json={"goal": "Build an AI monetized app"},
        headers={"X-402-Payment": tx_hash}
    )
    print("Tool Output:", paid_response.json())`}

                {sdkLang === 'typescript' && `// AI Agent x402 Payment Handler
async function callX402Tool(toolName, payload) {
  let res = await fetch(\`https://gateway.aifoundry.sh/v1/tools/\${toolName}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.status === 402) {
    const challenge = await res.json();
    console.log("402 Challenge:", challenge.x402);
    
    // AI Agent submits payment proof
    const txHash = "0x_signed_usdc_transaction_hash";
    
    res = await fetch(\`https://gateway.aifoundry.sh/v1/tools/\${toolName}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-402-Payment': txHash
      },
      body: JSON.stringify(payload)
    });
  }

  return await res.json();
}`}

                {sdkLang === 'curl' && `curl -X POST https://gateway.aifoundry.sh/v1/tools/openspec.plan \\
  -H "Content-Type: application/json" \\
  -H "X-402-Payment: tx_0x_usdc_payment_hash" \\
  -d '{"goal":"Build monetized gateway"}'`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
