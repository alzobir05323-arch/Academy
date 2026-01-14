
import React, { useState } from 'react';
import { ArrowRight, Calendar, Star, DollarSign, BrainCircuit, MessageCircle, Clock, MapPin, CheckCircle2, User, LogOut, CreditCard, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';
import { markAsPaid } from '../services/playerService';

interface MemberPortalProps {
  onBack: () => void;
  player: any;
}

const MemberPortal: React.FC<MemberPortalProps> = ({ onBack, player }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'finance'>('profile');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'stcpay'>('mada');

  if (!player) return null;

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      await markAsPaid(player.id);
      // تحديث الحالة محلياً للمعاينة الفورية
      player.paymentStatus = 'paid';
      alert("تمت عملية الدفع بنجاح! أهلاً بك في الأكاديمية.");
    } catch (e) {
      alert("حدث خطأ أثناء معالجة الدفع.");
    } finally {
      setIsPaying(false);
    }
  };

  // واجهة الدفع الإلزامية للمشتركين الجدد المقبولين الذين لم يدفعوا
  if (player.paymentStatus === 'unpaid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Cairo']" dir="rtl">
        <div className="max-w-2xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center space-y-4">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} />
             </div>
             <h1 className="text-4xl font-black text-gray-800">مبارك القبول!</h1>
             <p className="text-gray-500 font-bold text-lg">تم قبول طلب انضمامك يا بطل. تتبقى خطوة واحدة أخيرة لتفعيل عضويتك وهي سداد الرسوم.</p>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl space-y-8 relative overflow-hidden">
             <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <CreditCard size={28} className="text-emerald-600" />
                  تفاصيل الرسوم
                </h3>
                <span className="bg-blue-50 text-blue-700 px-6 py-2 rounded-full font-black text-xs">باقة 3 أشهر</span>
             </div>

             <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                   <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">المبلغ المطلوب سداده</p>
                   <h4 className="text-5xl font-black tracking-tighter">1,200 <span className="text-lg opacity-50 font-bold">ر.س</span></h4>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
             </div>

             <div className="space-y-4">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mr-4">اختر وسيلة الدفع</p>
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => setPaymentMethod('mada')} className={`p-6 rounded-[1.8rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'mada' ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 hover:bg-gray-50'}`}>
                      <div className={`p-3 rounded-xl ${paymentMethod === 'mada' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}><CreditCard size={24} /></div>
                      <span className="font-black text-gray-700">مدى</span>
                   </button>
                   <button onClick={() => setPaymentMethod('stcpay')} className={`p-6 rounded-[1.8rem] border-2 transition-all flex items-center gap-4 ${paymentMethod === 'stcpay' ? 'border-emerald-500 bg-emerald-50 shadow-xl shadow-emerald-100' : 'border-gray-50 hover:bg-gray-50'}`}>
                      <div className={`p-3 rounded-xl ${paymentMethod === 'stcpay' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}><Wallet size={24} /></div>
                      <span className="font-black text-gray-700">STC Pay</span>
                   </button>
                </div>
             </div>

             <button 
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
             >
                {isPaying ? <RefreshCw className="animate-spin" size={28} /> : <><ShieldCheck size={28} /> تأكيد الدفع والتفعيل</>}
             </button>

             <button onClick={onBack} className="w-full py-4 text-gray-400 font-bold hover:text-red-500 transition-colors">تسجيل الخروج والعودة لاحقاً</button>
          </div>
        </div>
      </div>
    );
  }

  // الواجهة العادية للاعبين الذين سددوا الرسوم
  return (
    <div className="min-h-screen bg-gray-50 font-['Cairo'] text-right pb-10" dir="rtl">
      {/* Top Header */}
      <div className="bg-blue-900 text-white p-6 md:p-12 rounded-b-[4rem] shadow-2xl relative overflow-hidden border-b-8 border-blue-600">
        <div className="relative z-10 container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <button 
              onClick={onBack} 
              className="group p-4 bg-white/10 hover:bg-red-50 rounded-3xl transition-all flex items-center gap-2"
              title="تسجيل خروج"
            >
              <LogOut size={24} />
              <span className="text-xs font-black hidden group-hover:inline transition-all">خروج {player.fullName?.split(' ')[0]}</span>
            </button>
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-blue-900 text-4xl font-black shadow-inner border-4 border-white/20">
              {player.fullName?.charAt(0) || <User size={48} />}
            </div>
            <div>
              <p className="text-blue-300 text-sm font-black uppercase tracking-widest mb-1 opacity-80">بوابة اللاعب</p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{player.fullName}</h1>
              <p className="text-blue-200 text-sm mt-2 font-bold bg-white/5 w-fit px-4 py-1 rounded-full border border-white/10">{player.team} • {player.ageGroup}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/10 px-8 py-4 rounded-[2rem] border border-white/10 text-center backdrop-blur-xl shadow-lg">
                <p className="text-[10px] text-blue-200 uppercase font-black mb-1 tracking-widest opacity-60">حالة العضوية</p>
                <p className="text-2xl font-black text-emerald-400 tracking-tight">نشط في النظام</p>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none"></div>
      </div>

      <main className="container mx-auto px-6 -mt-10 relative z-20 space-y-8">
        {/* Navigation Tabs */}
        <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-gray-100 flex gap-3 max-w-3xl mx-auto">
          {[
            { id: 'profile', label: 'ملفي الرياضي', icon: Star },
            { id: 'schedule', label: 'جدول التمارين', icon: Calendar },
            { id: 'finance', label: 'الاشتراكات', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-5 rounded-[1.8rem] font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={22} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                <div className="flex items-center gap-3 text-blue-600">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <BrainCircuit size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">تقريرك الفني</h3>
                </div>
                <div className="p-8 bg-gray-50 border border-gray-100 border-dashed rounded-[2.5rem] text-blue-900 leading-relaxed text-lg font-bold shadow-inner">
                  كابتن {player.fullName?.split(' ')[0]}، أداؤك في تطور مستمر. التزامك في فريق {player.team} يعكس جدية عالية. واصل التركيز على التمارين اللياقية والتحركات التكتيكية لرفع تقييمك العام.
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">اللياقة</p>
                    <p className="text-3xl font-black text-blue-900">{player.attendanceRate || 85}%</p>
                  </div>
                  <div className="text-center p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">المستوى</p>
                    <p className="text-2xl font-black text-emerald-700">{player.level}</p>
                  </div>
                  <div className="text-center p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                    <p className="text-[10px] text-gray-500 mb-2 font-black uppercase tracking-widest">الانضباط</p>
                    <p className="text-2xl font-black text-amber-700">متميز</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                      <CheckCircle2 size={24} />
                      بطاقة الحضور
                    </h3>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="text-6xl font-black tracking-tighter">{player.attendanceRate || 90}%</div>
                      <div className="text-sm opacity-90 font-bold leading-relaxed">أداؤك الانضباطي ممتاز!</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ... (بقية التبويبات تظل كما هي) ... */}
      </main>
    </div>
  );
};

export default MemberPortal;
