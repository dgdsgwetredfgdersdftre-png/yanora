import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';

function BookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [bookingId, setBookingId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    service_type: '面部轮廓',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const bookingData = {
        ...formData,
        user_id: user?.id || null,
        status: 'pending',
        payment_status: 'unpaid',
        consultation_fee: 500
      };

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (insertError) throw insertError;

      setBookingId(data.id);
      setStep('payment');
    } catch (err: any) {
      setError(err.message || '提交失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method: string) => {
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const paymentData = {
        booking_id: bookingId,
        user_id: user?.id || null,
        amount: 500,
        currency: 'CNY',
        payment_method: method,
        status: 'completed'
      };

      const { error: paymentError } = await supabase
        .from('payments')
        .insert([paymentData]);

      if (paymentError) throw paymentError;

      const { error: updateError } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', bookingId);

      if (updateError) throw updateError;

      setStep('success');
    } catch (err: any) {
      setError(err.message || '支付失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white z-50 py-6 border-b" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-7xl mx-auto px-12 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl font-light tracking-widest" style={{color: '#1F1F1F'}}>AESTHETIC</span>
          </button>
        </div>
      </nav>

      <section className="py-24 px-12">
        <div className="max-w-2xl mx-auto">
          {step === 'form' && (
            <>
              <h1 className="text-4xl font-light text-center mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
                立即预约
              </h1>
              <p className="text-center mb-16 tracking-wide" style={{color: '#6B7280'}}>
                填写您的信息，我们的专业团队将尽快与您联系
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    姓名 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    电话 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                    placeholder="请输入您的电话号码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    邮箱 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                    placeholder="请输入您的邮箱地址"
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    预约日期 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                  />
                </div>

                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    服务类型 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                  >
                    <option value="面部轮廓">面部轮廓</option>
                    <option value="身体塑形">身体塑形</option>
                    <option value="注射提升">注射提升</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-normal mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                    留言
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 border text-sm tracking-wide transition focus:outline-none focus:border-gray-900"
                    style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                    placeholder="请告诉我们您的需求或问题"
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 text-white text-sm font-light transition tracking-wider disabled:opacity-50"
                    style={{backgroundColor: '#1C2B3A'}}
                  >
                    {loading ? '提交中...' : '提交预约'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="text-sm transition tracking-wide"
                    style={{color: '#6B7280'}}
                  >
                    返回首页
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'payment' && (
            <>
              <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#1C2B3A'}}>
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
                  支付面诊金
                </h1>
                <p className="text-sm tracking-wide" style={{color: '#6B7280'}}>
                  完成支付后，我们将确认您的预约
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-gray-50 p-8 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm" style={{color: '#6B7280'}}>面诊金</span>
                  <span className="text-2xl font-light" style={{color: '#1F1F1F'}}>¥500</span>
                </div>
                <p className="text-xs" style={{color: '#6B7280'}}>
                  此费用用于预约确认，后续手术费用将根据您的个性化方案确定
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handlePayment('微信支付')}
                  disabled={loading}
                  className="w-full py-4 border text-sm transition hover:bg-gray-50 disabled:opacity-50"
                  style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '微信支付'}
                </button>

                <button
                  onClick={() => handlePayment('支付宝')}
                  disabled={loading}
                  className="w-full py-4 border text-sm transition hover:bg-gray-50 disabled:opacity-50"
                  style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '支付宝'}
                </button>

                <button
                  onClick={() => handlePayment('银行卡')}
                  disabled={loading}
                  className="w-full py-4 border text-sm transition hover:bg-gray-50 disabled:opacity-50"
                  style={{borderColor: '#D1D5DB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '银行卡支付'}
                </button>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm transition tracking-wide"
                  style={{color: '#6B7280'}}
                >
                  返回首页
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-green-100">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
                预约成功！
              </h1>
              <p className="mb-8 tracking-wide" style={{color: '#6B7280'}}>
                您的预约已确认，我们的团队将尽快与您联系
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 text-white text-sm transition"
                style={{backgroundColor: '#1C2B3A'}}
              >
                返回首页
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default BookingPage;
