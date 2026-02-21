import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function DentalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white z-50 py-6 border-b" style={{borderColor: '#E5E7EB'}}>
        <div className="max-w-7xl mx-auto px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-widest" style={{color: '#1F1F1F'}}>AESTHETIC</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm transition"
            style={{color: '#6B7280'}}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </button>
        </div>
      </nav>

      <section className="py-24 px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
            牙齿美容
          </h1>
          <p className="text-lg mb-12 leading-relaxed" style={{color: '#6B7280'}}>
            专业口腔美容，绽放自信笑容
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>服务项目</h2>
              <ul className="space-y-4 text-base" style={{color: '#4B5563'}}>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>牙齿美白 - 提亮牙齿色泽</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>牙齿矫正 - 打造完美牙列</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>瓷贴面 - 改善牙齿形态</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>种植牙 - 恢复缺失牙齿</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 aspect-[4/3] flex items-center justify-center">
              <span className="text-gray-400">项目展示图片</span>
            </div>
          </div>

          <div className="border-t pt-12" style={{borderColor: '#E5E7EB'}}>
            <h2 className="text-2xl font-light mb-8" style={{color: '#1F1F1F'}}>为什么选择我们</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>专业团队</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>资深口腔医师，经验丰富</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>先进设备</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>采用国际先进的口腔设备</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>舒适体验</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>无痛治疗，舒适安心</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/booking')}
              className="px-12 py-3 text-white text-sm transition tracking-wider"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              立即预约咨询
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DentalPage;
