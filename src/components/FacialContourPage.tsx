import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  avatar_url: string | null;
  email: string;
}

function FacialContourPage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<'nose' | 'eyes' | 'lips' | 'eyebrows' | 'ears'>('nose');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileProjects, setShowMobileProjects] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, email')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const noseTypes = [
    { id: 1, name: '直鼻', description: '气质干练', image: '🖼️' },
    { id: 2, name: '微翘鼻', description: '柔和甜美', image: '🖼️' },
    { id: 3, name: '盒鼻', description: '混血立体', image: '🖼️' },
    { id: 4, name: '水滴鼻', description: '自然圆润', image: '🖼️' },
  ];

  const eyeTypes = [
    { id: 1, name: '开扇双眼皮', description: '妩媚动人', image: '🖼️' },
    { id: 2, name: '平行双眼皮', description: '清纯自然', image: '🖼️' },
    { id: 3, name: '新月型', description: '甜美温柔', image: '🖼️' },
  ];

  const lipTypes = [
    { id: 1, name: 'M唇', description: '性感迷人', image: '🖼️' },
    { id: 2, name: '微笑唇', description: '亲和友善', image: '🖼️' },
    { id: 3, name: '饱满丰唇', description: '丰盈立体', image: '🖼️' },
  ];

  const eyebrowTypes = [
    { id: 1, name: '欧式挑眉', description: '高级精致', image: '🖼️' },
    { id: 2, name: '平直眉', description: '温柔大气', image: '🖼️' },
    { id: 3, name: '弯月眉', description: '柔和优雅', image: '🖼️' },
  ];

  const earTypes = [
    { id: 1, name: '贴发耳', description: '精灵耳矫正', image: '🖼️' },
    { id: 2, name: '正常耳廓', description: '杯状耳矫正', image: '🖼️' },
  ];

  const getCurrentTypes = () => {
    switch (activeFeature) {
      case 'nose': return noseTypes;
      case 'eyes': return eyeTypes;
      case 'lips': return lipTypes;
      case 'eyebrows': return eyebrowTypes;
      case 'ears': return earTypes;
      default: return noseTypes;
    }
  };

  const cases = [
    {
      id: 1,
      parts: '颧骨 + 下巴',
      description: '利用颧骨内推和颏成型术式改善面部轮廓流畅度，打造柔和的面部线条',
      before: '🖼️',
      after: '🖼️'
    },
    {
      id: 2,
      parts: '鼻子 + 眼睛',
      description: '综合鼻综合和双眼皮手术，提升五官精致度与面部协调性',
      before: '🖼️',
      after: '🖼️'
    },
    {
      id: 3,
      parts: '下颌线',
      description: '通过下颌角截骨改善方形脸，塑造流畅的下颌线条',
      before: '🖼️',
      after: '🖼️'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 bg-white z-50 py-6">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-light tracking-widest" style={{color: '#1F1F1F'}}>YANORA</span>
          </div>

          <button
            className="md:hidden"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="w-6 h-6" style={{color: '#1F1F1F'}} />
          </button>

          <div className="hidden md:flex items-center gap-12">
            <button onClick={() => navigate('/')} className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>首页</button>

            <div
              className="relative"
              onMouseEnter={() => setShowProjectsMenu(true)}
              onMouseLeave={() => setShowProjectsMenu(false)}
            >
              <a href="#projects" className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>项目</a>

              {showProjectsMenu && (
                <>
                  <div className="absolute left-0 right-0" style={{top: '100%', height: '20px'}} />
                  <div
                    className="fixed left-0 right-0 shadow-2xl"
                    style={{backgroundColor: '#1C2B3A', height: '480px', top: '80px'}}
                    onMouseEnter={() => setShowProjectsMenu(true)}
                    onMouseLeave={() => setShowProjectsMenu(false)}
                  >
                    <div className="max-w-7xl mx-auto px-16 h-full relative">
                      <div className="flex flex-col justify-center gap-4 h-full py-24" style={{maxWidth: '500px'}}>
                        <button
                          onClick={() => navigate('/facial-contour')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">面部轮廓</span>
                        </button>
                        <button
                          onClick={() => navigate('/body-sculpting')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">身体塑形</span>
                        </button>
                        <button
                          onClick={() => navigate('/injection-lifting')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">注射提升</span>
                        </button>
                        <button
                          onClick={() => navigate('/hair-transplant')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">植发</span>
                        </button>
                        <button
                          onClick={() => navigate('/dental')}
                          className="text-left px-8 py-5 transition-all duration-300 border border-white border-opacity-20"
                          style={{color: 'white', backgroundColor: 'transparent'}}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span className="text-lg font-light tracking-wider">牙齿美容</span>
                        </button>
                      </div>

                      <div className="absolute bottom-8 right-16">
                        <span className="text-6xl font-extralight tracking-widest" style={{color: 'rgba(255,255,255,0.3)'}}>YANORA</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => navigate('/#cases')} className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>案例</button>
            <button onClick={() => navigate('/faq')} className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>FAQ</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 transition"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2"
                      style={{borderColor: '#1C2B3A'}}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: '#1C2B3A'}}>
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border shadow-lg" style={{borderColor: '#D1D5DB'}}>
                    <div className="px-4 py-3 border-b" style={{borderColor: '#E5E7EB'}}>
                      <p className="text-sm font-normal" style={{color: '#1F1F1F'}}>{profile?.email || user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition"
                      style={{color: '#6B7280'}}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm transition px-4 py-2"
                style={{color: '#6B7280'}}
              >
                登录
              </button>
            )}
            <button
              onClick={() => navigate('/booking')}
              className="text-sm text-white px-6 py-2 transition"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
            >
              立即预约
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 right-0 h-full w-80 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showMobileMenu ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{backgroundColor: '#1C2B3A'}}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
            <span className="text-xl font-light tracking-widest text-white">YANORA</span>
            <button onClick={() => setShowMobileMenu(false)}>
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <button
              onClick={() => {
                navigate('/');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              首页
            </button>

            <div className="border-b border-white border-opacity-10">
              <button
                onClick={() => setShowMobileProjects(!showMobileProjects)}
                className="w-full text-left px-6 py-4 text-white text-sm transition-all"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                项目
              </button>
              {showMobileProjects && (
                <div className="bg-black bg-opacity-20">
                  <button
                    onClick={() => {
                      navigate('/facial-contour');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    面部轮廓
                  </button>
                  <button
                    onClick={() => {
                      navigate('/body-sculpting');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    身体塑形
                  </button>
                  <button
                    onClick={() => {
                      navigate('/injection-lifting');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    注射提升
                  </button>
                  <button
                    onClick={() => {
                      navigate('/hair-transplant');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    植发
                  </button>
                  <button
                    onClick={() => {
                      navigate('/dental');
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-10 py-3 text-white text-sm transition-all border-l-2 border-white border-opacity-30"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    牙齿美容
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                navigate('/#cases');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              案例
            </button>

            <button
              onClick={() => {
                navigate('/faq');
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              FAQ
            </button>
          </div>

          <div className="p-6 border-t border-white border-opacity-20">
            <button
              onClick={() => {
                navigate('/booking');
                setShowMobileMenu(false);
              }}
              className="w-full py-3 text-white text-sm transition mb-3 border border-white border-opacity-40"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              立即预约
            </button>

            {user ? (
              <div>
                <div className="px-4 py-3 mb-2 border-b border-white border-opacity-20">
                  <p className="text-sm text-white">{profile?.email || user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center gap-2 text-white transition"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMobileMenu(false);
                }}
                className="w-full py-3 text-white text-sm transition border border-white border-opacity-40"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Hero Section - Core Value Statement */}
      <section className="py-24 md:py-32 px-6 md:px-12" style={{backgroundColor: '#FAFAFA'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-light mb-8 leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>
            面部轮廓重塑
          </h1>
          <p className="text-base md:text-lg font-light leading-relaxed" style={{color: '#4B5563'}}>
            我们根据不同人种的面部结构和骨架特征，结合个人审美偏好，科学地提供个性化整形解决方案。
          </p>
        </div>
      </section>

      {/* Facial Contour Section - Bone & Soft Tissue */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              面部轮廓板块
            </h2>
            <p className="text-sm md:text-base font-light mb-12" style={{color: '#6B7280'}}>
              聚焦于面部大框架的调整，即"骨相"与轮廓线
            </p>
            <div className="flex justify-center mb-16">
              <div className="w-full md:w-2/3 lg:w-1/2 relative">
                <img
                  src="/Gemini_Generated_Image_qvpx6jqvpx6jqvpx.png"
                  alt="面部轮廓示例"
                  className="w-full h-auto object-contain"
                />

                {/* 额头标注 - 左侧 */}
                <div className="absolute" style={{top: '14%', left: '28%'}}>
                  <div className="relative">
                    {/* 点 */}
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', left: '-5px', top: '-5px'}}></div>
                    {/* 线条 */}
                    <div className="absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', right: '0'}}></div>
                    {/* 浮动文字框 */}
                    <div
                      className="absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        right: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>额头</p>
                    </div>
                  </div>
                </div>

                {/* 颧骨标注 - 右侧 */}
                <div className="absolute" style={{top: '48%', right: '20%'}}>
                  <div className="relative">
                    {/* 点 */}
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', right: '-5px', top: '-5px'}}></div>
                    {/* 线条 */}
                    <div className="absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', left: '0'}}></div>
                    {/* 浮动文字框 */}
                    <div
                      className="absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        left: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite 0.5s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>颧骨</p>
                    </div>
                  </div>
                </div>

                {/* 下颌线标注 - 左侧 */}
                <div className="absolute" style={{top: '72%', left: '25%'}}>
                  <div className="relative">
                    {/* 点 */}
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', left: '-5px', top: '-5px'}}></div>
                    {/* 线条 */}
                    <div className="absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', right: '0'}}></div>
                    {/* 浮动文字框 */}
                    <div
                      className="absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        right: '84px',
                        top: '-16px',
                        minWidth: '90px',
                        animation: 'floatUpDown 3s ease-in-out infinite 1s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>下颌线</p>
                    </div>
                  </div>
                </div>

                {/* 下巴标注 - 右侧 */}
                <div className="absolute" style={{top: '90%', right: '35%'}}>
                  <div className="relative">
                    {/* 点 */}
                    <div className="absolute w-2.5 h-2.5 bg-white border-2 rounded-full" style={{borderColor: '#1C2B3A', right: '-5px', top: '-5px'}}></div>
                    {/* 线条 */}
                    <div className="absolute w-20 h-0.5" style={{backgroundColor: '#1C2B3A', top: '-1px', left: '0'}}></div>
                    {/* 浮动文字框 */}
                    <div
                      className="absolute px-4 py-2 bg-white border shadow-lg"
                      style={{
                        borderColor: '#1C2B3A',
                        left: '84px',
                        top: '-16px',
                        minWidth: '80px',
                        animation: 'floatUpDown 3s ease-in-out infinite 1.5s'
                      }}
                    >
                      <p className="text-sm font-light whitespace-nowrap" style={{color: '#1F1F1F'}}>下巴</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: '□', title: '额头/眉骨', subtitle: '丰额头、眉弓抬高' },
              { icon: '□', title: '颧骨', subtitle: '颧骨内推/降低' },
              { icon: '□', title: '下颌线', subtitle: '下颌角截骨、去咬肌' },
              { icon: '□', title: '下巴', subtitle: '颏成型、假体隆颏' },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-8 md:p-10 border transition-all duration-300"
                style={{borderColor: '#E5E7EB'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div className="text-5xl mb-6" style={{color: '#1C2B3A'}}>{item.icon}</div>
                <h3 className="text-base md:text-lg font-normal mb-2" style={{color: '#1F1F1F'}}>
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm font-light" style={{color: '#6B7280'}}>
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facial Features Section */}
      <section className="py-20 md:py-28 px-6 md:px-12" style={{backgroundColor: '#FAFAFA'}}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              五官精雕板块
            </h2>
            <p className="text-sm md:text-base font-light" style={{color: '#6B7280'}}>
              聚焦于五官局部的精细化调整
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-12 justify-center">
            {[
              { key: 'nose' as const, label: '鼻子' },
              { key: 'eyes' as const, label: '眼睛' },
              { key: 'lips' as const, label: '嘴巴' },
              { key: 'eyebrows' as const, label: '眉毛' },
              { key: 'ears' as const, label: '耳朵' },
            ].map((feature) => (
              <button
                key={feature.key}
                onClick={() => setActiveFeature(feature.key)}
                className="px-8 md:px-10 py-3 md:py-4 text-sm md:text-base transition-all duration-300 border"
                style={{
                  backgroundColor: activeFeature === feature.key ? '#1C2B3A' : 'white',
                  color: activeFeature === feature.key ? 'white' : '#6B7280',
                  borderColor: activeFeature === feature.key ? '#1C2B3A' : '#D1D5DB',
                }}
                onMouseEnter={(e) => {
                  if (activeFeature !== feature.key) {
                    e.currentTarget.style.borderColor = '#1C2B3A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFeature !== feature.key) {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
              >
                {feature.label}
              </button>
            ))}
          </div>

          {/* Feature Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getCurrentTypes().map((type) => (
              <div
                key={type.id}
                className="bg-white border transition-all duration-300"
                style={{borderColor: '#E5E7EB'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="aspect-square flex items-center justify-center text-6xl"
                  style={{backgroundColor: '#F9FAFB'}}
                >
                  {type.image}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-base md:text-lg font-normal mb-2" style={{color: '#1F1F1F'}}>
                    {type.name}
                  </h3>
                  <p className="text-xs md:text-sm font-light" style={{color: '#6B7280'}}>
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              真实案例
            </h2>
            <p className="text-sm md:text-base font-light" style={{color: '#6B7280'}}>
              见证专业技术带来的美丽蜕变
            </p>
          </div>

          <div className="space-y-16">
            {cases.map((caseItem, index) => (
              <div
                key={caseItem.id}
                className="border-b pb-16"
                style={{borderColor: index === cases.length - 1 ? 'transparent' : '#E5E7EB'}}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
                    <div className="inline-block px-4 py-2 mb-6 text-xs tracking-widest border" style={{color: '#1C2B3A', borderColor: '#1C2B3A'}}>
                      {caseItem.parts}
                    </div>
                    <p className="text-base md:text-lg font-light leading-relaxed mb-8" style={{color: '#4B5563'}}>
                      {caseItem.description}
                    </p>
                  </div>

                  <div className={index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-3 tracking-wider" style={{color: '#6B7280'}}>术前</p>
                        <div
                          className="aspect-[3/4] flex items-center justify-center text-6xl"
                          style={{backgroundColor: '#F9FAFB'}}
                        >
                          {caseItem.before}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs mb-3 tracking-wider" style={{color: '#6B7280'}}>术后</p>
                        <div
                          className="aspect-[3/4] flex items-center justify-center text-6xl"
                          style={{backgroundColor: '#F9FAFB'}}
                        >
                          {caseItem.after}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => navigate('/booking')}
              className="px-12 md:px-16 py-4 text-white text-sm md:text-base transition tracking-wider"
              style={{backgroundColor: '#1C2B3A'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#101D29';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1C2B3A';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              预约专属咨询
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FacialContourPage;
