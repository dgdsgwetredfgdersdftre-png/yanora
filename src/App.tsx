import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import ImageCompareSlider from './components/ImageCompareSlider';
import CaseStudiesSection from './components/CaseStudiesSection';
import MobileTestimonialCarousel from './components/MobileTestimonialCarousel';

interface Profile {
  avatar_url: string | null;
  email: string;
}

interface Testimonial {
  id: number;
  message: string;
  name: string;
}

function TestimonialCard({ testimonial, isExpanded, onExpand, onCollapse }: { testimonial: Testimonial, isExpanded: boolean, onExpand: () => void, onCollapse: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`flex-shrink-0 transition-all duration-700 ease-in-out ${isExpanded ? 'w-full z-50' : 'w-72'}`}>
      <div
        className="relative cursor-pointer"
        onClick={onExpand}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          if (isExpanded) {
            onCollapse();
          }
        }}
      >
        {!isExpanded ? (
          <div className="flex flex-col">
            <div className="relative" style={{ height: '340px' }}>
              <div className="absolute top-0 left-0 bg-white shadow-lg transform -rotate-3 transition-all duration-700" style={{ width: '85%', aspectRatio: '3/4', zIndex: 1 }}>
                <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#E8F4EA'}}>
                  <span className="text-xs" style={{color: '#6B7280'}}>WhatsApp {testimonial.id}</span>
                </div>
              </div>

              <div className="absolute left-4 bg-white shadow-lg transform rotate-2 transition-all duration-700" style={{ width: '85%', aspectRatio: '3/4', zIndex: 2, top: '15%' }}>
                <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                  <span className="text-xs text-gray-500">照片 {testimonial.id}-1</span>
                </div>
              </div>

              <div className="absolute left-8 bg-white shadow-xl transition-all duration-700" style={{ width: '85%', aspectRatio: '3/4', zIndex: 3, top: '30%' }}>
                <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#A0A7B5'}}>
                  <span className="text-xs text-white">照片 {testimonial.id}-2</span>
                </div>
              </div>

              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} style={{ zIndex: 4 }}>
                <div className="bg-white bg-opacity-95 px-6 py-3 shadow-lg">
                  <span className="text-sm font-light tracking-wider" style={{color: '#1C2B3A'}}>快来看看</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-light leading-relaxed mb-3 line-clamp-3" style={{color: '#4B5563'}}>
                "{testimonial.message}"
              </p>
              <p className="text-xs font-normal" style={{color: '#1F1F1F'}}>
                — {testimonial.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-40 rounded-3xl"></div>
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-20"></div>
            </div>

            <div className="relative z-10">
              <div className="flex gap-8 justify-center items-start mb-8">
                <div className="bg-white shadow-2xl transition-all duration-700 transform -rotate-2 hover:rotate-0" style={{ width: '280px', aspectRatio: '3/4' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#E8F4EA'}}>
                    <span className="text-sm" style={{color: '#6B7280'}}>WhatsApp {testimonial.id}</span>
                  </div>
                </div>

                <div className="bg-white shadow-2xl transition-all duration-700 hover:scale-105" style={{ width: '280px', aspectRatio: '3/4' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                    <span className="text-sm text-gray-500">照片 {testimonial.id}-1</span>
                  </div>
                </div>

                <div className="bg-white shadow-2xl transition-all duration-700 transform rotate-2 hover:rotate-0" style={{ width: '280px', aspectRatio: '3/4' }}>
                  <div className="w-full h-full flex items-center justify-center" style={{backgroundColor: '#A0A7B5'}}>
                    <span className="text-sm text-white">照片 {testimonial.id}-2</span>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-3xl mx-auto bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
                <p className="text-base font-light leading-relaxed mb-6" style={{color: '#4B5563'}}>
                  "{testimonial.message}"
                </p>
                <p className="text-sm font-normal" style={{color: '#1F1F1F'}}>
                  — {testimonial.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProjectsMenu, setShowProjectsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileProjects, setShowMobileProjects] = useState(false);
  const [expandedTestimonial, setExpandedTestimonial] = useState<number | null>(null);
  const [expandedEthnicity, setExpandedEthnicity] = useState<string | null>(null);

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
    const { data, error } = await supabase
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
            <a href="#home" className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>首页</a>

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

            <a href="#cases" className="text-sm transition" style={{color: '#6B7280'}} onMouseEnter={(e) => e.currentTarget.style.color = '#1F1F1F'} onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}>案例</a>
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
            <a
              href="#home"
              onClick={() => setShowMobileMenu(false)}
              className="block px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              首页
            </a>

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

            <a
              href="#cases"
              onClick={() => setShowMobileMenu(false)}
              className="block px-6 py-4 text-white text-sm transition-all border-b border-white border-opacity-10"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              案例
            </a>

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

      <section className="py-16 md:py-32 px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl md:text-3xl font-light mb-3 leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>
            只有自然独一无二的，
          </h1>
          <h2 className="text-xl md:text-3xl font-light mb-12 leading-relaxed tracking-wide" style={{color: '#1F1F1F'}}>
            你才是这个世界上最独特的符号
          </h2>
          <button
            onClick={() => navigate('/booking')}
            className="px-12 py-3 text-white text-sm transition tracking-wider"
            style={{backgroundColor: '#1C2B3A'}}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#101D29'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1C2B3A'}
          >
            现在开始探索
          </button>
        </div>
      </section>

      {/* 桌面端服务展示 */}
      <section className="hidden md:block py-12 px-12">
        <div className="w-4/5 mx-auto">
          <div className="p-8 flex flex-row gap-8 rounded-3xl" style={{minHeight: '450px', border: '8px solid #B9CBDC'}}>
            <div className="w-3/4 grid grid-cols-2 gap-6">
              <div className="aspect-[3/3]">
                <ImageCompareSlider
                  beforeLabel="【此处放置案例照片 A】"
                  afterLabel="【此处放置案例照片 B】"
                  initialPosition={50}
                />
              </div>
              <div className="aspect-[3/3]">
                <ImageCompareSlider
                  beforeLabel="【此处放置案例照片 A】"
                  afterLabel="【此处放置案例照片 B】"
                  initialPosition={50}
                />
              </div>
            </div>

            <div className="w-1/4 space-y-12">
              <div className="group cursor-pointer">
                <h3 className="text-xl font-normal transition" style={{color: '#1F1F1F'}}>面部轮廓</h3>
              </div>
              <div className="group cursor-pointer">
                <h3 className="text-xl font-normal transition" style={{color: '#1F1F1F'}}>身体塑形</h3>
              </div>
              <div className="group cursor-pointer">
                <h3 className="text-xl font-normal transition" style={{color: '#1F1F1F'}}>注射提升</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 移动端服务展示 */}
      <section className="md:hidden py-8 px-4">
        <div className="w-full">
          <div className="p-3 flex flex-col gap-4 rounded-3xl" style={{border: '4px solid #B9CBDC'}}>
            <div className="flex flex-col gap-3">
              <div className="aspect-square">
                <ImageCompareSlider
                  beforeLabel="【此处放置案例照片 A】"
                  afterLabel="【此处放置案例照片 B】"
                  initialPosition={50}
                />
              </div>
              <div className="aspect-square">
                <ImageCompareSlider
                  beforeLabel="【此处放置案例照片 C】"
                  afterLabel="【此处放置案例照片 D】"
                  initialPosition={50}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 43, 58, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#B9CBDC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>面部轮廓</h3>
              </div>
              <div
                className="cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 43, 58, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#B9CBDC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>身体塑形</h3>
              </div>
              <div
                className="cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 43, 58, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#B9CBDC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>注射提升</h3>
              </div>
              <div
                className="cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 active:scale-95"
                style={{
                  backgroundColor: '#F5F8FA',
                  border: '1.5px solid #B9CBDC'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = '#1C2B3A';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(28, 43, 58, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#B9CBDC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 className="text-sm font-normal text-center" style={{color: '#1F1F1F'}}>植发</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="hidden md:block">
            <h2 className="text-3xl font-light text-center mb-20 tracking-wide" style={{color: '#1F1F1F'}}>我们的优势</h2>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5" style={{backgroundColor: '#B9CBDC', transform: 'translateY(-50%)'}}></div>

              <div className="grid grid-cols-5 gap-8 relative">
                {[
                  { num: '1', title: '注重面部整体比例和谐' },
                  { num: '2', title: '专业的面诊评估' },
                  { num: '3', title: '专注于整体特征' },
                  { num: '4', title: '看看未来的自己' },
                  { num: '5', title: '基于美学的个性化方案' }
                ].map((item) => (
                  <div key={item.num} className="text-center relative">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-light relative z-10" style={{backgroundColor: '#1C2B3A'}}>
                      {item.num}
                    </div>
                    <h3 className="text-sm font-normal tracking-wide px-2" style={{color: '#1F1F1F'}}>{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden max-w-md mx-auto">
            <div className="rounded-3xl p-6" style={{backgroundColor: '#B9CBDC'}}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
                  <svg className="w-6 h-6" style={{color: '#B9CBDC'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-light text-center mb-5 text-white">我们的优势</h2>

              <div className="rounded-2xl p-4 space-y-0" style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                {[
                  { num: '1', title: '注重面部整体比例和谐' },
                  { num: '2', title: '专业的面诊评估' },
                  { num: '3', title: '专注于整体特征' },
                  { num: '4', title: '看看未来的自己' },
                  { num: '5', title: '基于美学的个性化方案' }
                ].map((item, index, array) => (
                  <div key={item.num}>
                    <div className="flex items-start gap-3 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white flex-shrink-0 text-sm font-light" style={{color: '#6B7280'}}>
                        {item.num}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-sm font-light text-white">{item.title}</h3>
                      </div>
                    </div>
                    {index < array.length - 1 && (
                      <div className="flex justify-center py-0">
                        <svg className="w-4 h-4 text-white opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-12" style={{backgroundColor: '#F3F4F6'}}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F1F1F'}}>
              不同人种的面部特征
            </h2>
            <p className="text-sm md:text-base leading-relaxed tracking-wide" style={{color: '#4B5563'}}>
              注重面部整体比例和谐，基于美学对不同人种有个性化的定制方案
            </p>
          </div>

          <div className="border-4 p-4 md:p-24 relative overflow-hidden" style={{borderColor: '#B9CBDC', backgroundColor: '#FFFFFF'}}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent opacity-30 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-50 to-transparent opacity-30 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
            <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-16 mb-6 md:mb-16">
              {[
                {
                  ethnicity: '黑人',
                  image: '/black_facial_features/1_(1).png',
                  features: {
                    bone: '面中部常显前突，但鼻骨低平；眶距可能较宽；下颌骨发达，嘴唇极厚且唇红外翻。',
                    soft: '皮肤较厚，不易长皱纹但需关注瘢痕愈合；鼻翼宽大，鼻孔扁平，鼻小柱短；多为双眼皮但形态深邃。'
                  }
                },
                {
                  ethnicity: '黄种人',
                  image: '/east_asian_facial_features/1_(2).png',
                  features: {
                    bone: '颧骨常显外扩，下颌角棱角分明，眉骨与眶缘发育平缓。',
                    soft: '单眼皮或内双比例高，常伴有内眦赘皮；鼻梁偏低，鼻头圆润，鼻基底凹陷；软组织相对丰厚。'
                  }
                },
                {
                  ethnicity: '白人',
                  image: '/white_facial_features/3.png',
                  features: {
                    bone: '眉骨与眶缘极为突出，颧骨转向侧面，下颌骨线条分明，下巴尖翘。',
                    soft: '皮肤较薄，脂肪含量少，容易出现皱纹和骨相显露；鼻梁高挺，鼻翼窄，嘴唇偏薄；双眼皮宽而深。'
                  }
                }
              ].map((item) => (
                <div key={item.ethnicity} className="text-center">
                  <div className="w-full aspect-[3/4] overflow-hidden mb-4 bg-gray-100">
                    <img src={item.image} alt={`${item.ethnicity}面部特征`} className="w-full h-full object-contain" />
                  </div>
                  <button
                    onClick={() => setExpandedEthnicity(expandedEthnicity === item.ethnicity ? null : item.ethnicity)}
                    className="text-sm font-normal tracking-wide mb-3 transition-colors duration-200 hover:opacity-70"
                    style={{color: '#1F1F1F'}}
                  >
                    {item.ethnicity} {expandedEthnicity === item.ethnicity ? '▲' : '▼'}
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: expandedEthnicity === item.ethnicity ? '500px' : '0',
                      opacity: expandedEthnicity === item.ethnicity ? 1 : 0
                    }}
                  >
                    <div className="text-left space-y-3 px-4 py-2">
                      <div>
                        <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>1. 骨骼特征：</h4>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.bone}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>2. 软组织特征：</h4>
                        <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.soft}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden mb-6">
              <div className="space-y-4">
                {[
                  {
                    ethnicity: '黑人',
                    image: '/black_facial_features/1_(1).png',
                    features: {
                      bone: '面中部常显前突，但鼻骨低平；眶距可能较宽；下颌骨发达，嘴唇极厚且唇红外翻。',
                      soft: '皮肤较厚，不易长皱纹但需关注瘢痕愈合；鼻翼宽大，鼻孔扁平，鼻小柱短；多为双眼皮但形态深邃。'
                    }
                  },
                  {
                    ethnicity: '黄种人',
                    image: '/east_asian_facial_features/1_(2).png',
                    features: {
                      bone: '颧骨常显外扩，下颌角棱角分明，眉骨与眶缘发育平缓。',
                      soft: '单眼皮或内双比例高，常伴有内眦赘皮；鼻梁偏低，鼻头圆润，鼻基底凹陷；软组织相对丰厚。'
                    }
                  },
                  {
                    ethnicity: '白人',
                    image: '/white_facial_features/3.png',
                    features: {
                      bone: '眉骨与眶缘极为突出，颧骨转向侧面，下颌骨线条分明，下巴尖翘。',
                      soft: '皮肤较薄，脂肪含量少，容易出现皱纹和骨相显露；鼻梁高挺，鼻翼窄，嘴唇偏薄；双眼皮宽而深。'
                    }
                  }
                ].map((item) => (
                  <div key={item.ethnicity} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex gap-3 mb-2">
                      <div className="w-20 aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={`${item.ethnicity}面部特征`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <button
                          onClick={() => setExpandedEthnicity(expandedEthnicity === item.ethnicity ? null : item.ethnicity)}
                          className="text-sm font-normal tracking-wide transition-colors duration-200 hover:opacity-70 flex items-center justify-between w-full"
                          style={{color: '#1F1F1F'}}
                        >
                          <span>{item.ethnicity}</span>
                          <span className="text-xs">{expandedEthnicity === item.ethnicity ? '▲' : '▼'}</span>
                        </button>
                      </div>
                    </div>

                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: expandedEthnicity === item.ethnicity ? '500px' : '0',
                        opacity: expandedEthnicity === item.ethnicity ? 1 : 0
                      }}
                    >
                      <div className="text-left space-y-2 pt-2 border-t border-gray-100">
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>1. 骨骼特征：</h4>
                          <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.bone}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1" style={{color: '#1F1F1F'}}>2. 软组织特征：</h4>
                          <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>{item.features.soft}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-sm tracking-wide mt-8" style={{color: '#6B7280'}}>
              了解你的面部特征，立即开始行之有效的行动来提升你的容颜
            </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>获取你的手术计划</h2>
          <p className="text-sm text-center mb-8 md:mb-16 tracking-wide" style={{color: '#6B7280'}}>
            了解你的面部特征，立即开始行之有效的行动来提升你的容颜
          </p>

          {/* Mobile layout - compact version */}
          <div className="md:hidden">
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex justify-center gap-6">
                <div className="overflow-hidden relative w-40" style={{backgroundColor: '#F3F4F6'}}>
                  <div className="h-36 flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                    <span className="text-gray-500 text-xs">术前照片 (Before)</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5">
                    <span className="text-xs text-gray-600">BEFORE</span>
                  </div>
                </div>
                <div className="overflow-hidden relative w-40" style={{backgroundColor: '#F3F4F6'}}>
                  <div className="h-36 flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                    <span className="text-gray-500 text-xs">术后照片 (After)</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white px-2 py-0.5">
                    <span className="text-xs text-gray-600">AFTER</span>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                {[
                  { num: '01', title: '获取专家面部分析' },
                  { num: '02', title: '你最美的样子' },
                  { num: '03', title: '获取你的专属焕颜方案' },
                  { num: '04', title: '见证显著效果' }
                ].map((item) => (
                  <div key={item.num} className="flex items-center gap-3 pb-3 border-b border-gray-200 last:border-0">
                    <div className="text-base font-light flex-shrink-0" style={{color: '#A0A7B5', width: '36px'}}>{item.num}</div>
                    <h3 className="text-sm font-normal tracking-wide leading-snug" style={{color: '#1F1F1F'}}>{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop layout - new design */}
          <div className="hidden md:flex md:flex-col md:items-center">
            {/* Before/After Images Section with Connected Border */}
            <div className="relative flex gap-32 flex-shrink-0 mb-12">
              <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                <path
                  d="M 20,20 L 420,20 L 420,524 L 20,524 L 20,20 M 548,20 L 948,20 L 948,524 L 548,524 L 548,20"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="2"
                />
              </svg>
              <div className="overflow-hidden relative" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <div className="flex items-center justify-center" style={{height: '500px', backgroundColor: '#B9CBDC'}}>
                  <span className="text-gray-600 text-sm">术前照片 (Before)</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow">
                  <span className="text-xs font-medium text-gray-700">BEFORE</span>
                </div>
              </div>
              <div className="overflow-hidden relative" style={{width: '400px', backgroundColor: '#F3F4F6'}}>
                <div className="flex items-center justify-center" style={{height: '500px', backgroundColor: '#B9CBDC'}}>
                  <span className="text-gray-600 text-sm">术后照片 (After)</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1.5 shadow">
                  <span className="text-xs font-medium text-gray-700">AFTER</span>
                </div>
              </div>
            </div>

            {/* Steps Section - Single Row */}
            <div className="flex gap-16 justify-center">
              {[
                { num: '01', title: '获取专家面部分析' },
                { num: '02', title: '你最美的样子' },
                { num: '03', title: '获取你的专属焕颜方案' },
                { num: '04', title: '见证显著效果' }
              ].map((item) => (
                <div key={item.num} className="flex flex-col items-center text-center">
                  <div className="text-4xl font-extralight mb-4" style={{color: '#D1D5DB'}}>{item.num}</div>
                  <h3 className="text-base font-normal leading-relaxed" style={{color: '#1F1F1F'}}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative" style={{backgroundColor: '#F9FAFB'}}>
        <div className="max-w-7xl mx-auto py-12 md:py-20 px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-light mb-4 tracking-wide" style={{color: '#1F2937'}}>
              你的脸，独一无二的解法
            </h2>
            <p className="text-base md:text-lg font-light tracking-wide" style={{color: '#6B7280'}}>
              基于人种骨架、动态肌肉与心理诉求的六维面诊分析法
            </p>
          </div>
        </div>

        {/* Desktop Layout - Keep Original */}
        <div className="hidden md:block w-full relative">
          <img
            src="/56315efc544d966bb744e9a52c7de1f4.png"
            alt="Professional portrait"
            className="w-full h-auto object-cover"
          />

          <div className="absolute inset-0 pointer-events-none">
            <div className="max-w-7xl mx-auto h-full relative px-4">
              <img
                src="/Gemini_Generated_Image_lv6nndlv6nndlv6n.png"
                alt="Analysis 1"
                className="absolute left-8 top-[15%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-left-1"
              />
              <img
                src="/Gemini_Generated_Image_pf7kappf7kappf7k.png"
                alt="Analysis 2"
                className="absolute left-12 bottom-[20%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-left-2"
              />
              <img
                src="/Gemini_Generated_Image_a16ssqa16ssqa16s.png"
                alt="Analysis 3"
                className="absolute right-8 top-[20%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-right-1"
              />
              <img
                src="/Gemini_Generated_Image_fv9uk0fv9uk0fv9u.png"
                alt="Analysis 4"
                className="absolute right-12 bottom-[15%] w-48 md:w-64 h-auto rounded-lg shadow-2xl float-right-2"
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout - New Design */}
        <div className="md:hidden w-full">
          <div className="px-4">
            <img
              src="/56315efc544d966bb744e9a52c7de1f4.png"
              alt="Professional portrait"
              className="w-full h-auto object-cover rounded-lg mb-6"
            />

            <div className="space-y-4 mb-8">
              {[
                {
                  image: '/Gemini_Generated_Image_lv6nndlv6nndlv6n.png',
                  title: '1. 轮廓与骨相维度'
                },
                {
                  image: '/Gemini_Generated_Image_pf7kappf7kappf7k.png',
                  title: '2. 软组织与皮相维度'
                },
                {
                  image: '/Gemini_Generated_Image_a16ssqa16ssqa16s.png',
                  title: '3. 五官局部维度'
                },
                {
                  image: '/Gemini_Generated_Image_fv9uk0fv9uk0fv9u.png',
                  title: '4. 动态与肌肉维度'
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-md border-l-4" style={{borderLeftColor: '#1C2B3A'}}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-28 h-28 object-cover rounded-lg flex-shrink-0 shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-medium relative inline-block pb-1" style={{color: '#1F2937'}}>
                      {item.title}
                      <span className="absolute bottom-0 left-0 w-full h-0.5" style={{backgroundColor: '#B9CBDC'}}></span>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-4 md:px-8" style={{backgroundColor: '#F3F4F6'}}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center mb-3 tracking-wide" style={{color: '#1F1F1F'}}>
            有没有想过你的脸会是什么样子
          </h2>
          <p className="text-sm md:text-base text-center mb-8 md:mb-16 tracking-wide" style={{color: '#6B7280'}}>展望未来</p>

          <div className="mb-8 md:mb-16 mx-auto w-full md:w-4/5 lg:w-3/4">
            <div className="h-64 md:h-96 lg:h-[575px]">
              <ImageCompareSlider
                beforeLabel="【此处放置案例照片 A】"
                afterLabel="【此处放置案例照片 B】"
                initialPosition={50}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-24 px-3 md:px-12" style={{backgroundColor: '#F3F4F6'}}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-light text-center mb-6 md:mb-8" style={{color: '#1F2937'}}>
            真实案例对比
          </h2>

          {/* Desktop layout - two cases side by side */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* First case */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-2 gap-0">
                <div className="aspect-[3/4] flex items-center justify-center" style={{backgroundColor: '#E5E7EB'}}>
                  <span className="text-gray-600 text-sm font-light">手术前</span>
                </div>
                <div className="aspect-[3/4] flex items-center justify-center" style={{backgroundColor: '#D1D5DB'}}>
                  <span className="text-gray-700 text-sm font-light">手术后</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{color: '#1F2937'}}>手术前特征：</p>
                  <div className="space-y-1 text-xs" style={{color: '#6B7280'}}>
                    <p>• 面部轮廓不够立体</p>
                    <p>• 鼻梁较低</p>
                    <p>• 下颌线条不够明显</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{color: '#1F2937'}}>手术后特征：</p>
                  <div className="space-y-1 text-xs" style={{color: '#6B7280'}}>
                    <p>• 面部轮廓立体分明</p>
                    <p>• 鼻梁挺拔自然</p>
                    <p>• 下颌线条流畅优雅</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Second case */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-2 gap-0">
                <div className="aspect-[3/4] flex items-center justify-center" style={{backgroundColor: '#E5E7EB'}}>
                  <span className="text-gray-600 text-sm font-light">手术前</span>
                </div>
                <div className="aspect-[3/4] flex items-center justify-center" style={{backgroundColor: '#D1D5DB'}}>
                  <span className="text-gray-700 text-sm font-light">手术后</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{color: '#1F2937'}}>手术前特征：</p>
                  <div className="space-y-1 text-xs" style={{color: '#6B7280'}}>
                    <p>• 眼部形态不够精致</p>
                    <p>• 皮肤松弛下垂</p>
                    <p>• 面部缺乏年轻活力</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium" style={{color: '#1F2937'}}>手术后特征：</p>
                  <div className="space-y-1 text-xs" style={{color: '#6B7280'}}>
                    <p>• 眼部深邃迷人</p>
                    <p>• 皮肤紧致年轻</p>
                    <p>• 面部线条柔美自然</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile layout - new design inspired by reference */}
          <div className="md:hidden space-y-6">
            {/* First case */}
            <div className="bg-white p-6" style={{borderColor: '#B9CBDC', border: '3px solid #B9CBDC'}}>
              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="aspect-[3/4] overflow-hidden flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                  <span className="text-gray-600 text-xs">手术前</span>
                </div>
                <div className="aspect-[3/4] overflow-hidden flex items-center justify-center" style={{backgroundColor: '#A0A7B5'}}>
                  <span className="text-white text-xs">手术后</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative mb-8">
                <div className="absolute left-0 right-0 top-1/2 h-px" style={{backgroundColor: '#D1D5DB', transform: 'translateY(-50%)'}}></div>
                <div className="relative text-center">
                  <span className="inline-block px-4 py-1 text-sm font-light" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>8 个月</span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>面部轮廓立体提升</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    通过专业的面部轮廓手术，使面部线条更加立体分明
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>鼻梁挺拔自然</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    精准的鼻部整形技术，打造自然挺拔的鼻梁线条
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>下颌线条优化</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    塑造流畅优雅的下颌线条，提升整体面部和谐度
                  </p>
                </div>
              </div>
            </div>

            {/* Second case */}
            <div className="bg-white p-6" style={{borderColor: '#B9CBDC', border: '3px solid #B9CBDC'}}>
              {/* Before/After Images */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="aspect-[3/4] overflow-hidden flex items-center justify-center" style={{backgroundColor: '#B9CBDC'}}>
                  <span className="text-gray-600 text-xs">手术前</span>
                </div>
                <div className="aspect-[3/4] overflow-hidden flex items-center justify-center" style={{backgroundColor: '#A0A7B5'}}>
                  <span className="text-white text-xs">手术后</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative mb-8">
                <div className="absolute left-0 right-0 top-1/2 h-px" style={{backgroundColor: '#D1D5DB', transform: 'translateY(-50%)'}}></div>
                <div className="relative text-center">
                  <span className="inline-block px-4 py-1 text-sm font-light" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>6 个月</span>
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>眼部轮廓精致化</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    打造深邃迷人的双眼，让眼神更加有神采
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>皮肤紧致提升</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    改善肌肤松弛问题，恢复年轻紧致状态
                  </p>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-normal mb-3" style={{color: '#1F1F1F'}}>整体气质提升</h3>
                  <p className="text-xs leading-relaxed" style={{color: '#6B7280'}}>
                    细节调整，打造更加协调自然的面部美感
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CaseStudiesSection />

      <section className="py-12 md:py-24 relative overflow-hidden bg-white">
        <div className="relative">
          {/* Mobile title */}
          <div className="md:hidden">
            <h2 className="text-2xl font-light text-center mb-3 tracking-wide px-6" style={{color: '#1F1F1F'}}>
              客户对我们的评价
            </h2>
            <p className="text-sm text-center mb-2" style={{color: '#6B7280'}}>我们的客户遍布全世界</p>
            <p className="text-xs text-center mb-6" style={{color: '#6B7280'}}>让客户满意是我们的永恒的追求</p>
            <div className="w-20 h-px mx-auto mb-8" style={{backgroundColor: '#A0A7B5'}}></div>
          </div>

          {/* Desktop title */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-light text-center mb-4 tracking-wide px-12" style={{color: '#1F1F1F'}}>
              客户对我们的评价
            </h2>
            <div className="w-20 h-px mx-auto mb-6" style={{backgroundColor: '#A0A7B5'}}></div>
          </div>

          {/* Desktop map with text on left */}
          <div className="hidden md:block max-w-7xl mx-auto mb-8 px-12">
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-3">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">我们的客户遍布全世界</h3>
                <p className="text-sm text-gray-600">让客户满意是我们的永恒的追求</p>
              </div>
              <div className="col-span-9 col-start-4">
                <div className="w-full h-[36rem] overflow-hidden">
                  <img src="/map.png" alt="全球客户分布地图" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile map - responsive */}
          <div className="md:hidden px-4 mb-8">
            <div className="w-full overflow-hidden">
              <img src="/map.png" alt="全球客户分布地图" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Desktop testimonials - unchanged */}
          <div className="hidden md:block relative overflow-hidden">
            <div
              className="flex gap-24 animate-scroll-testimonials px-12"
              style={{
                animation: expandedTestimonial !== null ? 'none' : undefined
              }}
            >
              {[
                {
                  id: 1,
                  message: "非常满意这次的整形效果！医生非常专业，从咨询到手术再到术后恢复，每一步都让我感到安心。现在的我更加自信了，真的很感谢 YANOR A 团队！",
                  name: "张女士"
                },
                {
                  id: 2,
                  message: "整个过程比我想象的要顺利得多。医生耐心地听取了我的需求，并给出了最适合我的方案。术后效果自然，周围的朋友都说我变美了！",
                  name: "李先生"
                },
                {
                  id: 3,
                  message: "选择 YANOR A 是我做过最正确的决定。从面诊到手术，整个团队都非常专业。现在看到镜子里的自己，真的很开心！",
                  name: "王女士"
                },
                {
                  id: 4,
                  message: "医生的技术真的很棒！效果超出了我的预期。术后恢复也很快，没有什么不适。强烈推荐给想要变美的朋友们！",
                  name: "陈女士"
                },
                {
                  id: 5,
                  message: "从咨询到术后跟踪，YANOR A 的服务让我非常满意。医生很细心，解答了我所有的疑问。整形后的效果非常自然，我很满意！",
                  name: "刘女士"
                },
                {
                  id: 6,
                  message: "朋友推荐我来的，果然没有让我失望。医生的审美很好，设计的方案很适合我。现在每天照镜子都很开心！",
                  name: "赵先生"
                },
                {
                  id: 7,
                  message: "医院环境很好，医生和护士都很专业。手术过程很顺利，恢复得也很快。选择 YANOR A 是正确的决定！",
                  name: "孙女士"
                },
                {
                  id: 8,
                  message: "非常感谢 YANOR A 的团队！从面诊到手术，再到术后恢复，每一步都很专业。现在的我更有自信了！",
                  name: "周女士"
                }
              ].map((testimonial) => {
                const isThisExpanded = expandedTestimonial === testimonial.id;
                const shouldHide = expandedTestimonial !== null && !isThisExpanded;

                if (shouldHide) return null;

                return (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    isExpanded={isThisExpanded}
                    onExpand={() => setExpandedTestimonial(testimonial.id)}
                    onCollapse={() => setExpandedTestimonial(null)}
                  />
                );
              })}
              {expandedTestimonial === null && [
                {
                  id: 1,
                  message: "非常满意这次的整形效果！医生非常专业，从咨询到手术再到术后恢复，每一步都让我感到安心。现在的我更加自信了，真的很感谢 YANOR A 团队！",
                  name: "张女士"
                },
                {
                  id: 2,
                  message: "整个过程比我想象的要顺利得多。医生耐心地听取了我的需求，并给出了最适合我的方案。术后效果自然，周围的朋友都说我变美了！",
                  name: "李先生"
                },
                {
                  id: 3,
                  message: "选择 YANOR A 是我做过最正确的决定。从面诊到手术，整个团队都非常专业。现在看到镜子里的自己，真的很开心！",
                  name: "王女士"
                },
                {
                  id: 4,
                  message: "医生的技术真的很棒！效果超出了我的预期。术后恢复也很快，没有什么不适。强烈推荐给想要变美的朋友们！",
                  name: "陈女士"
                },
                {
                  id: 5,
                  message: "从咨询到术后跟踪，YANOR A 的服务让我非常满意。医生很细心，解答了我所有的疑问。整形后的效果非常自然，我很满意！",
                  name: "刘女士"
                },
                {
                  id: 6,
                  message: "朋友推荐我来的，果然没有让我失望。医生的审美很好，设计的方案很适合我。现在每天照镜子都很开心！",
                  name: "赵先生"
                },
                {
                  id: 7,
                  message: "医院环境很好，医生和护士都很专业。手术过程很顺利，恢复得也很快。选择 YANOR A 是正确的决定！",
                  name: "孙女士"
                },
                {
                  id: 8,
                  message: "非常感谢 YANOR A 的团队！从面诊到手术，再到术后恢复，每一步都很专业。现在的我更有自信了！",
                  name: "周女士"
                }
              ].map((testimonial) => (
                <TestimonialCard
                  key={`duplicate-${testimonial.id}`}
                  testimonial={testimonial}
                  isExpanded={false}
                  onExpand={() => setExpandedTestimonial(testimonial.id)}
                  onCollapse={() => setExpandedTestimonial(null)}
                />
              ))}
            </div>
          </div>

          {/* Mobile testimonials - carousel format */}
          <div className="md:hidden">
            <MobileTestimonialCarousel />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="p-16 relative overflow-hidden" style={{backgroundColor: '#1C2B3A'}}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative">
              <h2 className="text-3xl font-light text-white mb-12 tracking-wide">今天开始你的蜕变之旅</h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                {[
                  '点击回答问题',
                  '上传图片',
                  '为你定制专属方案',
                  '为你开启旅途'
                ].map((step, index) => (
                  <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm p-8 text-white">
                    <div className="text-2xl font-light mb-3">{index + 1}</div>
                    <div className="text-sm font-light tracking-wide">{step}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button className="px-10 py-3 bg-white text-sm font-light transition tracking-wider" style={{color: '#1C2B3A'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                  开启你的蜕变之旅
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-white py-16 px-12" style={{backgroundColor: '#1C2B3A'}}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xl font-light tracking-widest">YANORA</span>
          </div>
          <p className="text-sm mb-10 font-light tracking-wide" style={{color: '#A0A7B5'}}>专业医美整形，成就更美的你</p>
          <div className="flex justify-center gap-12 text-xs font-light" style={{color: '#A0A7B5'}}>
            <a href="#" className="hover:text-white transition">关于我们</a>
            <a href="#" className="hover:text-white transition">联系方式</a>
            <a href="#" className="hover:text-white transition">隐私政策</a>
            <a href="#" className="hover:text-white transition">服务条款</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;
