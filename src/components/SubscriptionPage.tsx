import React, { useState, useEffect } from 'react';
import { ArrowLeft, Crown, Check, Loader2, CreditCard, Calendar, Star, Zap } from 'lucide-react';
import { stripeProducts, type StripeProduct } from '../stripe-config';

interface SubscriptionPageProps {
  language: 'th' | 'en';
  onBack: () => void;
  user: any;
}

interface Subscription {
  subscription_status: string;
  price_id: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

const content = {
  th: {
    title: 'แผนการสมาชิก',
    subtitle: 'เลือกแผนที่เหมาะสมกับคุณ',
    currentPlan: 'แผนปัจจุบัน',
    subscribe: 'สมัครสมาชิก',
    loading: 'กำลังโหลด...',
    processing: 'กำลังดำเนินการ...',
    back: 'กลับ',
    features: 'คุณสมบัติ',
    noSubscription: 'ยังไม่มีการสมัครสมาชิก',
    renewsOn: 'ต่ออายุในวันที่',
    canceledOn: 'ยกเลิกในวันที่',
    mostPopular: 'ยอดนิยม',
    upgrade: 'อัพเกรด',
    status: {
      active: 'ใช้งานอยู่',
      canceled: 'ยกเลิกแล้ว',
      past_due: 'ค้างชำระ',
      incomplete: 'ไม่สมบูรณ์',
      trialing: 'ทดลองใช้',
      not_started: 'ยังไม่เริ่ม'
    },
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
    title: 'Subscription Plans',
    subtitle: 'Choose the plan that works for you',
    currentPlan: 'Current Plan',
    subscribe: 'Subscribe',
    loading: 'Loading...',
    processing: 'Processing...',
    back: 'Back',
    features: 'Features',
    noSubscription: 'No active subscription',
    renewsOn: 'Renews on',
    canceledOn: 'Canceled on',
    mostPopular: 'Most Popular',
    upgrade: 'Upgrade',
    status: {
      active: 'Active',
      canceled: 'Canceled',
      past_due: 'Past Due',
      incomplete: 'Incomplete',
      trialing: 'Trialing',
      not_started: 'Not Started'
    },
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

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ language, onBack, user }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPriceId, setProcessingPriceId] = useState<string | null>(null);

  const currentContent = content[language];

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
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
          setSubscription(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (product: StripeProduct) => {
    setProcessingPriceId(product.priceId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/subscription-success`,
          cancel_url: `${window.location.origin}/subscription`
        })
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Error creating checkout session:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcessingPriceId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US');
  };

  const getCurrentProduct = () => {
    if (!subscription?.price_id) return null;
    return stripeProducts.find(p => p.priceId === subscription.price_id);
  };

  const isCurrentPlan = (priceId: string) => {
    return subscription?.price_id === priceId && subscription?.subscription_status === 'active';
  };

  const getFeatures = (productName: string) => {
    if (productName === 'Pro Plan') {
      return currentContent.proFeatures;
    } else if (productName === 'Premium Plan') {
      return currentContent.premiumFeatures;
    }
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{currentContent.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentContent.back}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-gray-600">
              {currentContent.subtitle}
            </p>
          </div>

          {/* Current Subscription Status */}
          {subscription && (
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                {currentContent.currentPlan}
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {getCurrentProduct()?.name || 'Unknown Plan'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentContent.status[subscription.subscription_status as keyof typeof currentContent.status] || subscription.subscription_status}
                  </p>
                </div>
                {subscription.current_period_end && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {subscription.cancel_at_period_end ? currentContent.canceledOn : currentContent.renewsOn}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(subscription.current_period_end)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {stripeProducts.filter(p => p.mode === 'subscription').map((product, index) => (
              <div
                key={product.priceId}
                className={`relative border-2 rounded-xl p-6 transition-all ${
                  isCurrentPlan(product.priceId)
                    ? 'border-green-500 bg-green-50'
                    : product.name === 'Premium Plan'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Most Popular Badge */}
                {product.name === 'Premium Plan' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{currentContent.mostPopular}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <span>{product.name}</span>
                      {product.name === 'Premium Plan' && <Crown className="w-5 h-5 text-yellow-500" />}
                    </h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                    {product.currency && (
                      <p className="text-sm text-gray-600">{product.currency}</p>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">{currentContent.features}:</h4>
                  <ul className="space-y-2">
                    {getFeatures(product.name).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSubscribe(product)}
                  disabled={isCurrentPlan(product.priceId) || processingPriceId === product.priceId}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    isCurrentPlan(product.priceId)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : product.name === 'Premium Plan'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
                      : 'bg-black text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                >
                  {processingPriceId === product.priceId ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{currentContent.processing}</span>
                    </>
                  ) : isCurrentPlan(product.priceId) ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{currentContent.currentPlan}</span>
                    </>
                  ) : (
                    <>
                      {product.name === 'Premium Plan' && <Zap className="w-5 h-5" />}
                      <span>{currentContent.subscribe}</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {!subscription && (
            <div className="text-center mt-8 p-6 bg-gray-50 rounded-xl">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">{currentContent.noSubscription}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;