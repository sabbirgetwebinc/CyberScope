import React from 'react';
import { Website } from '../types';
import { Globe, Plus, MoreVertical, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  websites: Website[];
  onScan?: (url: string) => void;
}

export const Websites: React.FC<Props> = ({ websites, onScan }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monitored Assets</h1>
          <p className="text-slate-500 mt-1">View and manage your web applications and scanning schedules.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
          <Plus size={18} className="mr-2" />
          Add New Asset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {websites.map((site) => (
          <div key={site.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-blue-300 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Globe size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={20} />
              </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{site.name}</h3>
            <a href={site.url} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-blue-600 flex items-center mb-6">
              {site.url} <ExternalLink size={12} className="ml-1" />
            </a>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Risk Score</span>
                <div className="flex items-center">
                   <span className={`text-xl font-bold ${site.riskScore > 80 ? 'text-red-600' : site.riskScore > 50 ? 'text-orange-600' : 'text-green-600'}`}>
                       {site.riskScore}
                   </span>
                   <span className="text-xs text-slate-400 ml-1">/ 100</span>
                </div>
              </div>
               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">Last Scan</span>
                <span className="text-sm font-medium text-slate-700">{site.lastScan}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
               <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                   site.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
               }`}>
                   <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                       site.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'
                   }`}></span>
                   {site.status}
               </span>
               <button 
                 onClick={() => onScan && onScan(site.url)}
                 className="text-sm font-medium text-blue-600 hover:text-blue-800"
               >
                   Scan Now
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};