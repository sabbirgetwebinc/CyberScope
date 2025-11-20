
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Websites } from './components/Websites';
import { VulnerabilityList } from './components/VulnerabilityList';
import { VulnerabilityDetail } from './components/VulnerabilityDetail';
import { Scanner } from './components/Scanner';
import { Vulnerability, Scan, Website, Severity, LogEntry, ScanResults } from './types';
import { Bell, Search } from 'lucide-react';

// Mock Data
const INITIAL_VULNERABILITIES: Vulnerability[] = [
  {
    id: 'VUL-2024-001',
    title: 'SQL Injection in Login Form',
    description: 'The application login form is vulnerable to SQL injection, allowing an attacker to bypass authentication and access the database directly. Input fields are not properly sanitized.',
    severity: Severity.CRITICAL,
    owaspCategory: 'A1: Injection',
    status: 'Open',
    dateFound: '2024-06-15',
    affectedAsset: 'Customer Portal'
  },
  {
    id: 'VUL-2024-002',
    title: 'Reflected Cross-Site Scripting (XSS)',
    description: 'A reflected XSS vulnerability exists in the search functionality. User input is echoed back to the browser without proper encoding.',
    severity: Severity.HIGH,
    owaspCategory: 'A7: Cross-Site Scripting (XSS)',
    status: 'In Progress',
    dateFound: '2024-06-14',
    affectedAsset: 'Admin Dashboard'
  },
  {
    id: 'VUL-2024-003',
    title: 'Broken Access Control on API',
    description: 'Authenticated users with "Viewer" role can access "Admin" endpoints by manipulating the user ID in the API request URL.',
    severity: Severity.HIGH,
    owaspCategory: 'A1: Broken Access Control',
    status: 'Open',
    dateFound: '2024-06-10',
    affectedAsset: 'API Gateway'
  },
];

const MOCK_SCANS: Scan[] = [
  { id: 'SC-101', name: 'Weekly Full Scan', date: '2 hours ago', duration: '45m', status: 'Completed', vulnerabilitiesFound: 12 },
  { id: 'SC-102', name: 'API Security Check', date: 'Yesterday', duration: '12m', status: 'Completed', vulnerabilitiesFound: 0 },
  { id: 'SC-103', name: 'Production Deployment', date: '3 days ago', duration: '58m', status: 'Failed', vulnerabilitiesFound: 0 },
];

const MOCK_WEBSITES: Website[] = [
  { id: 'W-01', name: 'Customer Portal', url: 'https://portal.cyberscope.io', lastScan: 'Today, 10:00 AM', status: 'Active', riskScore: 85 },
  { id: 'W-02', name: 'Marketing Website', url: 'https://www.cyberscope.io', lastScan: 'Yesterday', status: 'Active', riskScore: 24 },
  { id: 'W-03', name: 'Internal Admin', url: 'https://admin.internal', lastScan: '3 days ago', status: 'Inactive', riskScore: 10 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedVulnId, setSelectedVulnId] = useState<string | null>(null);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);
  
  // Scanning State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<LogEntry[]>([]);
  const [scanResults, setScanResults] = useState<ScanResults>({ subdomains: [], ports: [], vulnsFound: 0, paths: [] });
  
  const scanInterval = useRef<any>(null);

  const addLog = (message: string, type: LogEntry['type'] = 'info', source: string = 'Scanner') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      source
    };
    setScanLogs(prev => [...prev, newLog]);
  };

  const startScan = (target: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    setScanResults({ subdomains: [], ports: [], vulnsFound: 0, paths: [] });
    setCurrentView('scanner');
    
    const domain = target.replace('https://', '').replace('http://', '').split('/')[0];

    addLog(`Initializing Distributed Scan for target: ${target}`, 'info', 'Orchestrator');
    addLog('Allocating scanner nodes...', 'info', 'System');

    let progress = 0;
    // Simulation Steps
    const steps = [
      { p: 5, action: () => addLog(`Target resolved to 104.21.55.${Math.floor(Math.random() * 255)}`, 'success', 'DNS_Resolver') },
      { p: 10, action: () => addLog('Starting Passive Reconnaissance (OSINT)...', 'info', 'Recon_Module') },
      { p: 15, action: () => {
          addLog(`Found subdomain: api.${domain}`, 'warning', 'Sublist3r');
          setScanResults(prev => ({ ...prev, subdomains: [...prev.subdomains, `api.${domain}`] }));
      }},
      { p: 20, action: () => {
          addLog(`Found subdomain: dev.${domain}`, 'warning', 'Sublist3r');
          setScanResults(prev => ({ ...prev, subdomains: [...prev.subdomains, `dev.${domain}`] }));
      }},
      { p: 25, action: () => addLog('Whois lookup completed. Registrar: NameCheap Inc.', 'info', 'Whois') },
      { p: 30, action: () => addLog('Starting Active Port Scan (TCP/UDP)...', 'info', 'Nmap_Cluster') },
      { p: 35, action: () => {
          addLog('Port 80/tcp open (http)', 'success', 'Nmap');
          setScanResults(prev => ({ ...prev, ports: [...prev.ports, '80 (HTTP)'] }));
      }},
      { p: 38, action: () => {
          addLog('Port 443/tcp open (https)', 'success', 'Nmap');
          setScanResults(prev => ({ ...prev, ports: [...prev.ports, '443 (HTTPS)'] }));
      }},
      { p: 42, action: () => {
          addLog('Port 22/tcp filtered (ssh)', 'warning', 'Nmap');
      }},
      { p: 45, action: () => {
          addLog('Port 8080/tcp open (http-proxy)', 'warning', 'Nmap');
          setScanResults(prev => ({ ...prev, ports: [...prev.ports, '8080 (ALT-HTTP)'] }));
      }},
      { p: 50, action: () => addLog('Starting Directory Fuzzing & Crawling...', 'info', 'Gobuster') },
      { p: 55, action: () => {
          addLog('Found path: /admin/login (Status: 200)', 'warning', 'Gobuster');
          setScanResults(prev => ({ ...prev, paths: [...prev.paths, '/admin/login'] }));
      }},
      { p: 60, action: () => {
          addLog('Found path: /config.json (Status: 200)', 'error', 'Gobuster');
          setScanResults(prev => ({ ...prev, paths: [...prev.paths, '/config.json'] }));
      }},
      { p: 65, action: () => addLog('Found path: /.git/HEAD (Status: 403)', 'info', 'Gobuster') },
      { p: 70, action: () => addLog('Initiating Vulnerability Scanners (Nikto, OWASP ZAP)...', 'info', 'Vuln_Engine') },
      { p: 75, action: () => addLog('Testing for SQL Injection on parameter ?id=', 'scan', 'SQLMap') },
      { p: 80, action: () => addLog('Testing for Reflected XSS on search endpoint', 'scan', 'XSS_Hunter') },
      { p: 85, action: () => {
          addLog('VULNERABILITY CONFIRMED: Reflected XSS on /search', 'error', 'XSS_Hunter');
          setScanResults(prev => ({ ...prev, vulnsFound: prev.vulnsFound + 1 }));
      }},
      { p: 90, action: () => addLog('Checking SSL/TLS configuration...', 'info', 'SSL_Labs') },
      { p: 95, action: () => addLog('Generating Final Report...', 'info', 'Reporter') },
      { p: 100, action: () => addLog('Scan Completed. Report generated.', 'success', 'System') },
    ];

    let stepIndex = 0;

    scanInterval.current = setInterval(() => {
      progress += 0.5; // Slower, smoother progress
      setScanProgress(Math.floor(progress));

      // Find and execute steps
      const currentStep = steps.find(s => s.p === Math.floor(progress));
      if (currentStep && progress % 1 === 0) {
         // Ensure we only run once per integer
         const executedSteps = steps.filter(s => s.p < progress).length;
         if (executedSteps >= stepIndex) {
             currentStep.action();
             stepIndex++;
         }
      }

      // Random noise
      if (Math.random() > 0.92 && progress < 95) {
        const noiseLogs = [
          `[${Math.floor(Math.random()*1000)}ms] GET /api/v1/ping`,
          'Analysing response headers...',
          'Fuzzing User-Agent...',
          'Testing payload: <script>alert(1)</script>',
          'Checking CORS policy...',
          'Validating API Key format...',
        ];
        addLog(noiseLogs[Math.floor(Math.random() * noiseLogs.length)], 'scan', 'Worker_Node');
      }

      if (progress >= 100) {
        clearInterval(scanInterval.current);
        // Keep isScanning true to show results state
        
        // Add simulated vuln to main list
        const newVuln: Vulnerability = {
          id: `VUL-${Math.floor(Math.random() * 10000)}`,
          title: 'Reflected XSS in Search Bar',
          description: 'The search input parameter is not properly sanitized, allowing execution of arbitrary JavaScript.',
          severity: Severity.MEDIUM,
          owaspCategory: 'A7: Cross-Site Scripting',
          status: 'Open',
          dateFound: new Date().toISOString().split('T')[0],
          affectedAsset: target
        };
        setVulnerabilities(prev => [newVuln, ...prev]);
      }
    }, 50); 
  };

  const stopScan = () => {
    if (scanInterval.current) clearInterval(scanInterval.current);
    setIsScanning(false);
    addLog('Scan process terminated by user.', 'error', 'System');
  };

  const handleViewVulnerability = (id: string) => {
    setSelectedVulnId(id);
    setCurrentView('vulnerability-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard vulnerabilities={vulnerabilities} scans={MOCK_SCANS} logs={scanLogs} onViewVulnerability={handleViewVulnerability} />;
      case 'scanner':
        return (
            <Scanner 
                isScanning={isScanning} 
                progress={scanProgress} 
                logs={scanLogs} 
                results={scanResults}
                onStartScan={startScan} 
                onStopScan={stopScan} 
            />
        );
      case 'websites':
        return <Websites websites={MOCK_WEBSITES} onScan={startScan} />;
      case 'vulnerabilities':
        return <VulnerabilityList vulnerabilities={vulnerabilities} onSelect={handleViewVulnerability} />;
      case 'vulnerability-detail':
        const vuln = vulnerabilities.find(v => v.id === selectedVulnId);
        return vuln ? (
            <VulnerabilityDetail 
                vulnerability={vuln} 
                onBack={() => setCurrentView('vulnerabilities')} 
            />
        ) : <div className="text-center py-20 text-slate-500">Vulnerability not found</div>;
      case 'settings':
          return <div className="text-center py-20 text-slate-500">Settings Panel (Coming Soon)</div>;
      case 'reports':
          return <div className="text-center py-20 text-slate-500">Reports Archive (Coming Soon)</div>;
      case 'collaborators':
          return <div className="text-center py-20 text-slate-500">Collaborators Management (Coming Soon)</div>;
      default:
        return <Dashboard vulnerabilities={vulnerabilities} scans={MOCK_SCANS} logs={scanLogs} onViewVulnerability={handleViewVulnerability} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentView={currentView === 'vulnerability-detail' ? 'vulnerabilities' : currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-96">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search assets, scans, or vulnerabilities..." 
              className="ml-3 outline-none text-sm w-full bg-transparent text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center space-x-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              {vulnerabilities.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-700">Alex Chen</p>
                  <p className="text-xs text-slate-500">Security Lead</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                   AC
               </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
