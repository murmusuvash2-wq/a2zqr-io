import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Activity, MapPin, Smartphone, Chrome, ArrowUpRight, BarChart3, ScanLine, User } from 'lucide-react';

// Custom theme colors for Recharts
const COLORS = {
  primary: '#0EA5E9',
  primaryLight: '#38BDF8',
  secondary: '#8B5CF6',
  accent: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#F2F2FF',
  textMuted: '#8080A0',
  grid: '#28283E',
  bg: '#12121E'
};

// Generate 30 days of mock data
const generateMetricData = () => {
  const data = [];
  let baseScans = 120;
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    // Add some random noise and a slight trend
    baseScans += Math.floor(Math.random() * 40) - 15;
    if (baseScans < 20) baseScans = 20;

    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      scans: baseScans,
      unique: Math.floor(baseScans * 0.7)
    });
  }
  return data;
};

const scanData = generateMetricData();

const deviceData = [
  { name: 'iOS App / Safari', value: 4500, color: COLORS.primary },
  { name: 'Android Chrome', value: 3800, color: COLORS.accent },
  { name: 'Desktop Browser', value: 950, color: COLORS.warning },
  { name: 'Other', value: 300, color: COLORS.secondary },
];

const locationData = [
  { region: 'Mumbai', scans: 2450 },
  { region: 'Delhi', scans: 1980 },
  { region: 'Bangalore', scans: 1850 },
  { region: 'Pune', scans: 1200 },
  { region: 'Hyderabad', scans: 950 },
];

export default function Dashboard() {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is Pro
    const checkPro = () => {
      const pro = localStorage.getItem('isUserPremiumPro');
      if (pro === 'true') {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
      setLoading(false);
    };
    checkPro();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#040408] text-white">Loading...</div>;
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#040408] flex items-center justify-center p-6 font-['Syne',sans-serif]">
        <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-10 max-w-md text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] rounded-full flex items-center justify-center mx-auto mb-6">
            <ScanLine className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Pro Dashboard Locked</h2>
          <p className="text-[#8080A0] text-sm mb-8 leading-relaxed">
            Advanced analytics, real-time scan tracking, device fingerprints, and geolocation metrics are exclusively available in the Premium Pro plan.
          </p>
          <a href="/" className="inline-block w-full py-3 px-6 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
            Upgrade to Pro ₹149/mo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#040408] p-4 md:p-8 font-['Syne',sans-serif] text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1C1C2E] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold tracking-wider text-white bg-gradient-to-r from-[#F59E0B] to-[#EF4444] px-2 py-0.5 rounded">PRO LEVEL</span>
              <span className="text-[#8080A0] text-sm font-semibold">Active Subscription</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">QR Scan Analytics</h1>
            <p className="text-[#8080A0] text-sm mt-1">Real-time metrics for your dynamic QR campaigns over the last 30 days.</p>
          </div>
          <div className="flex bg-[#0A0A12] border border-[#1C1C2E] p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-[#1C1C2E] text-white">30 Days</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#8080A0] hover:text-white">90 Days</button>
            <button className="px-4 py-1.5 text-xs font-bold rounded-md text-[#8080A0] hover:text-white">1 Year</button>
          </div>
        </header>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Scans" value="24,592" trend="+14.2%" trendUp={true} icon={<Activity />} />
          <StatCard title="Unique Visitors" value="18,401" trend="+8.1%" trendUp={true} icon={<User />} />
          <StatCard title="Avg. Scans/Day" value="819.7" trend="-2.4%" trendUp={false} icon={<BarChart3 />} />
          <StatCard title="Top Location" value="Mumbai" desc="24% of total traffic" icon={<MapPin />} />
        </div>

        {/* Main Chart */}
        <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Scan Volume Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#0EA5E9]"></div><span className="text-xs text-[#8080A0]">Total Scans</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div><span className="text-xs text-[#8080A0]">Unique</span></div>
            </div>
          </div>
          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                <XAxis dataKey="date" stroke={COLORS.textMuted} fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke={COLORS.textMuted} fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="scans" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="unique" stroke={COLORS.secondary} strokeWidth={3} fillOpacity={1} fill="url(#colorUnique)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Device Operating Systems</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} content={(props) => {
                    const { payload } = props;
                    return (
                      <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {payload?.map((entry: any, index: number) => (
                          <div key={`item-${index}`} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-xs text-[#8080A0]">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Top Scan Locations</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
                  <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="region" stroke={COLORS.textMuted} fontSize={11} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="scans" fill={COLORS.accent} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ title, value, trend, trendUp, icon, desc }: any) {
  return (
    <div className="bg-[#0A0A12] border border-[#1C1C2E] rounded-2xl p-6 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className="text-[#8080A0]">{title}</div>
        <div className="p-2 bg-[#12121E] text-[#38BDF8] rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-extrabold text-white mb-1">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className={trendUp ? 'text-[#10B981]' : 'text-[#EF4444]'}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
            <span className="text-[#8080A0] font-normal">vs last month</span>
          </div>
        )}
        {desc && <div className="text-xs text-[#8080A0]">{desc}</div>}
      </div>
    </div>
  );
}

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#12121E] border border-[#28283E] p-3 rounded-lg shadow-xl text-sm font-['Syne']">
        {label && <div className="text-[#8080A0] font-semibold mb-2 pb-2 border-b border-[#28283E]">{label}</div>}
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-white capitalize">{entry.name}</span>
              </div>
              <span className="font-extrabold text-[#F2F2FF]">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
