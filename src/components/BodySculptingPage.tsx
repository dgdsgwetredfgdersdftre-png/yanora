import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

function BodySculptingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    '/Gemini_Generated_Image_94iwds94iwds94iw.png',
    '/Gemini_Generated_Image_iubeodiubeodiube.png',
    '/Gemini_Generated_Image_u1lac1u1lac1u1la.png'
  ];

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

      <section className="py-24 px-2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light mb-6 tracking-wide" style={{color: '#1F1F1F'}}>
              身体塑形
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{color: '#6B7280'}}>
              科学塑形方案，打造理想身材曲线
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="px-10 py-3 text-white text-sm transition tracking-wider rounded-sm"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              现在开始探索
            </button>
          </div>

          <div className="bg-white p-0 mb-16">
            {/* Desktop view - 3 images side by side */}
            <div className="hidden md:flex items-end justify-center gap-0">
              <img
                src="/Gemini_Generated_Image_94iwds94iwds94iw.png"
                alt="身体塑形示例1"
                className="h-[600px] object-contain"
                style={{
                  filter: 'brightness(1.1) contrast(1.05)',
                  mixBlendMode: 'darken'
                }}
              />
              <img
                src="/Gemini_Generated_Image_iubeodiubeodiube.png"
                alt="身体塑形示例2"
                className="h-[600px] object-contain"
                style={{
                  filter: 'brightness(1.1) contrast(1.05)',
                  mixBlendMode: 'darken'
                }}
              />
              <img
                src="/Gemini_Generated_Image_u1lac1u1lac1u1la.png"
                alt="身体塑形示例3"
                className="h-[600px] object-contain"
                style={{
                  filter: 'brightness(1.1) contrast(1.05)',
                  mixBlendMode: 'darken'
                }}
              />
            </div>

            {/* Mobile view - swipeable carousel */}
            <div className="md:hidden">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  onTouchStart={(e) => {
                    const touch = e.touches[0];
                    const startX = touch.clientX;

                    const handleTouchMove = (moveEvent: TouchEvent) => {
                      const currentX = moveEvent.touches[0].clientX;
                      const diff = startX - currentX;

                      if (Math.abs(diff) > 50) {
                        if (diff > 0 && currentSlide < images.length - 1) {
                          setCurrentSlide(currentSlide + 1);
                        } else if (diff < 0 && currentSlide > 0) {
                          setCurrentSlide(currentSlide - 1);
                        }
                        document.removeEventListener('touchmove', handleTouchMove);
                      }
                    };

                    document.addEventListener('touchmove', handleTouchMove);
                    document.addEventListener('touchend', () => {
                      document.removeEventListener('touchmove', handleTouchMove);
                    }, { once: true });
                  }}
                >
                  {images.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex justify-center items-center px-4">
                      <img
                        src={src}
                        alt={`身体塑形示例${index + 1}`}
                        className="w-full max-w-md object-contain"
                        style={{
                          filter: 'brightness(1.1) contrast(1.05)',
                          mixBlendMode: 'darken',
                          height: 'auto'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: currentSlide === index ? '#1F1F1F' : '#D1D5DB'
                    }}
                    aria-label={`切换到图片 ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-light" style={{color: '#1F1F1F'}}>服务项目</h2>
              <ul className="space-y-4 text-base" style={{color: '#4B5563'}}>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>吸脂塑形 - 精准去除多余脂肪</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>腹部塑形 - 打造平坦紧致腹部</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>臀部提升 - 塑造完美臀型</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1">•</span>
                  <span>大腿塑形 - 改善腿部线条</span>
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
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>先进技术</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>采用国际领先的塑形技术</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>精准塑形</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>根据身体比例设计最佳方案</p>
              </div>
              <div className="p-6" style={{backgroundColor: '#F3F4F6'}}>
                <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>快速恢复</h3>
                <p className="text-sm" style={{color: '#6B7280'}}>微创技术，恢复期短</p>
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

export default BodySculptingPage;
