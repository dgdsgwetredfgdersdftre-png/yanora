import { Calendar, X } from 'lucide-react';
import { BookingFormData, BookingStep } from '../BookingPage';
import { useState } from 'react';

interface BookingMobileProps {
  step: BookingStep;
  formData: BookingFormData;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handlePayment: (method: string) => void;
  navigate: (path: string) => void;
}

const countryCodes = [
  { code: '+86', name: '中国', flag: '🇨🇳' },
  { code: '+1', name: '美国', flag: '🇺🇸' },
  { code: '+44', name: '英国', flag: '🇬🇧' },
  { code: '+81', name: '日本', flag: '🇯🇵' },
  { code: '+82', name: '韩国', flag: '🇰🇷' },
  { code: '+65', name: '新加坡', flag: '🇸🇬' },
  { code: '+852', name: '香港', flag: '🇭🇰' },
  { code: '+853', name: '澳门', flag: '🇲🇴' },
  { code: '+886', name: '台湾', flag: '🇹🇼' },
  { code: '+61', name: '澳大利亚', flag: '🇦🇺' },
  { code: '+33', name: '法国', flag: '🇫🇷' },
  { code: '+49', name: '德国', flag: '🇩🇪' },
];

function BookingMobile({
  step,
  formData,
  loading,
  error,
  handleSubmit,
  handleChange,
  handlePayment,
  navigate
}: BookingMobileProps) {
  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: `${countryCode}${value}`
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  };

  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    const syntheticEvent = {
      target: {
        name: 'phone',
        value: `${newCode}${phoneNumber}`
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(syntheticEvent);
  };

  return (
    <div className="min-h-screen relative" style={{backgroundColor: '#F5F3F0'}}>
      <div className="fixed bottom-6 right-6 z-10">
        <span className="text-6xl font-light tracking-wider opacity-20" style={{color: '#1F1F1F'}}>
          YANORA
        </span>
      </div>

      <nav className="sticky top-0 z-50 py-4" style={{backgroundColor: '#F5F3F0'}}>
        <div className="px-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg font-light tracking-widest" style={{color: '#1F1F1F'}}>AESTHETIC</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2"
          >
            <X className="w-5 h-5" style={{color: '#1F1F1F'}} />
          </button>
        </div>
      </nav>

      <section className="py-6 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          {step === 'form' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-2xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
                立即预约
              </h1>
              <p className="text-center mb-6 text-xs tracking-wide" style={{color: '#6B7280'}}>
                填写您的信息，我们的专业团队将尽快与您联系
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-normal mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                      姓 <span style={{color: '#EF4444'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border rounded-lg text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                      placeholder="姓"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                      名 <span style={{color: '#EF4444'}}>*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border rounded-lg text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                      placeholder="名"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                    邮箱 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border rounded-lg text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                    placeholder="请输入您的邮箱地址"
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                    电话 <span style={{color: '#EF4444'}}>*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={handleCountryCodeChange}
                      className="px-3 py-3 bg-white border rounded-lg text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      style={{borderColor: '#E5E7EB', color: '#1F1F1F', minWidth: '100px'}}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      required
                      className="flex-1 px-4 py-3 bg-white border rounded-lg text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                      placeholder="请输入您的电话号码"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-white text-sm font-light transition tracking-wider disabled:opacity-50 rounded-lg"
                    style={{backgroundColor: '#1C2B3A'}}
                  >
                    {loading ? '提交中...' : '提交预约'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#1C2B3A'}}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-light mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                  支付面诊金
                </h1>
                <p className="text-xs tracking-wide" style={{color: '#6B7280'}}>
                  完成支付后，我们将确认您的预约
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded">
                  {error}
                </div>
              )}

              <div className="p-5 mb-6 rounded-lg" style={{backgroundColor: '#F5F3F0'}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm" style={{color: '#6B7280'}}>面诊金</span>
                  <span className="text-2xl font-light" style={{color: '#1F1F1F'}}>¥500</span>
                </div>
                <p className="text-xs" style={{color: '#6B7280'}}>
                  此费用用于预约确认，后续手术费用将根据您的个性化方案确定
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handlePayment('微信支付')}
                  disabled={loading}
                  className="w-full py-3.5 border text-sm transition hover:bg-gray-50 disabled:opacity-50 rounded-lg"
                  style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '微信支付'}
                </button>

                <button
                  onClick={() => handlePayment('支付宝')}
                  disabled={loading}
                  className="w-full py-3.5 border text-sm transition hover:bg-gray-50 disabled:opacity-50 rounded-lg"
                  style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '支付宝'}
                </button>

                <button
                  onClick={() => handlePayment('银行卡')}
                  disabled={loading}
                  className="w-full py-3.5 border text-sm transition hover:bg-gray-50 disabled:opacity-50 rounded-lg"
                  style={{borderColor: '#E5E7EB', color: '#1F1F1F'}}
                >
                  {loading ? '处理中...' : '银行卡支付'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-green-100">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-light mb-2 tracking-wide" style={{color: '#1F1F1F'}}>
                预约成功！
              </h1>
              <p className="mb-6 text-xs tracking-wide" style={{color: '#6B7280'}}>
                您的预约已确认，我们的团队将尽快与您联系
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 text-white text-sm transition rounded-lg"
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

export default BookingMobile;
