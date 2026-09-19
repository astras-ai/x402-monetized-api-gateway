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
  UserCheck,
  Users,
  Compass,
  PieChart,
  Boxes,
  Lock,
  Workflow,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const h = React.createElement;

const CosmicLogo = () => {
  return h('div', { className: 'relative w-10 h-10 flex items-center justify-center shrink-0' },
    h('div', { className: 'absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 blur-md opacity-70 animate-pulse' }),
    h('div', { className: 'relative w-10 h-10 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-center shadow-inner' },
      h('svg', { viewBox: '0 0 100 100', className: 'w-6 h-6 text-cyan-400' },
        h('polygon', { points: '20,20 80,20 80,80 20,80', stroke: 'currentColor', fill: 'none', strokeWidth: '6' }),
        h('polygon', { points: '35,35 65,35 65,65 35,65', stroke: '#818cf8', fill: 'none', strokeWidth: '6' }),
        h('circle', { cx: '50', cy: '50', r: '8', fill: '#22d3ee' })
      )
    )
  );
};

const toolDetails = {
  'openspec.plan': {
    title: 'OpenSpec Software Architecture Plan',
    price: '$0.05 USDC',
    desc: 'Generates production software architecture specs, multi-agent roles, business models, and technical dev plans based on Fission AI OpenSpec format.',
    provider: 'Fission AI OpenSpec + DeepSeek R1'
  },
  'review.kimi': {
    title: 'Alibaba Open Code Review (Kimi)',
    price: '$0.05 USDC',
    desc: 'AST code review engine with token receipt metering, security flaw detection, and COGS margin tracking based on Alibaba Open Code Review.',
    provider: 'Alibaba Open Code Review'
  },
  'audit.cf': {
    title: 'Cloudflare Workers Security Audit',
    price: '$0.05 USDC',
    desc: 'Scans Wrangler configs & Worker code for exposed secrets, insecure bindings, and x402 payment readiness.',
    provider: 'Cloudflare Security Audit Skill'
  },
  'crypto.vault': {
    title: 'Zero-Knowledge Vault Guard',
    price: '$0.05 USDC',
    desc: 'AES-256-GCM hardware isolate encryption & PII scan so AI agents never transport financial/banking metadata in plaintext.',
    provider: 'WebCrypto Edge Isolate'
  },
  'design.402': {
    title: 'OpenDesign UI Spec Generator',
    price: '$0.05 USDC',
    desc: 'Generates tailwind design tokens, atomic component hierarchies, SVG logo specs, and x402 payment modal wireframes.',
    provider: 'OpenDesign DeepSeek'
  },
  'nemotron.chat': {
    title: 'Workers AI Edge Model Chat',
    price: '$0.05 USDC',
    desc: 'Direct sub-20ms edge LLM inference proxy for autonomous AI agents.',
    provider: 'Cloudflare Workers AI (Nemotron/DeepSeek)'
  }
};

const evmNetworks = [
  { network: 'base', name: 'Base Mainnet', chainId: 8453, usdc: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'ethereum', name: 'Ethereum Mainnet', chainId: 1, usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'polygon', name: 'Polygon PoS', chainId: 137, usdc: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'arbitrum', name: 'Arbitrum One', chainId: 42161, usdc: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'optimism', name: 'Optimism Mainnet', chainId: 10, usdc: '0x0b2C639c533813f4Aa9D7837CAf62653d097F853', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'celo', name: 'Celo Mainnet', chainId: 42220, usdc: '0xcebA2B2B97397262c03E3e226462C27909A6d75d', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'unichain', name: 'Unichain Mainnet', chainId: 130, usdc: '0x078D782b760474a361dDA0AF3839290b0EF57AD6', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'zksync', name: 'zkSync Era', chainId: 324, usdc: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'ink', name: 'Ink Network', chainId: 57073, usdc: 'Native USDC', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'sonic', name: 'Sonic (Bridged)', chainId: 146, usdc: '0x29219dd400f2Bf60E5a23d13Be72B486D4038894', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'hyperliquid', name: 'Hyperliquid L1', chainId: 999, usdc: 'Native USDC', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'hypervm', name: 'HyperVM L2', chainId: 998, usdc: 'Native USDC', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'monad', name: 'Monad Network', chainId: 10143, usdc: 'Native USDC', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' },
  { network: 'plasma', name: 'Plasma L2', chainId: 9999, usdc: 'Native USDC', payTo: '0x003cC678764C8143a4b92370acB40e3B41319016' }
];

const contractSolidity = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title X402PaymentGateway
 * @author AIFoundry.sh
 * @notice Universal Multi-Chain EVM Payment Gateway for x402 HTTP Micropayments
 * Beneficiary: 0x003cC678764C8143a4b92370acB40e3B41319016
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

interface IERC20Permit {
    function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external;
}

contract X402PaymentGateway {
    address public beneficiary;
    address public owner;
    mapping(bytes32 => bool) public usedNonces;

    event PaymentSettled(bytes32 indexed requestId, address indexed payer, address indexed token, uint256 amountUsd6, uint256 timestamp);

    constructor(address _beneficiary) {
        require(_beneficiary != address(0), "Invalid beneficiary");
        owner = msg.sender;
        beneficiary = _beneficiary; // Default: 0x003cC678764C8143a4b92370acB40e3B41319016
    }

    function payForCall(bytes32 requestId, address token, uint256 amount) external returns (bool) {
        require(!usedNonces[requestId], "Request already settled");
        usedNonces[requestId] = true;
        require(IERC20(token).transferFrom(msg.sender, beneficiary, amount), "Transfer failed");
        emit PaymentSettled(requestId, msg.sender, token, amount, block.timestamp);
        return true;
    }

    function payWithPermit(bytes32 requestId, address token, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external returns (bool) {
        require(!usedNonces[requestId], "Request already settled");
        usedNonces[requestId] = true;
        IERC20Permit(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
        require(IERC20(token).transferFrom(msg.sender, beneficiary, amount), "Transfer failed");
        emit PaymentSettled(requestId, msg.sender, token, amount, block.timestamp);
        return true;
    }
}`;

export function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'contract', 'arch', 'roles', 'business', 'llmstxt'
  const [notification, setNotification] = useState(null);

  // Simulator State
  const [selectedTool, setSelectedTool] = useState('openspec.plan');
  const [payMode, setPayMode] = useState('unpaid'); // 'unpaid' or 'paid'
  const [paymentTxHash, setPaymentTxHash] = useState('tx_0x9f8a32b...usdc_paid');
  const [customPrompt, setCustomPrompt] = useState('{\n  "goal": "Build an AI monetized image generator on Cloudflare Workers"\n}');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execResult, setExecResult] = useState(null);
  const [responseHeaders, setResponseHeaders] = useState(null);

  const showToast = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  const executeApiCall = async () => {
    setIsExecuting(true);
    setExecResult(null);
    setResponseHeaders(null);

    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (payMode === 'paid') {
        headers['x-payment-hash'] = paymentTxHash;
        headers['x-payment-network'] = 'base';
        headers['x-payment-amount'] = '0.05';
      }

      let parsedBody = {};
      try {
        parsedBody = JSON.parse(customPrompt);
      } catch (e) {
        parsedBody = { prompt: customPrompt };
      }

      const res = await fetch(`/v1/tools/${selectedTool}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(parsedBody)
      });

      const resHeaderMap = {};
      res.headers.forEach((val, key) => {
        resHeaderMap[key] = val;
      });
      setResponseHeaders(resHeaderMap);

      const json = await res.json();
      setExecResult({
        status: res.status,
        statusText: res.statusText,
        data: json
      });

      if (res.status === 402) {
        showToast('HTTP 402 Payment Required returned! Challenge generated.', 'warning');
      } else if (res.ok) {
        showToast('API call executed successfully! x402 payment validated.', 'success');
      }
    } catch (err) {
      setExecResult({
        status: 500,
        statusText: 'Client Error',
        data: { error: err.message }
      });
      showToast(`Request failed: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return h('div', { className: 'min-h-screen flex flex-col font-sans' },
    // Header
    h('header', { className: 'sticky top-0 z-50 glass-panel border-b border-indigo-500/20 px-4 lg:px-8 py-3' },
      h('div', { className: 'max-w-7xl mx-auto flex items-center justify-between' },
        h('div', { className: 'flex items-center gap-3' },
          h(CosmicLogo),
          h('div', null,
            h('div', { className: 'flex items-center gap-2' },
              h('span', { className: 'font-mono font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent' }, 'AIFoundry.sh'),
              h('span', { className: 'px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' }, 'x402 Gateway v1.0')
            ),
            h('p', { className: 'text-xs text-gray-400 font-mono hidden sm:block' }, 'Beneficiary: 0x003cC678764C8143a4b92370acB40e3B41319016')
          )
        ),

        // Navigation Tabs
        h('nav', { className: 'hidden md:flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-indigo-500/20' },
          [
            { id: 'simulator', label: 'API Simulator', icon: Play },
            { id: 'contract', label: 'USDC Contract & Vaults', icon: Coins },
            { id: 'arch', label: 'Architecture Plan', icon: Workflow },
            { id: 'roles', label: 'Team Roles', icon: Users },
            { id: 'business', label: 'Business Economics', icon: DollarSign },
            { id: 'llmstxt', label: 'llms.txt Machine Context', icon: FileText }
          ].map(tab =>
            h('button', {
              key: tab.id,
              onClick: () => setActiveTab(tab.id),
              className: `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-900'
              }`
            },
              h(tab.icon, { className: 'w-3.5 h-3.5' }),
              tab.label
            )
          )
        ),

        // Mobile Nav Trigger or Network Badge
        h('div', { className: 'flex items-center gap-2' },
          h('div', { className: 'flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono' },
            h('span', { className: 'w-2 h-2 rounded-full bg-emerald-400 animate-ping' }),
            'x402 Active'
          )
        )
      ),

      // Mobile Nav Row
      h('div', { className: 'flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none' },
        [
          { id: 'simulator', label: 'Simulator', icon: Play },
          { id: 'contract', label: 'USDC Vaults', icon: Coins },
          { id: 'arch', label: 'Architecture', icon: Workflow },
          { id: 'roles', label: 'Roles', icon: Users },
          { id: 'business', label: 'Economics', icon: DollarSign },
          { id: 'llmstxt', label: 'llms.txt', icon: FileText }
        ].map(tab =>
          h('button', {
            key: tab.id,
            onClick: () => setActiveTab(tab.id),
            className: `flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-400 bg-slate-900'
            }`
          },
            h(tab.icon, { className: 'w-3 h-3' }),
            tab.label
          )
        )
      )
    ),

    // Toast Notification
    notification && h('div', { className: 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl glass-panel-glow border border-cyan-400/40 text-sm font-medium shadow-2xl animate-bounce' },
      h(Sparkles, { className: 'w-5 h-5 text-cyan-400 shrink-0' }),
      h('span', { className: 'text-gray-200' }, notification.msg)
    ),

    // Main Content Body
    h('main', { className: 'flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-8' },

      // TAB 1: SIMULATOR
      activeTab === 'simulator' && h('div', { className: 'space-y-6' },
        h('div', { className: 'flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-indigo-500/30' },
          h('div', { className: 'space-y-1' },
            h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
              h(Terminal, { className: 'w-6 h-6 text-cyan-400' }),
              'x402 Micropayment Edge Simulator'
            ),
            h('p', { className: 'text-sm text-gray-400' }, 'Test x402 HTTP 402 challenge handling & automated zero-latency settlement across edge tool endpoints.')
          ),
          h('div', { className: 'flex items-center gap-3 bg-slate-950 p-1.5 rounded-xl border border-indigo-500/20' },
            h('button', {
              onClick: () => setPayMode('unpaid'),
              className: `px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${payMode === 'unpaid' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-gray-400 hover:text-white'}`
            }, 'Unpaid (Expect HTTP 402)'),
            h('button', {
              onClick: () => setPayMode('paid'),
              className: `px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${payMode === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-gray-400 hover:text-white'}`
            }, 'Paid (Simulate x-payment-hash)')
          )
        ),

        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
          // Tool Selector & Config
          h('div', { className: 'lg:col-span-5 space-y-4' },
            h('div', { className: 'p-5 rounded-xl glass-panel space-y-4' },
              h('h3', { className: 'text-sm font-semibold text-gray-300 uppercase tracking-wider font-mono' }, 'Select x402 Monetized Endpoint'),
              h('div', { className: 'space-y-2' },
                Object.entries(toolDetails).map(([key, info]) =>
                  h('div', {
                    key,
                    onClick: () => setSelectedTool(key),
                    className: `p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTool === key
                        ? 'bg-indigo-950/60 border-cyan-400/60 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/40'
                    }`
                  },
                    h('div', { className: 'flex items-center justify-between mb-1' },
                      h('span', { className: 'font-mono text-xs font-bold text-cyan-300' }, key),
                      h('span', { className: 'text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' }, info.price)
                    ),
                    h('p', { className: 'text-xs text-gray-300 font-medium' }, info.title),
                    h('p', { className: 'text-[11px] text-gray-400 mt-1 line-clamp-2' }, info.desc)
                  )
                )
              ),

              h('div', { className: 'space-y-2 pt-2 border-t border-slate-800' },
                h('label', { className: 'text-xs font-mono text-gray-400' }, 'JSON Request Body Prompt'),
                h('textarea', {
                  rows: 4,
                  value: customPrompt,
                  onChange: (e) => setCustomPrompt(e.target.value),
                  className: 'w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none'
                })
              ),

              h('button', {
                onClick: executeApiCall,
                disabled: isExecuting,
                className: 'w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2'
              },
                isExecuting ? h(RefreshCw, { className: 'w-4 h-4 animate-spin' }) : h(Play, { className: 'w-4 h-4' }),
                isExecuting ? 'Executing Request...' : `Send Request to /v1/tools/${selectedTool}`
              )
            )
          ),

          // Response & Headers Output
          h('div', { className: 'lg:col-span-7 space-y-4' },
            h('div', { className: 'p-5 rounded-xl glass-panel space-y-4 min-h-[420px] flex flex-col' },
              h('div', { className: 'flex items-center justify-between border-b border-slate-800 pb-3' },
                h('span', { className: 'text-sm font-semibold text-gray-300 font-mono flex items-center gap-2' },
                  h(Code2, { className: 'w-4 h-4 text-cyan-400' }),
                  'Response Inspector & Headers'
                ),
                execResult && h('div', { className: 'flex items-center gap-2' },
                  h('span', { className: `px-2.5 py-1 rounded-md text-xs font-mono font-bold ${execResult.status === 402 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}` },
                    `HTTP ${execResult.status} ${execResult.statusText}`
                  ),
                  h('button', {
                    onClick: () => copyToClipboard(JSON.stringify(execResult.data, null, 2), 'JSON Response'),
                    className: 'p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-gray-400 hover:text-white'
                  }, h(Copy, { className: 'w-3.5 h-3.5' }))
                )
              ),

              !execResult ? h('div', { className: 'flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500 space-y-2' },
                h(Compass, { className: 'w-10 h-10 text-indigo-500/40 animate-spin' }),
                h('p', { className: 'text-sm text-gray-400' }, 'Click "Send Request" to test x402 edge challenge resolution.'),
                h('p', { className: 'text-xs text-gray-600' }, 'Unpaid mode triggers standard HTTP 402 with L402 macaroon invoice.')
              ) : h('div', { className: 'space-y-4 flex-1' },

                // Headers Panel
                responseHeaders && h('div', { className: 'space-y-1.5' },
                  h('span', { className: 'text-[11px] font-mono uppercase tracking-wider text-gray-400' }, 'x402 Protocol Headers'),
                  h('div', { className: 'p-3 rounded-lg bg-slate-950 border border-indigo-500/20 font-mono text-xs text-indigo-300 space-y-1 overflow-x-auto' },
                    Object.entries(responseHeaders).map(([k, v]) =>
                      h('div', { key: k, className: 'flex items-start gap-2' },
                        h('span', { className: 'text-cyan-400 shrink-0' }, `${k}:`),
                        h('span', { className: 'text-gray-300 break-all' }, String(v))
                      )
                    )
                  )
                ),

                // JSON Body
                h('div', { className: 'space-y-1.5 flex-1' },
                  h('span', { className: 'text-[11px] font-mono uppercase tracking-wider text-gray-400' }, 'JSON Response Body'),
                  h('pre', { className: 'p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-80' },
                    JSON.stringify(execResult.data, null, 2)
                  )
                )
              )
            )
          )
        )
      ),

      // TAB 2: SMART CONTRACT & USDC VAULTS
      activeTab === 'contract' && h('div', { className: 'space-y-6' },
        h('div', { className: 'p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-2' },
          h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            h('div', null,
              h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
                h(Coins, { className: 'w-6 h-6 text-cyan-400' }),
                'Single Universal EVM USDC Gateway Contract'
              ),
              h('p', { className: 'text-sm text-gray-400 mt-1' }, 'Deploy once across Base, Ethereum, Polygon, Arbitrum, Optimism, Celo, Unichain & all EVM networks.')
            ),
            h('div', { className: 'px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-xs font-mono text-cyan-300' },
              'Beneficiary: 0x003cC678764C8143a4b92370acB40e3B41319016'
            )
          )
        ),

        h('div', { className: 'grid grid-cols-1 lg:grid-cols-12 gap-6' },
          // Contract Code
          h('div', { className: 'lg:col-span-6 space-y-4' },
            h('div', { className: 'p-5 rounded-xl glass-panel space-y-3' },
              h('div', { className: 'flex items-center justify-between' },
                h('span', { className: 'text-sm font-mono font-bold text-gray-300' }, 'X402PaymentGateway.sol'),
                h('button', {
                  onClick: () => copyToClipboard(contractSolidity, 'Solidity Contract Code'),
                  className: 'flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono'
                }, h(Copy, { className: 'w-3 h-3' }), 'Copy Contract')
              ),
              h('pre', { className: 'p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto max-h-96' }, contractSolidity)
            )
          ),

          // Network Matrix
          h('div', { className: 'lg:col-span-6 space-y-4' },
            h('div', { className: 'p-5 rounded-xl glass-panel space-y-4' },
              h('div', { className: 'flex items-center justify-between' },
                h('h3', { className: 'text-sm font-mono font-bold text-gray-200' }, 'Multi-Chain USDC Treasury Vaults'),
                h('span', { className: 'text-xs text-emerald-400 font-mono' }, '14 EVM Networks Active')
              ),
              h('p', { className: 'text-xs text-gray-400' }, 'All EVM networks transfer USDC directly to your primary beneficiary wallet address.'),
              h('div', { className: 'space-y-2 max-h-96 overflow-y-auto pr-1' },
                evmNetworks.map((net) =>
                  h('div', { key: net.network, className: 'p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between gap-3' },
                    h('div', null,
                      h('div', { className: 'flex items-center gap-2' },
                        h('span', { className: 'font-mono text-xs font-bold text-white' }, net.name),
                        h('span', { className: 'px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300' }, `Chain #${net.chainId}`)
                      ),
                      h('p', { className: 'text-[11px] font-mono text-gray-400 mt-0.5' }, `USDC: ${net.usdc}`)
                    ),
                    h('button', {
                      onClick: () => copyToClipboard(net.payTo, `${net.name} Wallet`),
                      className: 'p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 shrink-0'
                    }, h(Copy, { className: 'w-3.5 h-3.5' }))
                  )
                )
              )
            )
          )
        )
      ),

      // TAB 3: ARCHITECTURE PLAN
      activeTab === 'arch' && h('div', { className: 'space-y-6' },
        h('div', { className: 'p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-2' },
          h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
            h(Workflow, { className: 'w-6 h-6 text-cyan-400' }),
            'System Architecture & Multi-Agent Orchestration'
          ),
          h('p', { className: 'text-sm text-gray-400' }, 'Sub-20ms HTTP 402 payment validation pipeline with Cloudflare Worker isolates and token metering.')
        ),

        h('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
          [
            {
              title: '1. Request & Challenge',
              desc: 'Client sends API request to /v1/tools/*. Worker checks x-payment-hash. If missing, responds in <5ms with HTTP 402 + L402 invoice macaroon.',
              icon: Lock
            },
            {
              title: '2. Payment Verification',
              desc: 'Worker verifies EIP-712 permit or EVM transfer receipt against beneficiary 0x003cC678764C8143a4b92370acB40e3B41319016.',
              icon: ShieldCheck
            },
            {
              title: '3. Upstream Execution',
              desc: 'Worker routes request to DeepSeek R1, Kimi AST Reviewer, or Cloudflare Security Audit, returning clean output with token token-receipt header.',
              icon: Zap
            }
          ].map((card, i) =>
            h('div', { key: i, className: 'p-5 rounded-xl glass-panel space-y-3 border border-indigo-500/20' },
              h('div', { className: 'w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400' },
                h(card.icon, { className: 'w-5 h-5' })
              ),
              h('h3', { className: 'text-base font-bold text-white' }, card.title),
              h('p', { className: 'text-xs text-gray-400 leading-relaxed' }, card.desc)
            )
          )
        )
      ),

      // TAB 4: TEAM ROLES
      activeTab === 'roles' && h('div', { className: 'space-y-6' },
        h('div', { className: 'p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-2' },
          h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
            h(Users, { className: 'w-6 h-6 text-cyan-400' }),
            'Multi-Agent Technical & Business Roles'
          ),
          h('p', { className: 'text-sm text-gray-400' }, 'Autonomous agent personas executing specialized tasks in the x402 gateway matrix.')
        ),

        h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          [
            {
              role: 'DeepSeek R1 Architecture Lead',
              type: 'Autonomous Technical Lead',
              desc: 'Analyzes user prompts and outputs Fission AI OpenSpec software architecture plans.',
              price: '$0.05 USDC / spec'
            },
            {
              role: 'Alibaba Kimi AST Reviewer',
              type: 'Code Review Agent',
              desc: 'Performs token-metered AST reviews, vulnerability scanning, and diff generation.',
              price: '$0.05 USDC / review'
            },
            {
              role: 'Cloudflare Security Auditor',
              type: 'Infrastructure Auditor',
              desc: 'Scans Worker bindings, secret leakages, and x402 payment header configurations.',
              price: '$0.05 USDC / audit'
            },
            {
              role: 'OpenDesign DeepSeek UI Architect',
              type: 'Design System Agent',
              desc: 'Generates tailwind design tokens, SVG logo specs, and atomic UI component hierarchies.',
              price: '$0.05 USDC / design'
            }
          ].map((role, idx) =>
            h('div', { key: idx, className: 'p-5 rounded-xl glass-panel space-y-3 border border-slate-800' },
              h('div', { className: 'flex items-center justify-between' },
                h('span', { className: 'font-mono text-xs font-bold text-cyan-400' }, role.type),
                h('span', { className: 'px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono' }, role.price)
              ),
              h('h3', { className: 'text-lg font-bold text-white' }, role.role),
              h('p', { className: 'text-xs text-gray-400' }, role.desc)
            )
          )
        )
      ),

      // TAB 5: BUSINESS ECONOMICS
      activeTab === 'business' && h('div', { className: 'space-y-6' },
        h('div', { className: 'p-6 rounded-2xl glass-panel border border-indigo-500/30 space-y-2' },
          h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
            h(DollarSign, { className: 'w-6 h-6 text-cyan-400' }),
            'Unit Economics & Profit Margins'
          ),
          h('p', { className: 'text-sm text-gray-400' }, 'Flat $0.05 USDC fee structure with 92%+ gross margin across edge isolate tools.')
        ),

        h('div', { className: 'p-5 rounded-xl glass-panel overflow-x-auto' },
          h('table', { className: 'w-full text-left font-mono text-xs' },
            h('thead', { className: 'border-b border-slate-800 text-gray-400 uppercase text-[11px]' },
              h('tr', null,
                h('th', { className: 'p-3' }, 'Service Endpoint'),
                h('th', { className: 'p-3' }, 'Gateway Fee'),
                h('th', { className: 'p-3' }, 'Upstream COGS'),
                h('th', { className: 'p-3' }, 'Gross Profit'),
                h('th', { className: 'p-3' }, 'Margin')
              )
            ),
            h('tbody', { className: 'divide-y divide-slate-800/60 text-gray-300' },
              Object.entries(toolDetails).map(([key, info]) =>
                h('tr', { key },
                  h('td', { className: 'p-3 font-bold text-cyan-300' }, key),
                  h('td', { className: 'p-3 text-emerald-400 font-bold' }, '$0.050 USDC'),
                  h('td', { className: 'p-3 text-amber-300' }, '$0.003 USDC'),
                  h('td', { className: 'p-3 text-cyan-300' }, '$0.047 USDC'),
                  h('td', { className: 'p-3 text-emerald-400 font-bold' }, '94.0%')
                )
              )
            )
          )
        )
      ),

      // TAB 6: LLMS.TXT MACHINE CONTEXT
      activeTab === 'llmstxt' && h('div', { className: 'space-y-6' },
        h('div', { className: 'p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-2' },
          h('div', { className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4' },
            h('div', null,
              h('h2', { className: 'text-2xl font-bold text-white flex items-center gap-2' },
                h(FileText, { className: 'w-6 h-6 text-cyan-400' }),
                'Machine-Readable llms.txt Context'
              ),
              h('p', { className: 'text-sm text-gray-400 mt-1' }, 'Exposed at /llms.txt for autonomous LLM agents and crawlers.')
            ),
            h('a', {
              href: '/llms.txt',
              target: '_blank',
              className: 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono hover:bg-cyan-500/30'
            },
              'Open /llms.txt',
              h(ExternalLink, { className: 'w-3.5 h-3.5' })
            )
          )
        ),

        h('div', { className: 'p-5 rounded-xl glass-panel space-y-3' },
          h('pre', { className: 'p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto max-h-[500px]' },
            `# AIFoundry.sh - x402 Monetized Edge Gateway & Security Agent
> Universal HTTP 402 payment gateway and multi-agent AI tool suite built on Cloudflare Workers.

## Primary Beneficiary Treasury Address
- EVM Primary Beneficiary Address (Base, Ethereum, Polygon, Arbitrum, Optimism, Celo, Unichain, zkSync, Ink, Sonic, Hyperliquid, HyperVM, Monad, Plasma): 0x003cC678764C8143a4b92370acB40e3B41319016

## Available Monetized API Endpoints ($0.05 USDC / call)
1. POST /v1/tools/openspec.plan - OpenSpec Software Architecture & Multi-Agent Plan Generator
2. POST /v1/tools/review.kimi - Alibaba Open Code Review Engine with AST Vulnerability Analysis
3. POST /v1/tools/audit.cf - Cloudflare Workers Security Audit Skill
4. POST /v1/tools/crypto.vault - Zero-Knowledge Hardware Isolate Vault Guard
5. POST /v1/tools/design.402 - OpenDesign DeepSeek UI Component & Logo Spec Generator
6. POST /v1/tools/nemotron.chat - Direct Edge Worker LLM Inference Proxy

## Payment Settlement Headers
- Payment Challenge Response: HTTP 402 Payment Required
- Header: WWW-Authenticate: L402 invoice="...", macaroon="..."
- Settlement Header: x-payment-hash: <tx_hash>`
          )
        )
      )
    ),

    // Footer
    h('footer', { className: 'mt-auto border-t border-slate-800/80 py-6 px-4 lg:px-8 bg-slate-950 text-xs text-gray-500 font-mono' },
      h('div', { className: 'max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4' },
        h('div', { className: 'flex items-center gap-2' },
          h('span', { className: 'text-gray-400 font-bold' }, 'AIFoundry.sh x402 Gateway'),
          h('span', null, '•'),
          h('span', null, 'Powered by Cloudflare Workers & x402 Protocol')
        ),
        h('div', { className: 'text-gray-400 text-center sm:text-right' },
          'USDC Beneficiary: 0x003cC678764C8143a4b92370acB40e3B41319016'
        )
      )
    )
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(h(App));
}
