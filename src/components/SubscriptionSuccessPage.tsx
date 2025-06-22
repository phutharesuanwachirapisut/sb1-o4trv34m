import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowLeft, Crown, Loader2, Star, Zap } from 'lucide-react';

interface SubscriptionSuccessPageProps {
  language: 'th' | 'en';
  onBack: () => void;
}

const content = {
  th: {
    title: 'การสมัครสมาชิกสำเร็จ!',
    subtitle: 'ขอบคุณที่เลือกใช้ ThaiPropertyAI',
    message: 'การสมัครสมาชิกของคุณได้รับการยืนยันแล้ว คุณสามารถเข้าใช้งานฟีเจอร์พรีเมียมทั้งหมดได้แล้ว',
    backToApp: 'กลับสู่แอปพลิเคชัน',
    processing: 'กำลังประมวลผลการสมัครสมาชิก...',
    features: 'คุณสมบัติที่ปลดล็อกแล้ว',
    welcome: 'ยินดีต้อนรับสู่',
    proFeatures: [
      'การทำนายราคาด้วย AI ขั้นสูง',
      'การวิเคราะห์แนวโน้มตลาด',
      'การเปรียบเทียบอสังหาริมทรัพย์',
      'การพยากรณ์ราคาในอนาคต',
      'รายงานตลาดรายเดือน'
    ],
    premiumFeatures: [
      'คุณสมบัติทั้งหมดของ Pro Plan',
      'การประเมินมูลค่าทรัพย์สินแบบละเอียด',
      'การวิเคราะห์ ROI และความเสี่ยง',
      'การแจ้งเตือนโอกาสการลงทุน',
      'การสนับสนุนลูกค้าแบบ VIP',
      'รายงานการวิเคราะห์แบบกำหนดเอง'
    ]
  },
  en: {
    title: 'Subscription Successful!',
    subtitle: 'Thank you for choosing ThaiPropertyAI',
    message: 'Your subscription has been confirmed. You now have access to all premium features.',
    backToApp: 'Back to Application',
    processing: 'Processing your subscription...',
    features: 'Unlocked Features',
    welcome: 'Welcome to',
    proFeatures: [
      'Advanced AI Price Prediction',
      'Market Trends Analysis',
      'Property Comparison',
      'Future Price Forecasting',
      'Monthly Market Reports'
    ],
    premiumFeatures: [
      'All Pro Plan Features',
      'Detailed Property Valuation',
      'ROI & Risk Analysis',
      'Investment Opportunity Alerts',
      'VIP Customer Support',
      'Custom Analytics Reports'
    ]
  }
};

const SubscriptionSuccessPage: React.FC<SubscriptionSuccessPageProps> = ({ language, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [planType, setPlanType] = useState<'pro' | 'premium'>('pro');
  const currentContent = content[language];

  useEffect(() => {
    // Check URL parameters to determine which plan was purchased
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // Simulate processing time for subscription activation
    const timer = setTimeout(() => {
      setIsProcessing(false);
      // Randomly set plan type for demo (in real app, this would come from the session)
      setPlanType(Math.random() > 0.5 ? 'premium' : 'pro');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getFeatures = () => {
    return planType === 'premium' ? currentContent.premiumFeatures : currentContent.proFeatures;
  };

  const getPlanName = () => {
    return planType === 'premium' ? 'Premium Plan' : 'Pro Plan';
  };

  const getPlanIcon = () => {
    return planType === 'premium' ? (
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Crown className="w-12 h-12 text-white" />
      </div>
    ) : (
      <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Star className="w-12 h-12 text-white" />
      </div>
    );
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {currentContent.processing}
          </h1>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          {getPlanIcon()}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {currentContent.subtitle}
          </p>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-4">
            <p className="text-lg font-semibold text-gray-800 flex items-center justify-center space-x-2">
              <span>{currentContent.welcome}</span>
              <span className={`${planType === 'premium' ? 'text-purple-600' : 'text-green-600'}`}>
                {getPlanName()}
              </span>
              {planType === 'premium' && <Crown className="w-5 h-5 text-yellow-500" />}
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {currentContent.message}
          </p>
        </div>

        {/* Features List */}
        <div className={`${planType === 'premium' 
          ? 'bg-gradient-to-r from-purple-50 to-blue-50' 
          : 'bg-gradient-to-r from-green-50 to-blue-50'
        } rounded-xl p-6 mb-8`}>
          <div className="flex items-center space-x-2 mb-4">
            {planType === 'premium' ? (
              <Crown className="w-6 h-6 text-purple-600" />
            ) : (
              <Star className="w-6 h-6 text-green-600" />
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {currentContent.features}
            </h2>
          </div>
          <ul className="space-y-3">
            {getFeatures().map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className={`w-6 h-6 ${planType === 'premium' 
                  ? 'bg-purple-500' 
                  : 'bg-green-500'
                } rounded-full flex items-center justify-center`}>
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className={`inline-flex items-center space-x-2 ${planType === 'premium'
              ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
            } text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentContent.backToApp}</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute top-4 left-4 w-20 h-20 ${planType === 'premium' 
          ? 'bg-purple-200' 
          : 'bg-green-200'
        } rounded-full opacity-20 animate-pulse`}></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;