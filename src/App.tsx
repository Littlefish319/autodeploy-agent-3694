import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Rocket, 
  Cpu, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Play, 
  Command, 
  Shield,
  GitBranch,
  Server
} from 'lucide-react';

// Types for our simulated system
type LogLevel = 'info' | 'success' | 'error' | 'warning';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
}

interface AgentStatus {
  state: 'idle' | 'analyzing' | 'building' | 'deploying' | 'error';
  currentTask: string;
  progress: number;
}

export default function App() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AgentStatus>({
    state: 'idle',
    currentTask: 'Waiting for command...',
    progress: 0
  });
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (message: string, level: LogLevel = 'info') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: timeString,
      message,
      level
    }]);
  };

  // Simulate the AI Agent processing a command
  const processCommand = async (cmd: string) => {
    addLog(`> ${cmd}`, 'info');
    setInput('');

    if (status.state !== 'idle') {
      addLog('Agent is busy. Please wait.', 'warning');
      return;
    }

    if (cmd.trim().toLowerCase() === 'help') {
      addLog('Available commands: deploy, status, clear, analyze', 'info');
      return;
    }

    if (cmd.trim().toLowerCase() === 'clear') {
      setLogs([]);
      return;
    }

    if (cmd.trim().toLowerCase().includes('deploy')) {
      await runDeploymentSimulation();
    } else {
      addLog(`Command not recognized: ${cmd}`, 'error');
    }
  };

  const runDeploymentSimulation = async () => {
    setStatus({ state: 'analyzing', currentTask: 'Analyzing repository structure...', progress: 10 });
    addLog('Initiating deployment sequence...', 'info');
    
    await new Promise(r => setTimeout(r, 1500));
    addLog('Repository analysis complete. Detected React/Vite project.', 'success');
    
    setStatus({ state: 'building', currentTask: 'Running build scripts...', progress: 40 });
    addLog('Executing: npm run build', 'info');
    
    await new Promise(r => setTimeout(r, 2000));
    addLog('Build successful. Output directory: /dist', 'success');
    
    setStatus({ state: 'deploying', currentTask: 'Uploading assets to edge...', progress: 75 });
    addLog('Optimizing assets for edge distribution...', 'info');
    
    await new Promise(r => setTimeout(r, 1500));
    addLog('Verifying integrity...', 'info');
    
    setStatus({ state: 'idle', currentTask: 'Deployment Complete', progress: 100 });
    addLog('Deployment successful! URL: https://autodeploy-agent.vercel.app', 'success');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input) {
      processCommand(input);
    }
  };

  return (
    <div className="min-h-screen bg-deploy-dark text-gray-300 font-sans selection:bg-deploy-accent selection:text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-deploy-card border-r border-deploy-border flex flex-col">
        <div className="p-6 border-b border-deploy-border">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Cpu className="text-deploy-accent" />
            <span>AutoDeploy</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono">v1.0.0-beta</div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-deploy-border/30 text-white rounded-lg cursor-pointer border border-deploy-accent/20">
            <Terminal size={18} />
            <span className="text-sm font-medium">Console</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-deploy-border/20 rounded-lg cursor-pointer transition-colors">
            <Activity size={18} />
            <span className="text-sm font-medium">Activity</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-deploy-border/20 rounded-lg cursor-pointer transition-colors">
            <Server size={18} />
            <span className="text-sm font-medium">Resources</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-deploy-border/20 rounded-lg cursor-pointer transition-colors">
            <GitBranch size={18} />
            <span className="text-sm font-medium">Repository</span>
          </div>
        </nav>

        <div className="p-4 border-t border-deploy-border">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-deploy-success animate-pulse"></div>
            <span className="text-xs font-mono text-gray-400">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 border-b border-deploy-border flex items-center justify-between px-6 bg-deploy-dark/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Shield size={16} />
              <span>Secure Connection</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => processCommand('deploy')}
              disabled={status.state !== 'idle'}
              className="flex items-center gap-2 bg-deploy-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition-all"
            >
              <Rocket size={16} />
              Deploy Now
            </button>
          </div>
        </header>

        {/* Status Bar */}
        <div className="bg-deploy-card border-b border-deploy-border px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Current Status</span>
            <span className="text-xs font-mono text-deploy-accent">{status.state.toUpperCase()}</span>
          </div>
          <div className="w-full bg-deploy-border rounded-full h-2 overflow-hidden">
            <div 
              className="bg-deploy-accent h-full transition-all duration-500 ease-out"
              style={{ width: `${status.progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500 font-mono flex justify-between">
            <span>{status.currentTask}</span>
            <span>{status.progress}%</span>
          </div>
        </div>

        {/* Terminal Area */}
        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="flex-1 bg-deploy-card border border-deploy-border rounded-lg overflow-hidden flex flex-col shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-deploy-border/50 px-4 py-2 flex items-center gap-2 border-b border-deploy-border">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              <span className="ml-2 text-xs text-gray-500 font-mono">agent-cli — -zsh — 80x24</span>
            </div>

            {/* Logs */}
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto space-y-2">
              <div className="text-gray-500">AutoDeploy Agent v1.0.0 initialized...</div>
              <div className="text-gray-500">Type 'help' for available commands.</div>
              
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                  <span className={`
                    ${log.level === 'error' ? 'text-red-400' : ''}
                    ${log.level === 'success' ? 'text-green-400' : ''}
                    ${log.level === 'warning' ? 'text-yellow-400' : ''}
                    ${log.level === 'info' ? 'text-gray-300' : ''}
                  `}>
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            {/* Input Line */}
            <div className="p-4 border-t border-deploy-border bg-deploy-dark/30 flex items-center gap-2">
              <span className="text-deploy-accent font-bold">➜</span>
              <span className="text-cyan-400 font-bold">~</span>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder-gray-600"
                autoFocus
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}