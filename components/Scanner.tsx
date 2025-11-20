
import React, { useEffect, useRef } from 'react';
import { Play, Square, Terminal, Globe, Activity, Server, ShieldAlert, Download, Wifi } from 'lucide-react';
import { LogEntry, ScanResults } from '../types';

interface ScannerProps {
  isScanning: boolean;
  progress: number;
  logs: LogEntry[];
  results: ScanResults;
  onStartScan: (target: string) => void;
  onStopScan: () => void;
}

export const Scanner: React.FC<ScannerProps> = ({ isScanning, progress, logs, results, onStartScan, onStopScan }) => {
  const [target, setTarget] = React.useState('https://');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isScanning && target) {
      onStartScan(target);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recon & Scanning Engine</h1>
            <p className="text-slate-500 mt-1">Automated distributed reconnaissance and vulnerability assessment.</p>
          </div>
          {progress === 100 && (
              <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm shadow-sm">
                  <Download size={16} className="mr-2" />
                  Export Report
              </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Asset</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={isScanning && progress < 100}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm text-slate-700"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          {/* Config Options */}
          <div className="flex gap-4 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100 h-[48px] items-center hidden lg:flex">
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-600">Full Recon</span>
             </label>
             <div className="w-px h-4 bg-slate-300"></div>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-600">Port Scan</span>
             </label>
             <div className="w-px h-4 bg-slate-300"></div>
             <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 h-4 w-4 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-600">Vuln Scan</span>
             </label>
          </div>

          <button 
            type="submit"
            disabled={isScanning && progress < 100}
            onClick={isScanning && progress < 100 ? onStopScan : undefined}
            className={`px-6 py-3 rounded-lg font-bold text-white flex items-center transition-all shadow-lg ${
              isScanning && progress < 100
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isScanning && progress < 100 ? (
              <>
                <Square size={18} className="mr-2 fill-current" /> Stop
              </>
            ) : (
              <>
                <Play size={18} className="mr-2 fill-current" /> Start Scan
              </>
            )}
          </button>
        </form>
      </div>

      {/* Progress Section */}
      {isScanning && (
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 flex-shrink-0 transition-all">
           <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700 flex items-center">
                <Activity size={16} className={`mr-2 ${progress < 100 ? 'animate-pulse text-blue-600' : 'text-green-500'}`} />
                {progress < 100 ? 'Scan in Progress...' : 'Scan Completed Successfully'}
              </span>
              <span className="text-sm font-mono text-slate-500">{progress}%</span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{ width: `${progress}%` }}
              ></div>
           </div>
        </div>
      )}

      {/* Split View: Terminal & Findings */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        
        {/* Terminal Output */}
        <div className="flex-2 lg:w-2/3 bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-slate-400" />
                <span className="text-xs font-mono text-slate-400">live_execution_log.txt</span>
            </div>
            <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                <div className="w-3 h-3 rounded-full bg-slate-600"></div>
            </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {logs.length === 0 && (
                <div className="text-slate-500 italic text-center mt-10 flex flex-col items-center">
                    <Globe size={48} className="mb-4 opacity-20" />
                    Ready to initialize scan sequence.
                </div>
            )}
            {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 animate-in fade-in slide-in-from-left-2 duration-200">
                <span className="text-slate-500 shrink-0 w-20">[{log.timestamp}]</span>
                <span className={`break-all ${
                    log.type === 'error' ? 'text-red-400 font-bold' : 
                    log.type === 'warning' ? 'text-orange-400' : 
                    log.type === 'success' ? 'text-green-400 font-bold' : 
                    log.type === 'scan' ? 'text-blue-400' : 
                    'text-slate-300'
                }`}>
                    <span className="opacity-50 mr-2 text-xs uppercase tracking-wider">[{log.source || 'SYS'}]</span>
                    {log.type === 'error' && '✖ '}
                    {log.type === 'warning' && '! '}
                    {log.type === 'success' && '✔ '}
                    {log.message}
                </span>
                </div>
            ))}
            <div ref={logsEndRef} />
            </div>
        </div>

        {/* Live Findings Panel */}
        <div className="flex-1 lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subdomains</div>
                    <div className="text-2xl font-bold text-slate-900">{results.subdomains.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Open Ports</div>
                    <div className="text-2xl font-bold text-slate-900">{results.ports.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vulns Found</div>
                    <div className={`text-2xl font-bold ${results.vulnsFound > 0 ? 'text-red-500' : 'text-slate-900'}`}>{results.vulnsFound}</div>
                </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Files</div>
                    <div className="text-2xl font-bold text-slate-900">{results.paths.length}</div>
                </div>
            </div>

            {/* Discovered Lists */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-sm flex items-center">
                    <Server size={14} className="mr-2 text-blue-500" /> Live Findings
                </div>
                <div className="p-0 overflow-y-auto flex-1 scrollbar-thin">
                    {results.subdomains.length === 0 && results.ports.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            Waiting for data...
                        </div>
                    )}
                    
                    {results.subdomains.length > 0 && (
                        <div className="px-4 py-2">
                            <div className="text-xs font-semibold text-slate-400 uppercase mb-2 mt-2">Subdomains</div>
                            {results.subdomains.map((sub, i) => (
                                <div key={i} className="text-sm text-slate-700 py-1 flex items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                    {sub}
                                </div>
                            ))}
                        </div>
                    )}

                    {results.ports.length > 0 && (
                         <div className="px-4 py-2">
                            <div className="text-xs font-semibold text-slate-400 uppercase mb-2 mt-2">Open Ports</div>
                            <div className="flex flex-wrap gap-2">
                                {results.ports.map((port, i) => (
                                    <span key={i} className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                                        {port}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                     {results.paths.length > 0 && (
                         <div className="px-4 py-2">
                            <div className="text-xs font-semibold text-slate-400 uppercase mb-2 mt-2">Interesting Paths</div>
                            {results.paths.map((path, i) => (
                                <div key={i} className="text-xs text-slate-600 py-1 font-mono truncate">
                                    {path}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
