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
  CheckSquare
} from 'lucide-react';

// Multi-language translation dictionary
const LANGUAGES = [
  { code: 'en', name: 'English (US)', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' }
];

// 4D Cosmic Hypercube Animation Component
const CosmicHypercube = () => {
  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-2xl animate-pulse" />
      <svg className="w-32 h-32 text-cyan-400" viewBox="0 0 100 100" fill="none">
        <polygon points="20,20 80,20 80,80 20,80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.8" />
        <polygon points="35,35 65,35 65,65 35,65" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.9" />
        <line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="20" x2="65" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="80" y1="80" x2="65" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="20" y1="80" x2="35" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
      </svg>
    </div>
  );
};

export function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [mainView, setMainView] = useState('admin'); // 'storefront' or 'admin'
  const [activeTab, setActiveTab] = useState('tool_1_security'); // 'tool_1_security', 'agent_metrics', 'playground', 'keys', 'secrets', 'logs'
  const [selectedNetwork, setSelectedNetwork] = useState('base-sepolia');
  
  const [stats, setStats] = useState({
    total_revenue_usd: 1.85,
    total_requests: 38,
    total_paid_requests: 31,
    total_402_challenges: 7,
    avg_latency_ms: 14,
    active_api_keys: 2
  });

  const [agentMetrics, setAgentMetrics] = useState({
    'audit.cf': {
      agent_id: 'audit.cf',
      agent_name: 'Security Agent (audit.cf)',
      total_calls: 14,
      tokens_in: 18500,
      tokens_out: 4200,
      avg_latency_ms: 12,
      cache_hits: 8,
      total_revenue_usd: 0.70,
      efficiency_score: 94,
      optimization_advice: 'Static wrangler rules cached. Workers AI LLM reasoning triggers for CRITICAL findings.'
    },
    'design.402': {
      agent_id: 'design.402',
      agent_name: 'OpenDesign Agent (design.402)',
      total_calls: 9,
      tokens_in: 9200,
      tokens_out: 6800,
      avg_latency_ms: 18,
      cache_hits: 3,
      total_revenue_usd: 0.45,
      efficiency_score: 88,
      optimization_advice: 'Pre-indexed design token schemas reduce prompt token footprint by 42%.'
    },
    'openspec.plan': {
      agent_id: 'openspec.plan',
      agent_name: 'Architecture Agent (openspec.plan)',
      total_calls: 22,
      tokens_in: 34000,
      tokens_out: 28500,
      avg_latency_ms: 24,
      cache_hits: 11,
      total_revenue_usd: 1.10,
      efficiency_score: 91,
      optimization_advice: 'Reasoning chain distilled via DeepSeek R1 Qwen 32B for 3x edge throughput.'
    },
    'review.kimi': {
      agent_id: 'review.kimi',
      agent_name: 'Code Review Agent (review.kimi)',
      total_calls: 18,
      tokens_in: 29000,
      tokens_out: 5100,
      avg_latency_ms: 9,
      cache_hits: 12,
      total_revenue_usd: 0.90,
      efficiency_score: 96,
      optimization_advice: 'AST pre-scanner filters 82% of unchanged code blocks before triggering AI pass.'
    },
    'nemotron.chat': {
      agent_id: 'nemotron.chat',
      agent_name: 'Workers AI Chat (nemotron.chat)',
      total_calls: 31,
      tokens_in: 41000,
      tokens_out: 32000,
      avg_latency_ms: 15,
      cache_hits: 5,
      total_revenue_usd: 1.55,
      efficiency_score: 89,
      optimization_advice: 'Quantized 8-bit model weights enable sub-20ms edge completion.'
    }
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

  // Testbench State
  const [selectedTestTool, setSelectedTestTool] = useState('audit.cf');
  const [testPayload, setTestPayload] = useState('{\n  "goal": "Build an AI vision proxy for edge micro-transactions"\n}');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  // API Keys State
  const [apiKeysList, setApiKeysList] = useState([
    {
      id: 'key_01',
      name: 'Primary Developer Key',
      key_secret: 'x402_live_demo888899990000',
      balance_usd: 25.00,
      total_spent: 1.45,
      status: 'active',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'key_02',
      name: 'Autonomous Agent ElizaOS',
      key_secret: 'x402_agent_eliza_77889900',
      balance_usd: 50.00,
      total_spent: 4.80,
      status: 'active',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  // Secrets & Encryption State
  const [secretsList, setSecretsList] = useState([]);
  const [newSecretKey, setNewSecretKey] = useState('');
  const [newSecretValue, setNewSecretValue] = useState('');
  const [newSecretCategory, setNewSecretCategory] = useState('ai');
  const [newSecretDesc, setNewSecretDesc] = useState('');
  const [masterPassphrase, setMasterPassphrase] = useState('aifoundry-master-vault-2026');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState({});
  const [editingSecretKey, setEditingSecretKey] = useState(null);
  const [editSecretValue, setEditSecretValue] = useState('');
  const [sandboxInput, setSandboxInput] = useState('cf_api_tok_live_7781a8c9012');
  const [sandboxResult, setSandboxResult] = useState(null);

  // Logs State
  const [logsList, setLogsList] = useState([
    { id: 'log_01', timestamp: new Date().toISOString(), route: '/v1/tools/openspec.plan', status: 200, payment_method: 'L402 Macaroon', revenue_usd: 0.05, latency_ms: 12 },
    { id: 'log_02', timestamp: new Date(Date.now() - 60000).toISOString(), route: '/v1/tools/review.kimi', status: 402, payment_method: 'HTTP 402 Required', revenue_usd: 0, latency_ms: 2 },
    { id: 'log_03', timestamp: new Date(Date.now() - 120000).toISOString(), route: '/v1/tools/audit.cf', status: 200, payment_method: 'EVM USDC (Base)', revenue_usd: 0.05, latency_ms: 8 }
  ]);

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const refreshData = async () => {
    try {
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) setStats(await statsRes.json());

      const metricsRes = await fetch('/api/agent-metrics');
      if (metricsRes.ok) setAgentMetrics(await metricsRes.json());

      const keysRes = await fetch('/api/keys');
      if (keysRes.ok) {
        const data = await keysRes.json();
        if (data.keys) setApiKeysList(data.keys);
      }

      const logsRes = await fetch('/api/logs');
      if (logsRes.ok) setLogsList(await logsRes.json());

      const secretsRes = await fetch('/api/secrets');
      if (secretsRes.ok) setSecretsList(await secretsRes.json());
    } catch (e) {
      console.warn('Failed to refresh data from edge:', e);
    }
  };

  useEffect(() => {
    refreshData();
    const timer = setInterval(refreshData, 10000);
    return () => clearInterval(timer);
  }, []);

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
          NETWORK: selectedNetwork,
          BRAND: "AIFoundry.sh"
        }
      }, null, 2));
      setAuditSourceCode('const apiKey = env.CF_API_TOKEN; // Correctly bound via Cloudflare Secrets');
    }
  };

  // Run Tool 1: Security Agent Audit Test
  const handleRunSecurityAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    setAuditRawHeaders(null);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (auditAuthMode === 'sandbox') {
        headers['X-402-Sandbox-Key'] = 'sandbox_demo';
      } else if (auditAuthMode === 'api_key') {
        headers['X-API-Key'] = 'x402_live_demo888899990000';
      }

      const res = await fetch('/v1/tools/audit.cf', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          wrangler_config: auditWranglerConfig,
          source_code: auditSourceCode,
          project_type: 'worker'
        })
      });

      const responseHeaders = {};
      res.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });
      setAuditRawHeaders(responseHeaders);

      const data = await res.json();
      setAuditResult({
        status: res.status,
        ok: res.ok,
        data
      });

      if (res.status === 200) {
        showToast('Security Agent audit completed successfully! Grant headers mint verified.', 'success');
      } else if (res.status === 402) {
        showToast('HTTP 402 Payment Required challenge received from x402 Gateway.', 'warning');
      } else {
        showToast(`Audit failed with HTTP ${res.status}`, 'error');
      }
      refreshData();
    } catch (e) {
      showToast(`Execution error: ${e.message}`, 'error');
    } finally {
      setIsAuditing(false);
    }
  };

  // Run Tool Testbench Call
  const handleRunTestTool = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      let parsedBody = {};
      try {
        parsedBody = JSON.parse(testPayload);
      } catch (e) {
        parsedBody = { prompt: testPayload };
      }

      const res = await fetch(`/v1/tools/${selectedTestTool}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-402-Sandbox-Key': 'sandbox_demo'
        },
        body: JSON.stringify(parsedBody)
      });

      const data = await res.json();
      setTestResult({
        status: res.status,
        data
      });
      showToast(`Execution completed for ${selectedTestTool}`, 'success');
      refreshData();
    } catch (e) {
      showToast(`Test execution failed: ${e.message}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleFaucetTopup = async () => {
    try {
      const res = await fetch('/api/faucet/topup', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        showToast(`Testnet faucet top-up claimed! New balance: $${data.new_balance.toFixed(2)}`, 'success');
        refreshData();
      }
    } catch (e) {
      showToast('Faucet claim failed.', 'error');
    }
  };

  const handleAddSecret = async () => {
    const trimmedKey = newSecretKey.trim().toUpperCase();
    const trimmedVal = newSecretValue.trim();
    if (!trimmedKey || !trimmedVal) {
      showToast('Key name and secret value are required.', 'warning');
      return;
    }
    try {
      const res = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_name: trimmedKey,
          secret_value: trimmedVal,
          category: newSecretCategory,
          description: newSecretDesc.trim() || 'Custom Gateway Secret',
          passphrase: masterPassphrase
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(`Secret ${trimmedKey} encrypted with AES-256-GCM & saved!`, 'success');
        setNewSecretKey('');
        setNewSecretValue('');
        setNewSecretDesc('');
        await refreshData();
      } else {
        showToast(data.error || 'Failed to save secret.', 'error');
      }
    } catch (e) {
      showToast('Failed to save secret: ' + (e.message || e), 'error');
    }
  };

  const handleDecryptSecret = async (key_name, secret_value) => {
    if (revealedSecrets[key_name]) {
      // Toggle hide
      const updated = { ...revealedSecrets };
      delete updated[key_name];
      setRevealedSecrets(updated);
      return;
    }

    try {
      const res = await fetch('/api/secrets/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_name,
          secret_value,
          passphrase: masterPassphrase
        })
      });
      const data = await res.json();
      if (res.ok && data.plaintext) {
        setRevealedSecrets({ ...revealedSecrets, [key_name]: data.plaintext });
        showToast(`Decrypted ${key_name} using Master Passphrase`, 'success');
      } else {
        showToast(data.error || 'Decryption failed. Check passphrase.', 'error');
      }
    } catch (e) {
      showToast('Decryption error: ' + (e.message || e), 'error');
    }
  };

  const handleUpdateSecret = async (key_name, updatedValue) => {
    const trimmedVal = updatedValue ? updatedValue.trim() : '';
    if (!trimmedVal) {
      showToast('New secret value cannot be empty.', 'warning');
      return;
    }
    try {
      const existing = secretsList.find(s => s.key_name === key_name);
      const res = await fetch('/api/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_name,
          secret_value: trimmedVal,
          category: existing ? existing.category : 'ai',
          description: existing ? existing.description : 'Custom Gateway Secret',
          passphrase: masterPassphrase
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(`Secret ${key_name} updated & re-encrypted!`, 'success');
        setEditingSecretKey(null);
        setEditSecretValue('');
        // clear revealed state so user can re-decrypt
        const updatedRev = { ...revealedSecrets };
        delete updatedRev[key_name];
        setRevealedSecrets(updatedRev);
        await refreshData();
      } else {
        showToast(data.error || 'Failed to update secret.', 'error');
      }
    } catch (e) {
      showToast('Failed to update secret: ' + (e.message || e), 'error');
    }
  };

  const handleDeleteSecret = async (key_name) => {
    try {
      const res = await fetch(`/api/secrets/${encodeURIComponent(key_name)}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Secret ${key_name} deleted.`, 'info');
        refreshData();
      }
    } catch (e) {
      showToast('Failed to delete secret.', 'error');
    }
  };

  const handleTestCrypto = async (action) => {
    if (!sandboxInput) return;
    try {
      const res = await fetch('/api/secrets/test-crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plaintext: sandboxInput,
          passphrase: masterPassphrase,
          action
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSandboxResult(data);
        showToast(`AES-256-GCM ${action} successful!`, 'success');
      } else {
        showToast(data.error || 'Crypto operation failed.', 'error');
      }
    } catch (e) {
      showToast('Crypto operation error.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-950 text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Notification Banner */}
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

      {/* Main Top Navigation Header */}
      <header className="border-b border-indigo-500/20 bg-cosmic-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-cosmic-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white cyan-text-glow">AIFoundry.sh</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-mono font-semibold text-indigo-300">
                  x402 Gateway v1.0
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Prepaid Capability-Gated AI Tools on Cloudflare Edge</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Testnet Switcher */}
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

            {/* Testnet Faucet Button */}
            <button
              onClick={handleFaucetTopup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-emerald-500/30 transition-all shadow-md"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ $10 Faucet</span>
            </button>

            {/* View Switcher Button */}
            <div className="flex p-1 rounded-xl bg-cosmic-850 border border-indigo-500/30 text-xs">
              <button
                onClick={() => setMainView('admin')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  mainView === 'admin' ? 'bg-indigo-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Admin Console
              </button>
              <button
                onClick={() => setMainView('storefront')}
                className={`px-3 py-1 rounded-lg transition-all font-semibold ${
                  mainView === 'storefront' ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Storefront
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Console View */}
      {mainView === 'admin' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
          
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-cosmic-900/80 border border-indigo-500/20 p-4 rounded-3xl space-y-6">
            <div className="p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-center space-y-1">
              <CosmicHypercube />
              <div className="text-[11px] font-bold text-cyan-300 font-mono">Cloudflare Workers AI</div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>DeepSeek R1 / Nemotron</span>
              </div>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('tool_1_security')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'tool_1_security'
                    ? 'glass-panel-glow text-cyan-300 border-cyan-400/40 shadow-lg shadow-cyan-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="truncate">Tool 1: Security Agent</span>
              </button>

              <button
                onClick={() => setActiveTab('agent_metrics')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'agent_metrics'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg shadow-indigo-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Agent Efficiency & Metrics</span>
              </button>

              <button
                onClick={() => setActiveTab('playground')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'keys'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <span>API Keys & Ledger</span>
              </button>

              <button
                onClick={() => setActiveTab('secrets')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'secrets'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Workspace Variables & Secrets</span>
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'logs'
                    ? 'glass-panel-glow text-indigo-300 border-indigo-400/40 shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-cosmic-850'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Edge Request Logs</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">

            {/* TAB 1: TOOL 1 SECURITY AGENT */}
            {activeTab === 'tool_1_security' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white cyan-text-glow">Tool 1: Cloudflare Security Agent (`audit.cf`)</h2>
                        <p className="text-xs text-gray-400 font-mono">Scans wrangler config & worker code for secrets, test wallets, and x402 compliance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        $0.05 / audit call
                      </span>
                    </div>
                  </div>

                  {/* Preset Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePresetSelect('insecure_wrangler')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        auditInputType === 'insecure_wrangler'
                          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                          : 'bg-cosmic-900 border-indigo-500/20 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Preset A: Insecure Config (Triggers CRITICAL Findings)</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Exposed PAY_TO address, plain JWT_SECRET, hardcoded sk- key</p>
                    </button>

                    <button
                      onClick={() => handlePresetSelect('secure_wrangler')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        auditInputType === 'secure_wrangler'
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                          : 'bg-cosmic-900 border-indigo-500/20 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Preset B: Clean Production Config</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">Externalized secrets managed via Cloudflare Secret Store</p>
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 font-mono">wrangler.json / wrangler.toml</label>
                      <textarea
                        value={auditWranglerConfig}
                        onChange={(e) => setAuditWranglerConfig(e.target.value)}
                        rows={8}
                        className="w-full p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-300 font-mono">Worker Source Code Snippet</label>
                      <textarea
                        value={auditSourceCode}
                        onChange={(e) => setAuditSourceCode(e.target.value)}
                        rows={8}
                        className="w-full p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Payment Header Mode & Trigger Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">Payment Mode:</span>
                      <select
                        value={auditAuthMode}
                        onChange={(e) => setAuditAuthMode(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs text-gray-200 font-mono"
                      >
                        <option value="sandbox">Sandbox Micropayment Header (X-402-Sandbox-Key)</option>
                        <option value="api_key">Pre-funded API Key Header (X-API-Key)</option>
                        <option value="unauthenticated">Unauthenticated (Triggers HTTP 402 Challenge)</option>
                      </select>
                    </div>

                    <button
                      onClick={handleRunSecurityAudit}
                      disabled={isAuditing}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-bold text-xs text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isAuditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span>Execute Security Agent (`audit.cf`)</span>
                    </button>
                  </div>

                  {/* Audit Result Display */}
                  {auditResult && (
                    <div className="p-4 rounded-2xl bg-cosmic-950 border border-indigo-500/30 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-gray-400">HTTP Status:</span>
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            auditResult.status === 200 ? 'bg-emerald-500/20 text-emerald-300' :
                            auditResult.status === 402 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                          }`}>
                            {auditResult.status} {auditResult.status === 200 ? 'OK' : auditResult.status === 402 ? 'PAYMENT REQUIRED' : 'ERROR'}
                          </span>
                        </div>
                        {auditResult.data?.usage && (
                          <div className="text-[11px] font-mono text-cyan-300">
                            Tokens: {auditResult.data.usage.prompt_tokens} in / {auditResult.data.usage.completion_tokens} out ({auditResult.data.usage.total_tokens} total)
                          </div>
                        )}
                      </div>

                      {auditResult.data?.issues && (
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-gray-300 font-mono">Detected Issues ({auditResult.data.issues.length}):</span>
                          {auditResult.data.issues.map((iss, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-cosmic-900 border border-rose-500/30 space-y-1">
                              <div className="flex items-center justify-between text-xs font-bold text-rose-300 font-mono">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                  [{iss.severity}] {iss.title}
                                </span>
                                <span className="text-gray-500 text-[10px]">{iss.rule_id}</span>
                              </div>
                              <p className="text-xs text-gray-300">{iss.description}</p>
                              <div className="text-[11px] text-cyan-300 font-mono bg-cosmic-950 p-2 rounded-lg border border-indigo-500/20 mt-1">
                                Recommendation: {iss.recommendation}
                                {iss.remediation_cmd && (
                                  <div className="text-amber-300 mt-1 font-mono">Fix command: `{iss.remediation_cmd}`</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {auditResult.data?.ai_insights && (
                        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                          <span className="text-xs font-bold text-indigo-300 font-mono flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            Workers AI DeepSeek R1 Synthesis:
                          </span>
                          <p className="text-xs text-gray-200">{auditResult.data.ai_insights}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: AGENT EFFICIENCY & METRICS */}
            {activeTab === 'agent_metrics' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        Agent Efficiency & Optimization Engine
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">Real-time edge performance, token compression ratios, and COGS savings</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                        Model: DeepSeek R1 / Workers AI
                      </span>
                    </div>
                  </div>

                  {/* Summary Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/20 space-y-1">
                      <span className="text-[11px] text-gray-400 font-mono">Total Paid Revenue</span>
                      <div className="text-xl font-bold text-emerald-400 font-mono">${stats.total_revenue_usd.toFixed(2)}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/20 space-y-1">
                      <span className="text-[11px] text-gray-400 font-mono">Average Latency</span>
                      <div className="text-xl font-bold text-cyan-400 font-mono">{stats.avg_latency_ms} ms</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/20 space-y-1">
                      <span className="text-[11px] text-gray-400 font-mono">Token COGS Margin</span>
                      <div className="text-xl font-bold text-purple-400 font-mono">&gt; 98.4%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/20 space-y-1">
                      <span className="text-[11px] text-gray-400 font-mono">Edge Cache Hits</span>
                      <div className="text-xl font-bold text-indigo-400 font-mono">39 calls</div>
                    </div>
                  </div>

                  {/* Per Agent Metrics Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-200 font-mono">5 Active Micro-Service Agents Performance Matrix:</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.values(agentMetrics).map((ag) => (
                        <div key={ag.agent_id} className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 space-y-3">
                          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                            <span className="font-bold text-xs text-cyan-300 font-mono">{ag.agent_name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                              Score: {ag.efficiency_score}/100
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center font-mono">
                            <div className="p-2 rounded-xl bg-cosmic-950 border border-indigo-500/20">
                              <div className="text-[10px] text-gray-400">Total Calls</div>
                              <div className="text-sm font-bold text-white">{ag.total_calls}</div>
                            </div>
                            <div className="p-2 rounded-xl bg-cosmic-950 border border-indigo-500/20">
                              <div className="text-[10px] text-gray-400">Tokens (In/Out)</div>
                              <div className="text-[11px] font-bold text-cyan-300">{Math.round(ag.tokens_in/1000)}k / {Math.round(ag.tokens_out/1000)}k</div>
                            </div>
                            <div className="p-2 rounded-xl bg-cosmic-950 border border-indigo-500/20">
                              <div className="text-[10px] text-gray-400">Avg Latency</div>
                              <div className="text-sm font-bold text-emerald-400">{ag.avg_latency_ms}ms</div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-gray-300 font-mono">
                            <span className="text-cyan-400 font-bold">Optimization Note:</span> {ag.optimization_advice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TESTBENCH */}
            {activeTab === 'playground' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                        <Play className="w-5 h-5 text-indigo-400" />
                        x402 Protocol Interactive Testbench
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">Simulate x402 paid micro-service invocations with live Workers AI models</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-300 font-mono">Select Target Micro-Tool:</label>
                        <select
                          value={selectedTestTool}
                          onChange={(e) => setSelectedTestTool(e.target.value)}
                          className="w-full mt-1 p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs text-gray-200 font-mono"
                        >
                          <option value="audit.cf">Tool 1: Security Agent (audit.cf)</option>
                          <option value="design.402">Tool 2: OpenDesign Spec Generator (design.402)</option>
                          <option value="openspec.plan">Tool 3: Architecture Agent (openspec.plan)</option>
                          <option value="review.kimi">Tool 4: Alibaba Code Review (review.kimi)</option>
                          <option value="nemotron.chat">Tool 5: Workers AI Chat (nemotron.chat)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-300 font-mono">JSON Payload / Prompt:</label>
                        <textarea
                          value={testPayload}
                          onChange={(e) => setTestPayload(e.target.value)}
                          rows={8}
                          className="w-full mt-1 p-3 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-gray-200 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <button
                        onClick={handleRunTestTool}
                        disabled={isTesting}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-xs text-white shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>Send Paid Request ($0.05 USDC)</span>
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 font-mono">Execution Response:</label>
                      <pre className="mt-1 p-4 rounded-2xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-cyan-300 overflow-x-auto h-[280px]">
                        {testResult ? JSON.stringify(testResult, null, 2) : '// Response output will render here after execution.'}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: API KEYS */}
            {activeTab === 'keys' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                        <Key className="w-5 h-5 text-amber-400" />
                        API Keys & Pre-funded Ledger
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">Manage API keys for autonomous agents (ElizaOS, LangChain, AutoGPT)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {apiKeysList.map((key) => (
                      <div key={key.id} className="p-4 rounded-2xl bg-cosmic-900 border border-indigo-500/30 flex items-center justify-between gap-4 font-mono">
                        <div>
                          <div className="font-bold text-xs text-white">{key.name}</div>
                          <div className="text-[11px] text-gray-400">{key.key_secret}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">${key.balance_usd.toFixed(2)} Balance</div>
                          <div className="text-[10px] text-gray-500">${key.total_spent.toFixed(2)} total spent</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECRETS & ENCRYPTION */}
            {activeTab === 'secrets' && (
              <div className="space-y-6">
                
                {/* Master Passphrase Vault Header */}
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-indigo-500/20 pb-4 gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        Workspace Environment Secrets & AES-256-GCM Encryption Vault
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">
                        Hardware-grade client/edge secret encryption for Workers AI tokens, Web3 payout keys, and OIDC grants.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>AES-256-GCM Active</span>
                    </div>
                  </div>

                  {/* Master Passphrase Input */}
                  <div className="p-4 rounded-2xl bg-cosmic-900/90 border border-indigo-500/20 space-y-2">
                    <label className="text-xs font-bold text-cyan-300 font-mono flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" />
                      Master Passphrase for Secret Decryption & Re-Keying:
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassphrase ? "text" : "password"}
                          value={masterPassphrase}
                          onChange={(e) => setMasterPassphrase(e.target.value)}
                          placeholder="Enter Master Vault Passphrase..."
                          className="w-full p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/40 text-xs font-mono text-white pr-10 focus:outline-none focus:border-cyan-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassphrase(!showPassphrase)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                        >
                          {showPassphrase ? <Eye className="w-4 h-4 text-cyan-400" /> : <Lock className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                      <button
                        onClick={() => showToast('Master Passphrase updated for local session', 'info')}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 font-bold text-xs text-white transition-all font-mono"
                      >
                        Set Passphrase
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono">
                      * Values are stored at rest with <code className="text-emerald-400 font-bold">enc:v1:</code> IV salt prefix. Passing this passphrase unlocks Workers AI execution without storing unencrypted secrets on disk.
                    </p>
                  </div>

                  {/* Add New Encrypted Secret Form */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      Add / Encrypt New Environment Variable
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="KEY_NAME (e.g. CF_API_TOKEN)"
                        value={newSecretKey}
                        onChange={(e) => setNewSecretKey(e.target.value.toUpperCase())}
                        className="p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="password"
                        placeholder="Plaintext Secret Value"
                        value={newSecretValue}
                        onChange={(e) => setNewSecretValue(e.target.value)}
                        className="p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                      />
                      <select
                        value={newSecretCategory}
                        onChange={(e) => setNewSecretCategory(e.target.value)}
                        className="p-2.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-gray-200"
                      >
                        <option value="ai">AI Models & Keys</option>
                        <option value="web3">Web3 & Pay Wallets</option>
                        <option value="system">System & OIDC Tokens</option>
                      </select>
                      <button
                        onClick={handleAddSecret}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 font-bold text-xs text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Encrypt & Save
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Optional Description (e.g. Workers AI Production Bearer Token)"
                      value={newSecretDesc}
                      onChange={(e) => setNewSecretDesc(e.target.value)}
                      className="w-full p-2 rounded-xl bg-cosmic-950/60 border border-indigo-500/20 text-xs font-mono text-gray-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {/* Encrypted Secrets Inventory Table */}
                  <div className="space-y-3 pt-4 border-t border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        Encrypted Secrets Inventory ({secretsList.length})
                      </h3>
                      <button
                        onClick={refreshData}
                        className="p-1.5 rounded-lg bg-cosmic-900 border border-indigo-500/30 text-xs text-gray-300 hover:text-white"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {secretsList.map((sec, idx) => {
                        const isRevealed = !!revealedSecrets[sec.key_name];
                        const isEditing = editingSecretKey === sec.key_name;

                        return (
                          <div key={idx} className="p-4 rounded-2xl bg-cosmic-900/80 border border-indigo-500/20 hover:border-indigo-500/40 transition-all space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-cyan-300 font-mono">{sec.key_name}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                  sec.category === 'ai' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                  sec.category === 'web3' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                  'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                }`}>
                                  {sec.category?.toUpperCase() || 'SYS'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-emerald-400" />
                                  AES-256-GCM
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDecryptSecret(sec.key_name, sec.secret_value)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                                    isRevealed
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                                      : 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/30 hover:bg-indigo-600/50'
                                  }`}
                                >
                                  {isRevealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                  {isRevealed ? 'Hide Plaintext' : 'Reveal Decrypted'}
                                </button>

                                <button
                                  onClick={() => {
                                    if (isEditing) {
                                      setEditingSecretKey(null);
                                    } else {
                                      setEditingSecretKey(sec.key_name);
                                      setEditSecretValue(revealedSecrets[sec.key_name] || '');
                                    }
                                  }}
                                  className="p-1.5 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-gray-300 hover:text-white"
                                  title="Edit & Re-encrypt"
                                >
                                  <Sliders className="w-4 h-4 text-purple-400" />
                                </button>

                                <button
                                  onClick={() => handleDeleteSecret(sec.key_name)}
                                  className="p-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60"
                                  title="Delete Secret"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 font-mono">{sec.description || 'Custom Workspace Variable'}</p>

                            {/* Cipher text / Revealed Plaintext View */}
                            <div className="p-3 rounded-xl bg-cosmic-950 border border-indigo-500/30 font-mono text-xs overflow-x-auto">
                              {isRevealed ? (
                                <div className="space-y-1">
                                  <span className="text-amber-400 text-[10px] uppercase font-bold flex items-center gap-1">
                                    <Unlock className="w-3 h-3" />
                                    Decrypted Plaintext Value (In-Memory Only):
                                  </span>
                                  <div className="text-emerald-300 font-bold select-all break-all">{revealedSecrets[sec.key_name]}</div>
                                </div>
                              ) : (
                                <div className="space-y-1">
                                  <span className="text-gray-500 text-[10px] uppercase font-bold">Encrypted Rest Ciphertext:</span>
                                  <div className="text-gray-400 text-[11px] break-all">{sec.secret_value}</div>
                                </div>
                              )}
                            </div>

                            {/* Inline Editing Form */}
                            {isEditing && (
                              <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/40 space-y-2 animate-fadeIn">
                                <label className="text-[11px] font-bold text-cyan-300 font-mono">
                                  Update Plaintext Value for <code className="text-white">{sec.key_name}</code>:
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editSecretValue}
                                    onChange={(e) => setEditSecretValue(e.target.value)}
                                    placeholder="Enter new value..."
                                    className="flex-1 p-2 rounded-xl bg-cosmic-950 border border-indigo-500/30 text-xs font-mono text-white"
                                  />
                                  <button
                                    onClick={() => handleUpdateSecret(sec.key_name, editSecretValue)}
                                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white font-mono"
                                  >
                                    Re-Encrypt & Save
                                  </button>
                                  <button
                                    onClick={() => setEditingSecretKey(null)}
                                    className="px-3 py-2 rounded-xl bg-cosmic-900 text-gray-400 hover:text-white text-xs font-mono"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AES-256-GCM Live Cipher Sandbox */}
                  <div className="p-5 rounded-2xl bg-cosmic-900/90 border border-purple-500/30 space-y-3 pt-4">
                    <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Interactive AES-256-GCM Cipher Sandbox & Verification
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Test hardware encryption/decryption in real-time to verify zero plaintext leakage on edge isolates.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={sandboxInput}
                        onChange={(e) => setSandboxInput(e.target.value)}
                        placeholder="Test Plaintext or Encrypted Cipher string"
                        className="sm:col-span-2 p-2.5 rounded-xl bg-cosmic-950 border border-purple-500/30 text-xs font-mono text-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTestCrypto('encrypt')}
                          className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white font-mono flex items-center justify-center gap-1"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Encrypt
                        </button>
                        <button
                          onClick={() => handleTestCrypto('decrypt')}
                          className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white font-mono flex items-center justify-center gap-1"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          Decrypt
                        </button>
                      </div>
                    </div>

                    {sandboxResult && (
                      <div className="p-3 rounded-xl bg-cosmic-950 border border-purple-500/30 font-mono text-xs space-y-1">
                        <div className="text-[10px] text-cyan-400 font-bold uppercase">Sandbox Cipher Output:</div>
                        <pre className="text-emerald-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(sandboxResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 6: LOGS */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-white cyan-text-glow flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-cyan-400" />
                        Edge Request Audit Log Stream
                      </h2>
                      <p className="text-xs text-gray-400 font-mono">Live HTTP 402 challenges and 200 settled payments</p>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {logsList.map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-cosmic-900 border border-indigo-500/20 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            log.status === 200 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {log.status}
                          </span>
                          <span className="text-gray-200">{log.route}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400 text-[11px]">
                          <span>{log.payment_method}</span>
                          <span className="text-emerald-400 font-bold">${log.revenue_usd.toFixed(2)}</span>
                          <span>{log.latency_ms}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      )}

      {/* Public Storefront View */}
      {mainView === 'storefront' && (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          <div className="glass-panel-glow p-8 rounded-3xl text-center space-y-4 border border-cyan-500/30">
            <ShieldCheck className="w-12 h-12 text-cyan-400 mx-auto" />
            <h1 className="text-3xl font-bold text-white cyan-text-glow">AIFoundry.sh API Marketplace</h1>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto font-mono">
              Prepaid capability-gated AI micro-services monetized via x402 HTTP standard & Cloudflare Workers AI.
            </p>
            <div className="pt-2">
              <button
                onClick={() => { setMainView('admin'); setActiveTab('tool_1_security'); }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 font-bold text-xs text-white shadow-xl shadow-cyan-500/20"
              >
                Open Admin Portal & Test Tool 1 (`audit.cf`)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
