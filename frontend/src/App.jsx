import React, { useState, useEffect } from 'react';
import { Database, Zap, Shield, BarChart3, Search, Bot, Code, Globe, Users, ChevronRight, Check, Play, Github, Twitter, ExternalLink, Copy, CheckCircle, Activity, Lock, Layers } from 'lucide-react';
import Navbar from './components/Navbar';
import { useNavigate } from 'react-router';
const App = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ requests: 0, success: 0, response: 0 });
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  }
  // Animated stats counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        requests: Math.min(prev.requests + 1, 847),
        success: Math.min(prev.success + 2, 100),
        response: Math.min(prev.response + 0.5, 32.56)
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExamples = {
    create: `{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "create",
  "payload": { 
    "data": { 
      "title": "New Project", 
      "description": "This is a new project" 
    } 
  },
  "tableName": "Project"
}`,
    read: `{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "read",
  "payload": { "id": 3 },
  "tableName": "Project"
}`,
    update: `{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "update",
  "payload": {
    "where": { "email": "test@example.com" },
    "data": { 
      "email": "updated@gmail.com", 
      "name": "Updated Name" 
    }
  },
  "tableName": "User"
}`,
    delete: `{
  "projectId": 4,
  "apiKey": "4148f85d8ae6a3914f",
  "operation": "delete",
  "payload": { 
    "where": { "id": 3 } 
  },
  "tableName": "Project"
}`
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Instant CRUD API",
      description: "Auto-generate RESTful APIs for all tables in seconds. No configuration needed.",
      color: "yellow",
      gradient: "from-yellow-500/20 to-yellow-600/20",
      border: "border-yellow-500/30",
      hoverBorder: "hover:border-yellow-400",
      shadow: "hover:shadow-yellow-500/20"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Real-time Dashboard",
      description: "Track usage, monitor performance, and view analytics live(Convex).",
      color: "blue",
      gradient: "from-blue-500/20 to-blue-600/20",
      border: "border-blue-500/30",
      hoverBorder: "hover:border-blue-400",
      shadow: "hover:shadow-blue-500/20"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Secure Authentication",
      description: "Built-in RBAC, API key management, and social logins(Better-Auth)",
      color: "green",
      gradient: "from-green-500/20 to-green-600/20",
      border: "border-green-500/30",
      hoverBorder: "hover:border-green-400",
      shadow: "hover:shadow-green-500/20"
    },
    {
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Rich developer experience ",
      description: "Auto-generated docs, Schema Visualizer, API explorers, and SDKs for popular languages.",
      color: "purple",
      gradient: "from-purple-500/20 to-purple-600/20",
      border: "border-purple-500/30",
      hoverBorder: "hover:border-purple-400",
      shadow: "hover:shadow-purple-500/20"
    },
    {
      icon: <Bot className="w-6 h-6 text-white" />,
      title: "AI-Powered Inkeep Agent",
      description: "Conversational AI powered by scrapped data(FireCrawler) and Database Query tools.",
      color: "pink",
      gradient: "from-pink-500/20 to-pink-600/20",
      border: "border-pink-500/30",
      hoverBorder: "hover:border-pink-400",
      shadow: "hover:shadow-pink-500/20"
    },
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      title: "Smart Security Alerts",
      description: "Get notified of suspicious activities and potential threats in real-time like ddos attacks(Resend)",
      color: "cyan",
      gradient: "from-cyan-500/20 to-cyan-600/20",
      border: "border-cyan-500/30",
      hoverBorder: "hover:border-cyan-400",
      shadow: "hover:shadow-cyan-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      {/* <nav className="border-b border-gray-800/30 backdrop-blur-sm bg-black/90 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-yellow-400/50 transition-all">
                <Database className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold text-white">
                Dbify
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#architecture" className="text-gray-400 hover:text-white transition-colors text-sm relative group">
                Architecture
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#docs" className="text-gray-400 hover:text-white transition-colors text-sm relative group">
                Docs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-5 py-2 rounded-lg transition-all text-sm font-medium shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav> */}
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-green-500/10 to-yellow-400/10 border border-green-500/20 rounded-full px-4 py-2 mb-8 hover:border-green-500/40 transition-all cursor-default group">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-sm text-gray-200 group-hover:text-white transition-colors">Turn any database into a REST API in seconds</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Your Database,
              <br />
              <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">Instant API</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Skip the boilerplate. Transform your database into a production-ready API 
              with real-time analytics and monitoring—all in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <button className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-8 py-3 rounded-lg text-base font-medium transition-all flex items-center justify-center shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105"
                onClick={() => handleNavigate('/login')}
              >
                Start Building
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border border-gray-700 hover:border-yellow-400 bg-gray-900/30 hover:bg-gray-900/50 px-8 py-3 rounded-lg text-base font-medium transition-all flex items-center justify-center hover:scale-105">
                <Play className="mr-2 w-4 h-4 group-hover:text-yellow-400 transition-colors" />
                View Demo
              </button>
            </div>

            {/* Live Stats Dashboard Preview */}
            <div className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-2xl p-8 max-w-5xl mx-auto shadow-2xl hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-medium text-gray-300">Project Dashboard</h3>
                <div className="flex items-center text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/50"></div>
                  Live
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 border border-blue-500/20 hover:border-blue-400/40 transition-all hover:shadow-lg hover:shadow-blue-500/10 group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Total Requests</span>
                    <Database className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-semibold text-white">{Math.floor(stats.requests)}</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-green-500/20 hover:border-green-400/40 transition-all hover:shadow-lg hover:shadow-green-500/10 group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Success Rate</span>
                    <CheckCircle className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-semibold text-green-400">{stats.success.toFixed(0)}%</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-red-500/20 hover:border-red-400/40 transition-all hover:shadow-lg hover:shadow-red-500/10 group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Failed</span>
                    <ExternalLink className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-semibold text-red-400">0</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-yellow-500/20 hover:border-yellow-400/40 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Avg Response</span>
                    <Zap className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl font-semibold text-yellow-400">{stats.response.toFixed(1)}ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to scale fast
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From instant API generation to enterprise-grade monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`group bg-gradient-to-br from-gray-950 to-gray-900 border ${feature.border} rounded-2xl p-6 ${feature.hoverBorder} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${feature.shadow} cursor-default`}
              >
                <div className={`mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-24 bg-gradient-to-b from-gray-950/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Built for Scale
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade architecture designed for performance and reliability
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">High-Level Flow</h3>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Connect Database",
                    description: "Provide DB connection → Server validates, returns apiKey & projectId, caches schema",
                    color: "blue"
                  },
                  {
                    step: "2",
                    title: "Auto-Sync Schema",
                    description: "Schema changes auto-update cache and notify users in real-time",
                    color: "green"
                  },
                  {
                    step: "3",
                    title: "Process Requests",
                    description: "Logs pushed to queue, processed by workers, stored for analytics",
                    color: "purple"
                  },
                  {
                    step: "4",
                    title: "Real-time Analytics",
                    description: "Dashboard shows live usage, performance metrics & schema events",
                    color: "yellow"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className={`w-10 h-10 bg-gradient-to-br from-${item.color}-400 to-${item.color}-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-${item.color}-500/30`}>
                      <span className="text-black font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-1 bg-gray-900/50 rounded-xl p-4 border border-gray-800 group-hover:border-gray-700 transition-all">
                      <h4 className="font-medium mb-1 group-hover:text-white transition-colors">{item.title}</h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Tech Stack</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Backend', value: 'Node.js / Express', icon: <Code className="w-4 h-4" /> },
                  { label: 'DB', value: 'Convex + PostgreSQL + ChromaDb', icon: <Database className="w-4 h-4" /> },
                  { label: 'Analytics', value: 'Convex', icon: <BarChart3 className="w-4 h-4" /> },
                  { label: 'Queue', value: 'RabbitMQ', icon: <Activity className="w-4 h-4" /> },
                  { label: 'Cache', value: 'Redis', icon: <Zap className="w-4 h-4" /> },
                  { label: 'Scrape Data', value: 'FireCrawl', icon: <Globe className="w-4 h-4" /> },
                  { label: 'Auth', value: 'Better-Auth', icon: <Lock className="w-4 h-4" /> },
                  { label: 'AI Agent', value: 'Inkeep + OpenAI', icon: <Bot className="w-4 h-4" /> }
                ].map((tech, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl p-4 hover:border-yellow-400/30 transition-all hover:shadow-lg hover:shadow-yellow-500/10 group cursor-default">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{tech.label}</div>
                      <div className="text-yellow-400 group-hover:scale-110 transition-transform">{tech.icon}</div>
                    </div>
                    <div className="text-sm font-medium group-hover:text-white transition-colors">{tech.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Examples */}
      <section id="docs" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Simple, powerful API calls
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Use familiar JSON syntax for all operations. No learning curve.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex space-x-2 border-b border-gray-800 bg-gray-900/30 rounded-t-xl p-1">
                {Object.keys(codeExamples).map((operation) => (
                  <button
                    key={operation}
                    onClick={() => setActiveTab(operation)}
                    className={`px-4 py-3 font-medium capitalize transition-all text-sm rounded-lg ${
                      activeTab === operation
                        ? 'text-white bg-yellow-400 text-black shadow-lg shadow-yellow-400/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {operation}
                  </button>
                ))}
              </div>
              
              <div className="bg-gradient-to-br from-gray-950 to-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl hover:border-gray-700 transition-all">
                <div className="flex items-center justify-between bg-gray-900 px-6 py-3 border-b border-gray-800">
                  <span className="text-xs text-gray-400">Request Payload</span>
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeTab])}
                    className={`flex items-center text-xs transition-all px-3 py-1 rounded-md ${
                      copied 
                        ? 'text-green-400 bg-green-400/10 border border-green-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="p-6 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">
                  <code>{codeExamples[activeTab]}</code>
                </pre>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all shadow-xl">
                <h3 className="text-xl font-bold mb-6">Quick Start</h3>
                <div className="space-y-5">
                  {[
                    {
                      step: "1",
                      title: "Connect Your Database",
                      description: "Provide your PostgreSQL or MongoDB connection string",
                      color: "blue"
                    },
                    {
                      step: "2",
                      title: "Get Your API Keys",
                      description: "Receive projectId and apiKey instantly",
                      color: "green"
                    },
                    {
                      step: "3",
                      title: "Start Making Requests",
                      description: "Use the generated endpoints immediately",
                      color: "yellow"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className={`w-8 h-8 bg-gradient-to-br from-${item.color}-400 to-${item.color}-500 rounded-lg flex items-center justify-center text-sm font-bold text-black flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-${item.color}-500/30`}>
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium mb-1 group-hover:text-white transition-colors">{item.title}</h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/5 to-yellow-500/5 border border-green-500/20 rounded-xl p-6 hover:border-green-500/30 transition-all">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-green-400/30">
                    <Check className="w-5 h-5 text-black" />
                  </div>
                  Zero Configuration
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  No server setup, no boilerplate code, no complex configurations. 
                  Just connect your database and start building immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From connection to production in three simple steps
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-blue-500/20 rounded-2xl p-8 h-full hover:border-blue-400/40 transition-all hover:shadow-2xl hover:shadow-blue-500/10 group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                  <Database className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">1. Connect</h3>
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                  Provide your database connection string. We support PostgreSQL and MongoDB with more coming soon.
                </p>
                <div className="bg-black border border-blue-500/20 rounded-lg p-4 font-mono text-xs text-blue-300 hover:border-blue-400/40 transition-colors">
                  postgres://user:pass@host:5432/db
                </div>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-green-500/20 rounded-2xl p-8 h-full hover:border-green-400/40 transition-all hover:shadow-2xl hover:shadow-green-500/10 group">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                  <Zap className="w-7 h-7 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">2. Generate</h3>
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                  We instantly analyze your schema and generate RESTful endpoints for all tables and operations.
                </p>
                <div className="space-y-2">
                  <div className="bg-black border border-green-500/20 rounded px-3 py-2 text-xs font-mono text-green-400 hover:border-green-400/40 transition-colors flex items-center">
                    <Check className="w-3 h-3 mr-2" />
                    API endpoints created
                  </div>
                  <div className="bg-black border border-green-500/20 rounded px-3 py-2 text-xs font-mono text-green-400 hover:border-green-400/40 transition-colors flex items-center">
                    <Check className="w-3 h-3 mr-2" />
                    Schema cached
                  </div>
                  <div className="bg-black border border-green-500/20 rounded px-3 py-2 text-xs font-mono text-green-400 hover:border-green-400/40 transition-colors flex items-center">
                    <Check className="w-3 h-3 mr-2" />
                    Keys generated
                  </div>
                </div>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-yellow-400"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-400/40 transition-all hover:shadow-2xl hover:shadow-yellow-500/10 group">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/30">
                <BarChart3 className="w-7 h-7 text-black" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">3. Monitor</h3>
              <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                Track every request in real-time. Monitor performance, detect issues, and optimize with live analytics.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black border border-green-500/20 rounded px-3 py-2 text-center hover:border-green-400/40 transition-colors">
                  <div className="text-lg font-bold text-green-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div className="bg-black border border-yellow-500/20 rounded px-3 py-2 text-center hover:border-yellow-400/40 transition-colors">
                  <div className="text-lg font-bold text-yellow-400">32ms</div>
                  <div className="text-xs text-gray-400">Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to build your next API?
          </h2>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who've accelerated their workflow with Dbify. 
            No credit card required to start.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 px-8 py-4 rounded-lg text-base font-medium transition-all flex items-center justify-center shadow-xl shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-105">
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border border-gray-700 hover:border-yellow-400 bg-gray-900/30 hover:bg-gray-900/50 px-8 py-4 rounded-lg text-base font-medium transition-all flex items-center justify-center hover:scale-105">
              <Github className="mr-2 w-5 h-5 group-hover:text-yellow-400 transition-colors" />
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gradient-to-b from-black to-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4 group cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-yellow-400/50 transition-all">
                  <Database className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-semibold text-white">
                  Dbify
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Turn any database into a production-ready API in seconds.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm text-white">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#architecture" className="hover:text-yellow-400 transition-colors">Architecture</a></li>
                <li><a href="#docs" className="hover:text-yellow-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm text-white">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-sm text-white">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors p-2 bg-gray-900 rounded-lg hover:bg-gray-800">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors p-2 bg-gray-900 rounded-lg hover:bg-gray-800">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-400">
            <p>&copy; 2024 Dbify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;