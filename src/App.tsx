import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Crown,
  Map,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import PredictionPage from './components/PredictionPage';
import ComparisonPage from './components/ComparisonPage';
import MarketTrendsForm from './components/MarketTrendsForm';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SubscriptionPage from './components/SubscriptionPage';
import SubscriptionSuccessPage from './components/SubscriptionSuccessPage';
import MapPage from './components/MapPage';
import ProfilePage from './components/ProfilePage';
import { AuthProvider, useAuth } from './components/AuthWrapper';
import { getProductByPriceId } from './stripe-config';

interface Content {
  nav: {
    brandName: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaButton: string;
    learnMore: string;
  };
  navigationButtons: Array<{
    id: string;
    text: string;
    icon: React.ComponentType<any>;
  }>;
}

const content: Record<'th' | 'en', Content> = {
  th: {
    nav: {
      brandName: 'ThaiPropertyAI',
    },
    hero: {
      headline: 'ทำนายราคาอสังหาริมทรัพย์ไทย',
      subheadline:
        'ประเมินราคาด้วย AI ขั้นสูง สำหรับตลาดอสังหาริมทรัพย์ไทย ตัดสินใจลงทุนอย่างมั่นใจด้วยการวิเคราะห์ตลาดที่ครอบคลุม',
      ctaButton: 'เริ่มประเมินราคา',
      learnMore: 'เรียนรู้เพิ่มเติม',
    },
    navigationButtons: [
      { id: 'prediction', text: 'เริ่มทำนายราคา', icon: TrendingUp },
      { id: 'trends', text: 'ดูแนวโน้มตลาด', icon: BarChart3 },
      { id: 'compare', text: 'เปรียบเทียบ', icon: Globe },
      { id: 'map', text: 'แผนที่', icon: Map },
    ],
  },
  en: {
    nav: {
      brandName: 'ThaiPropertyAI',
    },
    hero: {
      headline: 'Predict Thai Property Prices',
      subheadline:
        'Accurately evaluate Thai property prices with advanced AI for better investment decisions.',
      ctaButton: 'Start Price Prediction',
      learnMore: 'Learn More',
    },
    navigationButtons: [
      { id: 'prediction', text: 'Start Prediction', icon: TrendingUp },
      { id: 'trends', text: 'View Market Trends', icon: BarChart3 },
      { id: 'compare', text: 'Compare', icon: Globe },
      { id: 'map', text: 'Map', icon: Map },
    ],
  },
};

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [language, setLanguage] = useState<'th' | 'en'>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<
    | 'home'
    | 'prediction'
    | 'comparison'
    | 'trends'
    | 'login'
    | 'register'
    | 'subscription'
    | 'subscription-success'
    | 'map'
    | 'profile'
  >('home');
  const [userSubscription, setUserSubscription] = useState<any>(null);

  const currentContent = content[language];

  // Fetch user subscription when user is available
  React.useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/stripe_user_subscriptions`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setUserSubscription(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const getCurrentPlanName = () => {
    if (!userSubscription?.price_id) return null;
    const product = getProductByPriceId(userSubscription.price_id);
    return product?.name || null;
  };

  const toggleLanguage = (lang: 'th' | 'en') => {
    setLanguage(lang);
    setMobileMenuOpen(false);
  };

  const handleNavigationClick = (buttonId: string) => {
    if (buttonId === 'prediction') {
      setCurrentPage('prediction');
    } else if (buttonId === 'compare') {
      setCurrentPage('comparison');
    } else if (buttonId === 'trends') {
      setCurrentPage('trends');
    } else if (buttonId === 'map') {
      setCurrentPage('map');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentPage('home');
    setMobileMenuOpen(false);
    setUserSubscription(null);
  };

  const handleSwitchToRegister = () => {
    setCurrentPage('register');
  };

  const handleSwitchToLogin = () => {
    setCurrentPage('login');
  };

  // Handle URL-based routing for subscription success
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/subscription-success') {
      setCurrentPage('subscription-success');
    } else if (path === '/subscription') {
      setCurrentPage('subscription');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'prediction') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('prediction')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return <PredictionPage language={language} onBack={handleBackToHome} />;
  }

  if (currentPage === 'comparison') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('comparison')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return <ComparisonPage language={language} onBack={handleBackToHome} />;
  }

  if (currentPage === 'trends') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('trends')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return <MarketTrendsForm language={language} onBack={handleBackToHome} />;
  }

  if (currentPage === 'map') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('map')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return <MapPage language={language} onBack={handleBackToHome} />;
  }

  if (currentPage === 'profile') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('profile')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return <ProfilePage language={language} onBack={handleBackToHome} user={user} userSubscription={userSubscription} />;
  }

  if (currentPage === 'subscription') {
    if (!user) {
      return (
        <LoginPage
          language={language}
          onBack={handleBackToHome}
          onLoginSuccess={() => setCurrentPage('subscription')}
          onSwitchToRegister={handleSwitchToRegister}
        />
      );
    }
    return (
      <SubscriptionPage
        language={language}
        onBack={handleBackToHome}
        user={user}
      />
    );
  }

  if (currentPage === 'subscription-success') {
    return (
      <SubscriptionSuccessPage
        language={language}
        onBack={handleBackToHome}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage
        language={language}
        onBack={handleBackToHome}
        onLoginSuccess={() => setCurrentPage('home')}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegisterPage 
        language={language} 
        onBack={handleBackToHome}
        onSwitchToLogin={handleSwitchToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
        }}
      />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="font-bold text-xl text-gray-900">
                  {currentContent.nav.brandName}
                </div>
              </div>

              {/* Desktop Buttons (Language + Auth) */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Language */}
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-black text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => toggleLanguage('th')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    language === 'th'
                      ? 'bg-black text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  TH
                </button>

                {/* Auth Buttons */}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCurrentPage('subscription')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 transition"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{getCurrentPlanName() || 'Premium'}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <User className="w-4 h-4" />
                      <div className="text-right">
                        <div className="text-sm">{user.email}</div>
                        {getCurrentPlanName() && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{getCurrentPlanName()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentPage('profile')}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setCurrentPage('login')}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setCurrentPage('register')}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-gray-500 hover:bg-gray-50 transition-all duration-200"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden pb-4 animate-in slide-in-from-top duration-200">
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      language === 'en'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => toggleLanguage('th')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      language === 'th'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    ไทย
                  </button>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 flex flex-col space-y-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-gray-700 border-b">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage('subscription');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center space-x-2"
                      >
                        <Crown className="w-4 h-4" />
                        <span>Premium</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('profile');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage('login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setCurrentPage('register');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                {currentContent.hero.headline}
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto">
              {currentContent.hero.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => handleNavigationClick('prediction')}
                className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:bg-gray-800"
              >
                {currentContent.hero.ctaButton}
              </button>
              <button className="w-full sm:w-auto border-2 border-gray-500 text-gray-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transform hover:-translate-y-0.5 transition-all duration-200">
                {currentContent.hero.learnMore}
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mb-16">
              {currentContent.navigationButtons.map((button) => {
                const IconComponent = button.icon;
                return (
                  <button
                    key={button.id}
                    onClick={() => handleNavigationClick(button.id)}
                    className="group bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-400 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-center space-y-2 md:space-y-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center mb-2 md:mb-3">
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-gray-700 transition-colors duration-300 text-center leading-tight">
                        {button.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-black" />
              </div>
              <div className="font-bold text-lg">
                {currentContent.nav.brandName}
              </div>
            </div>
            <p className="text-gray-400">
              {language === 'th'
                ? '© 2024 ThaiPropertyAI. สงวนลิขสิทธิ์.'
                : '© 2024 ThaiPropertyAI. All rights reserved.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;