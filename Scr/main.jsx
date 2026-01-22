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
  // إدارة الحالة - المحفظة تبدأ من صفر
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(0.00);
  const [equityCurve, setEquityCurve] = useState([
    { time: '00:00', value: 0 }
  ]);
  
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
    { id: 4, sym: 'NVDA', price: '135.2', chg: '+4.1%', vol: '1.2B', trend: 'up' },
    { id: 5, sym: 'TSLA', price: '210.8', chg: '-2.4%', vol: '900M', trend: 'down' }
  ];

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'مرحباً بك في CAZ. محفظتك الحالية صفر، هل ترغب في معرفة كيفية ربط حسابك الحقيقي أو بدء التداول التجريبي؟' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    try {
      // ملاحظة: يجب وضع المفتاح الخاص بك هنا بحذر
      const apiKey = "ضع_مفتاح_GEMINI_هنا"; 
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
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
            </div>
            <div className="h-64 w-full flex items-center justify-center border-t border-slate-800/30">
               <div className="text-center">
                  <TrendingUp size={48} className="text-slate-800 mx-auto mb-4" />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">لا توجد بيانات نمو لعرضها حالياً</p>
               </div>
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
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/20">
                   {marketAssets.map(asset => (
                     <tr key={asset.id} className="hover:bg-blue-600/[0.03] transition-colors">
                       <td className="px-8 py-5 font-bold text-white">{asset.sym}/USDT</td>
                       <td className="px-8 py-5 font-mono">${asset.price}</td>
                       <td className={`px-8 py-5 font-black ${asset.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>{asset.chg}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#111827] to-[#0d121f] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
             <h3 className="text-xs font-black text-blue-400 flex items-center gap-2 uppercase tracking-widest italic mb-6">
               <Sparkles size={18} /> رؤية CAZ الذكية
             </h3>
             <div className="space-y-6">
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50">
                   <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">"{cazInsight.logic}"</p>
                </div>
             </div>
          </div>

          <div className="bg-[#0d121f] border border-slate-800/40 rounded-[2.5rem] p-8">
             <button 
               onClick={() => setIsRunning(!isRunning)} 
               className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-3 border shadow-xl ${isRunning ? 'bg-rose-600/10 text-rose-500 border-rose-500/20' : 'bg-blue-600 text-white border-blue-400'}`}
             >
               {isRunning ? 'إيقاف النظام' : 'تشغيل محرك CAZ'}
             </button>
          </div>
        </div>
      </main>

      {/* Floating Chat */}
      <div className="fixed bottom-8 left-8 z-[100] flex flex-col items-end">
        {isChatOpen && (
          <div className="w-[350px] h-[500px] bg-[#0d121f] border border-slate-800/80 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden mb-6">
            <div className="p-6 bg-blue-700 text-white flex justify-between items-center">
              <span className="font-black text-xs">CAZ Terminal</span>
              <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-4 rounded-2xl text-[10px] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#151b2b] text-slate-200 border border-slate-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-900/50">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="اطلب من CAZ..." className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs focus:outline-none" />
            </div>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="p-5 bg-blue-600 rounded-full text-white shadow-2xl">
          <MessageSquare size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
