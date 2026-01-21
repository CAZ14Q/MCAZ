import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, TrendingUp, DollarSign, Play, Square, MessageSquare,
  History, Cpu, Globe, Send, Bot, X, Instagram, Sparkles, PieChart, 
  BarChart3, Zap, ShieldCheck, Search, Bell, Wallet
} from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

const App = () => {
  // State Management - Wallet starting at 0
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(0.00);
  const [equityCurve, setEquityCurve] = useState([
    { time: '00:00', value: 0 }
  ]);
  const [trades, setTrades] = useState([]);
  
  // CAZ Insights State
  const [cazInsight, setCazInsight] = useState({
    status: "WAITING",
    recommendation: "جاهز للبدء (Ready to Start)",
    confidence: 100,
    target: "---",
    logic: "المحفظة حالياً صفر. قم بتفعيل محرك الذكاء الاصطناعي لبدء تحليل الفرص المتاحة في السوق."
  });

  // Market Data Heatmap
  const marketAssets = [
    { id: 1, sym: 'BTC', price: '96,240', chg: '+3.2%', vol: '2.1B', trend: 'up' },
    { id: 2, sym: 'ETH', price: '2,640', chg: '+1.5%', vol: '800M', trend: 'up' },
    { id: 3, sym: 'SOL', price: '142.5', chg: '-0.8%', vol: '450M', trend: 'down' },
    { id: 4, sym: 'NVDA', price: '135.2', chg: '+4.1%', vol: '1.2B', trend: 'up' },
    { id: 5, sym: 'TSLA', price: '210.8', chg: '-2.4%', vol: '900M', trend: 'down' }
  ];

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'مرحباً بك في CAZ. محفظتك الحالية صفر، هل ترغب في معرفة كيفية ربط حسابك الحقيقي أو بدء التداول التجريبي؟' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // AI Chat Handler
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const apiKey = ""; 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `أنت خبير مالي في منصة CAZ AI. أجب باحترافية واختصار باللغة العربية: ${userMsg}` }] }]
        })
      });
      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "نظام التحليل مشغول حالياً.";
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'حدث خطأ في معالجة البيانات.' }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden" dir="rtl">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-[60] bg-[#020408]/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <Zap className="text-white fill-white" size={20} />
               </div>
               <h1 className="text-2xl font-black text-white italic tracking-tighter">CAZ <span className="text-blue-500">AI</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a href="https://instagram.com/gencazai" target="_blank" className="p-2 hover:bg-slate-800 rounded-lg transition-all text-slate-400 hover:text-pink-500">
               <Instagram size={20} />
             </a>
             <div className="h-8 w-[1px] bg-slate-800 mx-2"></div>
             <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800">
               <div className="text-left">
                 <p className="text-[8px] text-slate-500 font-bold uppercase leading-none">Wallet Status</p>
                 <p className="text-[11px] text-rose-500 font-black leading-tight">INACTIVE</p>
               </div>
               <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                 <Wallet size={16} className="text-slate-500" />
               </div>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#0d121f] border border-slate-800/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] block mb-1">صافي الرصيد الحالي</span>
                 <h2 className="text-4xl font-black text-white tracking-tight">${balance.toFixed(2)}<span className="text-slate-600 text-sm ml-2 font-bold">لا توجد عمليات</span></h2>
               </div>
               <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-[10px] font-bold text-slate-500">
                 في انتظار الإيداع أو بدء التداول
               </div>
            </div>
            
            <div className="h-64 w-full flex items-center justify-center border-t border-slate-800/30">
               {balance === 0 ? (
                 <div className="text-center">
                    <TrendingUp size={48} className="text-slate-800 mx-auto mb-4" />
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">لا توجد بيانات نمو لعرضها حالياً</p>
                 </div>
               ) : (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={equityCurve}>
                     <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fillOpacity={0} />
                   </AreaChart>
                 </ResponsiveContainer>
               )}
            </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800/40 rounded-[2.5rem] overflow-hidden shadow-xl">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-500" /> مراقبة السوق
                </h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-right text-xs">
                 <thead>
                   <tr className="text-slate-500 border-b border-slate-800/50">
                     <th className="px-8 py-4 font-bold uppercase tracking-tighter">الأصل</th>
                     <th className="px-8 py-4 font-bold uppercase tracking-tighter">السعر</th>
                     <th className="px-8 py-4 font-bold uppercase tracking-tighter">التغيير</th>
                     <th className="px-8 py-4 font-bold uppercase tracking-tighter text-left">الحجم</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/20">
                   {marketAssets.map(asset => (
                     <tr key={asset.id} className="hover:bg-blue-600/[0.03] transition-colors cursor-pointer group">
                       <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-black text-[10px] group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">{asset.sym}</div>
                           <span className="font-bold text-white">{asset.sym}/USDT</span>
                         </div>
                       </td>
                       <td className="px-8 py-5 font-mono font-bold">${asset.price}</td>
                       <td className={`px-8 py-5 font-black ${asset.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>{asset.chg}</td>
                       <td className="px-8 py-5 text-left text-slate-500 font-mono">{asset.vol}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-[#111827] to-[#0d121f] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black text-blue-400 flex items-center gap-2 uppercase tracking-widest italic">
                  <Sparkles size={18} /> رؤية CAZ الذكية
                </h3>
             </div>
             
             <div className="space-y-6">
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">التقييم الفني</p>
                   <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-slate-400 italic">{cazInsight.status}</span>
                   </div>
                </div>

                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">"{cazInsight.logic}"</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">الهدف</p>
                      <p className="text-sm font-black text-white">{cazInsight.target}</p>
                   </div>
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">الحالة</p>
                      <p className="text-sm font-black text-blue-400">نشط</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800/40 rounded-[2.5rem] p-8">
             <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isRunning ? 'bg-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                   <Activity size={24} className={isRunning ? 'animate-pulse' : ''} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-white">محرك التداول</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">{isRunning ? 'قيد التفعيل' : 'متوقف حالياً'}</p>
                </div>
             </div>
             <button 
               onClick={() => setIsRunning(!isRunning)} 
               className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 border shadow-xl ${isRunning ? 'bg-rose-600/10 text-rose-500 border-rose-500/20 hover:bg-rose-600/20' : 'bg-blue-600 text-white border-blue-400 hover:bg-blue-700 shadow-blue-600/20'}`}
             >
               {isRunning ? <Square size={16} fill="currentColor"/> : <Play size={16} fill="currentColor"/>}
               {isRunning ? 'إيقاف النظام' : 'تشغيل محرك CAZ'}
             </button>
          </div>

        </div>
      </main>

      {/* Floating Chat */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="w-[380px] md:w-[450px] h-[580px] bg-[#0d121f] border border-slate-800/80 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden mb-6 animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 bg-gradient-to-r from-blue-700 to-indigo-700 flex justify-between items-center">
              <div className="flex items-center gap-4 z-10 text-white">
                <Bot size={24} />
                <div>
                  <h4 className="font-black text-xs italic uppercase">CAZ Terminal</h4>
                  <p className="text-[9px] font-bold uppercase opacity-70">Neural Connection Live</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-950/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-[11px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-[#151b2b] text-slate-200 rounded-tl-none border border-slate-800/80 shadow-lg'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-blue-400 font-bold animate-pulse px-2">CAZ is computing...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 bg-slate-900/50 border-t border-slate-800/50">
              <div className="relative">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="اطلب من CAZ تحليل محفظتك..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 pl-16 text-xs focus:outline-none focus:border-blue-500/50" />
                <button onClick={handleSendMessage} className="absolute left-3 top-3 p-3 bg-blue-600 rounded-xl text-white"><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-4 ring-2 ring-white/10">
          <MessageSquare size={28} />
        </button>
      </div>

      <footer className="max-w-7xl mx-auto py-16 px-8 border-t border-slate-900/50 mt-20 text-center">
         <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl font-black text-white italic tracking-tighter">CAZ</h2>
            <a href="https://instagram.com/gencazai" target="_blank" className="flex items-center gap-3 text-slate-500 hover:text-pink-500 transition-colors text-xs font-bold">
              <Instagram size={18} /> @gencazai
            </a>
            <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.4em] italic">&copy; 2025 CAZ NEURAL ENTERPRISE SOLUTIONS</p>
         </div>
      </footer>
    </div>
  );
};

export default App;

