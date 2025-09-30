import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showToolsList, setShowToolsList] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    const userMessage = {
      id: Date.now(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Simulating API call since axios isn't available
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const aiMessage = {
      //   id: Date.now() + 1,
      //   content: "I'm a demo response. In your actual implementation, this would come from your AI service at localhost:5002.",
      //   isUser: false,
      //   timestamp: new Date()
      // };
      const res=await axios.post('http://localhost:5002/ai',{prompt:message});
      const aiMessage = {
        id: Date.now() + 1,
        content: res.data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to AI service. Please make sure the server is running on localhost:5002');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSidebarNavigation = (item) => {
    if (item.key === 'analytics') {
      // Navigate to analytics route
      window.location.href = '/project/4';
      return;
    }
    
    if (item.key === 'tools') {
      setShowToolsList(!showToolsList);
      return;
    }
    
    setActiveSection(item.key);
    setShowToolsList(false);
  };

  const sidebarItems = [
    { key: 'chat', icon: '💬', label: 'Chat', active: activeSection === 'chat' },
    { key: 'analytics', icon: '📊', label: 'Analytics', active: false },
    { key: 'settings', icon: '⚙️', label: 'Settings', active: activeSection === 'settings' },
    { key: 'history', icon: '📚', label: 'History', active: activeSection === 'history' },
    { key: 'tools', icon: '🔧', label: 'Tools', active: showToolsList },
  ];

  const toolsList = [
    {
      category: 'Database MCP Server',
      tools: [
        { name: 'Create Table', icon: '📋', description: 'Create new database tables' },
        { name: 'Insert Data', icon: '➕', description: 'Insert records into tables' },
        { name: 'Update Records', icon: '✏️', description: 'Update existing records' },
        { name: 'Delete Records', icon: '🗑️', description: 'Remove records from tables' },
        { name: 'Query Builder', icon: '🔍', description: 'Build complex SQL queries' },
      ]
    },
    {
      category: 'Web Scraping',
      tools: [
        { name: 'Scrape Website', icon: '🌐', description: 'Extract data from web pages' },
        { name: 'Monitor Changes', icon: '👀', description: 'Track website changes' },
        { name: 'Bulk Scraper', icon: '📦', description: 'Scrape multiple URLs' },
      ]
    },
    {
      category: 'Query Execution',
      tools: [
        { name: 'Execute Query', icon: '⚡', description: 'Run custom SQL queries' },
        { name: 'Query History', icon: '📜', description: 'View past query executions' },
        { name: 'Performance Monitor', icon: '📈', description: 'Monitor query performance' },
      ]
    },
    {
      category: 'Utilities',
      tools: [
        { name: 'Data Export', icon: '📤', description: 'Export data to various formats' },
        { name: 'Schema Analyzer', icon: '🔬', description: 'Analyze database schema' },
        { name: 'API Tester', icon: '🧪', description: 'Test API endpoints' },
      ]
    }
  ];

  return (
   <>
    
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-900/95 backdrop-blur-sm border-r border-yellow-500/20 flex flex-col transition-all duration-300 relative`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-yellow-500/20">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AI</span>
                </div>
                <h1 className="font-semibold text-lg">Assistant</h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSidebarNavigation(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  item.active 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                {!sidebarCollapsed && item.key === 'tools' && (
                  <svg 
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${showToolsList ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* Tools List Dropdown */}
          {showToolsList && !sidebarCollapsed && (
            <div className="mt-3 space-y-4 max-h-96 overflow-y-auto">
              {toolsList.map((category, categoryIndex) => (
                <div key={categoryIndex} className="ml-4">
                  <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2 px-2">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.tools.map((tool, toolIndex) => (
                      <button
                        key={toolIndex}
                        className="w-full flex items-start gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-800/30 transition-colors group"
                        onClick={() => {
                          // Handle tool selection
                          console.log(`Selected tool: ${tool.name}`);
                          // You can add specific tool functionality here
                        }}
                      >
                        <span className="text-sm mt-0.5">{tool.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                            {tool.name}
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate">
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">User</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/80 backdrop-blur-sm border-b border-yellow-500/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">AI Chat Assistant</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-yellow-400">Active</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.isUser ? 'flex-row-reverse' : ''} group`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                    message.isUser
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black'
                      : 'bg-gradient-to-br from-gray-700 to-gray-600 text-white border border-gray-600'
                  }`}
                >
                  {message.isUser ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="font-bold">AI</span>
                  )}
                </div>

                {/* Message Content */}
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`p-4 rounded-2xl backdrop-blur-sm transition-all duration-200 ${
                      message.isUser
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/20'
                        : 'bg-gray-800/80 text-gray-100 border border-gray-700/50 shadow-lg shadow-black/20'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <div
                    className={`text-xs mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      message.isUser ? 'text-right text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center border border-gray-600">
                  <span className="font-bold text-sm text-white">AI</span>
                </div>
                <div className="bg-gray-800/80 border border-gray-700/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg shadow-black/20">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">Thinking</span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-950/80 backdrop-blur-sm border border-red-800/50 text-red-200 p-4 rounded-2xl shadow-lg shadow-red-900/20">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-medium">Connection Error</p>
                    <p className="text-red-300/80 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Container */}
        {activeSection === 'chat' && (
          <div className="bg-gray-900/80 backdrop-blur-sm border-t border-yellow-500/20 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex gap-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-5 py-4 pr-16 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 min-h-[56px] max-h-[120px]"
                    rows="1"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      ⏎ Send
                    </span>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-medium rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/30 disabled:shadow-none"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
   </>
  );
};

export default ChatInterface;