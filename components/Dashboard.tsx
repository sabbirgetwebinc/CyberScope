
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, Shield, Activity, CheckCircle, ArrowUpRight, Terminal, Server, Database, Cloud } from 'lucide-react';
import { Vulnerability, Severity, Scan, LogEntry } from '../types';

interface DashboardProps {
  vulnerabilities: Vulnerability[];
  scans: Scan[];
  logs: LogEntry[];
  onViewVulnerability: (id: string) => void;
}

const COLORS = {
  Critical: '#ef4444', // red-500
  High: '#f97316', // orange-500
  Medium: '#3b82f6', // blue-500
  Low: '#10b981', // green-500
};

export const Dashboard: React.FC<DashboardProps> = ({ vulnerabilities, scans, logs, onViewVulnerability }) => {
  
  // Calculate Stats
  const criticalCount = vulnerabilities.filter(v => v.severity === Severity.CRITICAL).length;
  const highCount = vulnerabilities.filter(v => v.severity === Severity.HIGH).length;
  const mediumCount = vulnerabilities.filter(v => v.severity === Severity.MEDIUM).length;
  const lowCount = vulnerabilities.filter(v => v.severity === Severity.LOW).length;

  const chartData = [
    { name: 'A1: Injection', count: 8, severity: 'Critical' },
    { name: 'A2: Auth', count: 5, severity: 'High' },
    { name: 'A3: Data', count: 12, severity: 'Medium' },
    { name: 'A7: XSS', count: 9, severity: 'Critical' },
    { name: 'A9: Logging', count: 3, severity: 'Low' },
  ];

  const StatCard = ({ title, count, icon: Icon, color, bg, trend }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={color} size={24} />
        </div>
        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} className="mr-1" /> {trend}%
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-slate-900">{count}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your current security posture and active threats.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Critical Vulnerabilities" 
          count={criticalCount} 
          icon={AlertTriangle} 
          color="text-red-600" 
          bg="bg-red-50"
          trend={12}
        />
        <StatCard 
          title="High Risk Issues" 
          count={highCount} 
          icon={Shield} 
          color="text-orange-600" 
          bg="bg-orange-50"
          trend={5}
        />
        <StatCard 
          title="Total Scans (Month)" 
          count={scans.length} 
          icon={Activity} 
          color="text-blue-600" 
          bg="bg-blue-50"
          trend={24}
        />
        <StatCard 
          title="Resolved Issues" 
          count={56} 
          icon={CheckCircle} 
          color="text-green-600" 
          bg="bg-green-50"
          trend={8}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Vulnerability Distribution (OWASP Top 10)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.severity === 'Critical' ? COLORS.Critical : entry.severity === 'High' ? COLORS.High : COLORS.Medium} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health & Architecture Status */}
        <div className="flex flex-col gap-6">
             {/* Architecture Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">System Architecture</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-600 text-sm">
                            <Cloud size={16} className="mr-2 text-blue-500" /> Cloud Engine
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div> Online
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-600 text-sm">
                            <Server size={16} className="mr-2 text-purple-500" /> Scanner Nodes
                        </div>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div> 12 Active
                        </span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-600 text-sm">
                            <Database size={16} className="mr-2 text-orange-500" /> Vuln DB
                        </div>
                        <span className="text-xs text-slate-500">Updated 2m ago</span>
                    </div>
                </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col flex-1 min-h-[200px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Live Activity Feed</h2>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200 max-h-[250px]">
                {logs.length === 0 ? (
                <div className="text-center text-slate-400 text-sm mt-10">No active scans. System idle.</div>
                ) : (
                    logs.slice().reverse().map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 text-sm">
                        <div className="mt-0.5 shrink-0">
                        {log.type === 'error' ? <AlertTriangle size={14} className="text-red-500" /> :
                        log.type === 'warning' ? <AlertTriangle size={14} className="text-orange-500" /> :
                        log.type === 'success' ? <CheckCircle size={14} className="text-green-500" /> :
                        <Terminal size={14} className="text-blue-500" />}
                        </div>
                        <div>
                        <p className="text-slate-700 font-medium leading-tight">{log.message}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{log.timestamp} • {log.source || 'System'}</p>
                        </div>
                    </div>
                    ))
                )}
            </div>
            </div>
        </div>
      </div>

      {/* Recent Vulnerabilities Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Vulnerabilities</h2>
          <button className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors">
            Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vulnerability</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vulnerabilities.slice(0, 5).map((vuln) => (
                <tr key={vuln.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className={`mr-2 ${
                        vuln.severity === Severity.CRITICAL ? 'text-red-500' : 'text-orange-500'
                      }`} />
                      <span className="text-sm font-medium text-slate-900">{vuln.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      vuln.severity === Severity.CRITICAL ? 'bg-red-50 text-red-700 border-red-200' :
                      vuln.severity === Severity.HIGH ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {vuln.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {vuln.affectedAsset}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></div>
                      {vuln.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewVulnerability(vuln.id)}
                      className="text-blue-600 hover:text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
