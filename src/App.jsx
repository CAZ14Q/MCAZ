import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, TrendingUp, DollarSign, Play, Square, MessageSquare,
  History, Cpu, Globe, Send, Bot, X, Instagram, Sparkles, PieChart, 
  BarChart3, Zap, ShieldCheck, Search, Bell, Wallet
} from 'lucide-react';

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(0.00);
  const [equityCurve, setEquityCurve] = useState([{ time: '00:00', value: 0 }]);
  const [cazInsight, setCazInsight] = useState({
    status: "WAITING",
    recommendation: "جاهز للبدء (Ready to Start)",
    confidence: 100,
    target: "---",
    logic: "المحفظة حالياً صفر. قم بتفعيل محرك الذكاء الاصطناعي لبدء تحليل الفرص المتاحة في السوق."
  });

  const marketAssets = [
    { id: 1, sym: 'BTC', price: '96,240', chg: '+3.2%', vol: '2.1B', trend: 'up' },
    { id: 2, sym: 'ETH', price: '2,640', chg: '+1.5%', vol: '800M', trend: 'up' },
    { id: 3, sym: 'SOL', price: '142.5', chg: '-0.8%', vol: '450M', trend: 'down' },
    { id: 4, sym: 'NVDA', price: '135.2', chg: '+4.1%', vol: '1.2B', trend: 'up' }
  ];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'مرحباً بك في CAZ. كيف يمكنني مساعدتك في تحليل السوق اليوم؟' }
  ]);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans p-4 md:p-8" dir="rtl">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-10 bg-[#0d121f] p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Zap className="text-blue-500" size={30} />
          <h1 className="text-2xl font-black text-white">CAZ <span className="text-blue-500">AI</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase">Wallet</p>
            <p className="text-sm font-bold text-white">${balance.toFixed(2)}</p>
          </div>
        </div>
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-8 bg-[#0d121f] border border-slate-800 rounded-[2.5rem] p-8">
          <div className="mb-6">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">تحليل النمو</span>
            <h2 className="text-3xl font-black text-white">$0.00</h2>
          </div>
          <div className="h-64 w-full flex items-center justify-center border-t border-slate-800/30">
            <p className="text-slate-600 italic">لا توجد بيانات تداول حالياً</p>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-[2.5rem] p-8">
            <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-4">
              <Sparkles size={18} /> رؤية الذكاء الاصطناعي
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">{cazInsight.logic}</p>
          </div>

          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`w-full py-5 rounded-2xl font-black text-sm transition-all ${isRunning ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'}`}
          >
            {isRunning ? 'إيقاف المحرك' : 'تشغيل محرك CAZ AI'}
          </button>
        </div>
      </main>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 left-8 p-6 bg-blue-600 rounded-full text-white shadow-2xl hover:scale-110 transition-all"
      >
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-28 left-8 w-80 h-96 bg-[#0d121f] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-600 text-white font-bold text-sm">CAZ Assistant</div>
          <div className="flex-1 p-4 overflow-y-auto text-[12px] space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg ${m.role === 'bot' ? 'bg-slate-800 text-slate-200' : 'bg-blue-600 text-white text-left'}`}>
                {m.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
