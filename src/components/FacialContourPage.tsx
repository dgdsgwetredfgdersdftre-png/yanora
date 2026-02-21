import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function FacialContourPage() {
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
            面部轮廓
          </h1>
          <p className="text-lg mb-12 leading-relaxed" style={{color: '#6B7280'}}>
            通过专业的面部轮廓设计，打造立体自然的面部线条
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>服务项目</h2>
              <ul className="space-y-4 text-base" style={{color: '#4B5563'}}>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>下颌角整形 - 打造流畅的面部线条</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>颧骨整形 - 优化面部中部轮廓</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>下巴整形 - 改善面部比例</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>脂肪填充 - 增加面部饱满度</span>
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
                <p className="text-sm" style={{color: '#6B7280'}}>拥有丰富经验的专业医师团队</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>个性化方案</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>根据每位客户的特点定制专属方案</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>安全保障</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>严格的安全标准和完善的术后跟踪</p>
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

export default FacialContourPage;
