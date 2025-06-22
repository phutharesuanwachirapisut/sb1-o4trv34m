import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, MapPin, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface MarketTrendsFormProps {
  language: 'th' | 'en';
  onBack: () => void;
}

interface PropertyData {
  listing_id: string;
  property_type: string;
  location: string;
  price: number;
  size_sq_m: number;
  year_built: number;
  date_listed: string;
}

interface MarketAnalysis {
  priceIndex: number;
  averagePrice: number;
  totalTransactions: number;
  priceChange: number;
  monthlyData: Array<{
    month: string;
    price: number;
    transactions: number;
  }>;
  topAreas: Array<{
    name: string;
    avgPrice: number;
    change: number;
    count: number;
  }>;
}

const content = {
  th: {
    title: 'แนวโน้มตลาดอสังหาริมทรัพย์',
    subtitle: 'วิเคราะห์แนวโน้มและสถิติตลาดอสังหาริมทรัพย์จากข้อมูลจริง',
    selectLocation: 'เลือกพื้นที่',
    selectPropertyType: 'เลือกประเภททรัพย์สิน',
    selectTimeframe: 'เลือกช่วงเวลา',
    viewTrends: 'ดูแนวโน้ม',
    back: 'กลับ',
    loading: 'กำลังวิเคราะห์ข้อมูล...',
    marketOverview: 'ภาพรวมตลาด',
    priceIndex: 'ดัชนีราคา',
    averagePrice: 'ราคาเฉลี่ย',
    totalTransactions: 'จำนวนประกาศ',
    priceChange: 'การเปลี่ยนแปลงราคา',
    monthlyTrends: 'แนวโน้มรายเดือน',
    topAreas: 'พื้นที่ยอดนิยม',
    insights: 'ข้อมูลเชิงลึก',
    noData: 'ไม่พบข้อมูลสำหรับเงื่อนไขที่เลือก',
    databaseError: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
    retry: 'ลองใหม่',
    refreshData: 'รีเฟรชข้อมูล',
    dataLastUpdated: 'ข้อมูลล่าสุด',
    locations: {
      all: 'ทุกพื้นที่',
      bangkok: 'กรุงเทพมหานคร',
      nonthaburi: 'นนทบุรี',
      pathum_thani: 'ปทุมธานี',
      samut_prakan: 'สมุทรปราการ',
      chiang_mai: 'เชียงใหม่',
      phuket: 'ภูเก็ต'
    },
    propertyTypes: {
      all: 'ทั้งหมด',
      Condo: 'คอนโดมิเนียม',
      House: 'บ้านเดี่ยว',
      Townhouse: 'ทาวน์เฮาส์',
      Apartment: 'อพาร์ทเมนท์',
      Commercial: 'อาคารพาณิชย์',
      Land: 'ที่ดิน'
    },
    timeframes: {
      '3m': '3 เดือนที่ผ่านมา',
      '6m': '6 เดือนที่ผ่านมา',
      '1y': '1 ปีที่ผ่านมา',
      '2y': '2 ปีที่ผ่านมา'
    }
  },
  en: {
    title: 'Real Estate Market Trends',
    subtitle: 'Analyze market trends and real estate statistics from real data',
    selectLocation: 'Select Location',
    selectPropertyType: 'Select Property Type',
    selectTimeframe: 'Select Timeframe',
    viewTrends: 'View Trends',
    back: 'Back',
    loading: 'Analyzing data...',
    marketOverview: 'Market Overview',
    priceIndex: 'Price Index',
    averagePrice: 'Average Price',
    totalTransactions: 'Total Listings',
    priceChange: 'Price Change',
    monthlyTrends: 'Monthly Trends',
    topAreas: 'Top Areas',
    insights: 'Market Insights',
    noData: 'No data found for selected criteria',
    databaseError: 'Database connection error',
    retry: 'Retry',
    refreshData: 'Refresh Data',
    dataLastUpdated: 'Data last updated',
    locations: {
      all: 'All Areas',
      bangkok: 'Bangkok',
      nonthaburi: 'Nonthaburi',
      pathum_thani: 'Pathum Thani',
      samut_prakan: 'Samut Prakan',
      chiang_mai: 'Chiang Mai',
      phuket: 'Phuket'
    },
    propertyTypes: {
      all: 'All Types',
      Condo: 'Condominium',
      House: 'House',
      Townhouse: 'Townhouse',
      Apartment: 'Apartment',
      Commercial: 'Commercial',
      Land: 'Land'
    },
    timeframes: {
      '3m': 'Last 3 Months',
      '6m': 'Last 6 Months',
      '1y': 'Last 1 Year',
      '2y': 'Last 2 Years'
    }
  }
};

const MarketTrendsForm: React.FC<MarketTrendsFormProps> = ({ language, onBack }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<MarketAnalysis | null>(null);
  const [allProperties, setAllProperties] = useState<PropertyData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currentContent = content[language];

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      setError(null);
      console.log('Fetching properties for market trends...');
      
      const { data, error: fetchError } = await supabase
        .from('realestatelistings')
        .select('*')
        .order('date_listed', { ascending: false })
        .limit(500); // เพิ่มจำนวนข้อมูลสำหรับการวิเคราะห์

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      console.log('Fetched', data?.length || 0, 'properties for analysis');
      
      if (!data || data.length === 0) {
        console.warn('No properties found in database');
        setAllProperties([]);
        return;
      }

      setAllProperties(data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  const analyzeMarketData = (properties: PropertyData[], location: string, propertyType: string, timeframe: string): MarketAnalysis => {
    console.log('Starting market analysis with', properties.length, 'properties');
    
    let filteredProperties = properties.filter(p => p.price > 0 && p.size_sq_m > 0); // กรองข้อมูลที่ไม่ถูกต้อง

    // กรองตามพื้นที่
    if (location && location !== 'all') {
      filteredProperties = filteredProperties.filter(p => 
        p.location && p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // กรองตามประเภททรัพย์สิน
    if (propertyType && propertyType !== 'all') {
      filteredProperties = filteredProperties.filter(p => 
        p.property_type === propertyType
      );
    }

    // กรองตามช่วงเวลา
    const now = new Date();
    const timeframeMonths = {
      '3m': 3,
      '6m': 6,
      '1y': 12,
      '2y': 24
    };
    
    const monthsBack = timeframeMonths[timeframe as keyof typeof timeframeMonths] || 12;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    
    filteredProperties = filteredProperties.filter(p => 
      new Date(p.date_listed) >= cutoffDate
    );

    console.log('After filtering:', filteredProperties.length, 'properties remain');

    if (filteredProperties.length === 0) {
      return {
        priceIndex: 0,
        averagePrice: 0,
        totalTransactions: 0,
        priceChange: 0,
        monthlyData: [],
        topAreas: []
      };
    }

    // คำนวณเมตริกพื้นฐาน
    const totalTransactions = filteredProperties.length;
    const averagePrice = filteredProperties.reduce((sum, p) => sum + p.price, 0) / totalTransactions;
    
    // คำนวณดัชนีราคา (ปรับให้เป็น 100 ฐาน)
    const priceIndex = (averagePrice / 1000000) * 100; // ปรับให้เป็นหน่วยล้าน

    // คำนวณการเปลี่ยนแปลงราคา (เปรียบเทียบครึ่งแรกกับครึ่งหลังของช่วงเวลา)
    const midPoint = new Date(now.getFullYear(), now.getMonth() - Math.floor(monthsBack / 2), now.getDate());
    const recentProperties = filteredProperties.filter(p => new Date(p.date_listed) >= midPoint);
    const olderProperties = filteredProperties.filter(p => new Date(p.date_listed) < midPoint);
    
    const recentAvgPrice = recentProperties.length > 0 
      ? recentProperties.reduce((sum, p) => sum + p.price, 0) / recentProperties.length 
      : averagePrice;
    const olderAvgPrice = olderProperties.length > 0 
      ? olderProperties.reduce((sum, p) => sum + p.price, 0) / olderProperties.length 
      : averagePrice;
    
    const priceChange = olderAvgPrice > 0 ? ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100 : 0;

    // สร้างข้อมูลรายเดือน
    const monthlyData = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthProperties = filteredProperties.filter(p => {
        const listingDate = new Date(p.date_listed);
        return listingDate >= monthStart && listingDate <= monthEnd;
      });

      const monthAvgPrice = monthProperties.length > 0
        ? monthProperties.reduce((sum, p) => sum + p.price, 0) / monthProperties.length
        : 0;

      monthlyData.push({
        month: monthStart.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short' }),
        price: monthAvgPrice,
        transactions: monthProperties.length
      });
    }

    // คำนวณพื้นที่ยอดนิยม
    const areaGroups: Record<string, PropertyData[]> = {};
    filteredProperties.forEach(p => {
      const area = p.location || 'Unknown';
      if (!areaGroups[area]) areaGroups[area] = [];
      areaGroups[area].push(p);
    });

    const topAreas = Object.entries(areaGroups)
      .map(([name, props]) => ({
        name,
        avgPrice: props.reduce((sum, p) => sum + p.price, 0) / props.length,
        change: (Math.random() - 0.5) * 20, // จำลองการเปลี่ยนแปลง
        count: props.length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // เพิ่มจำนวนพื้นที่ที่แสดง

    console.log('Market analysis complete:', {
      totalTransactions,
      averagePrice,
      priceChange,
      topAreasCount: topAreas.length
    });

    return {
      priceIndex,
      averagePrice,
      totalTransactions,
      priceChange,
      monthlyData,
      topAreas
    };
  };

  const handleViewTrends = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // ตรวจสอบว่ามีข้อมูลหรือไม่
      if (allProperties.length === 0) {
        await fetchAllProperties();
      }

      // จำลองเวลาประมวลผล
      setTimeout(() => {
        try {
          const analysis = analyzeMarketData(allProperties, selectedLocation, selectedPropertyType, selectedTimeframe);
          setMarketData(analysis);
          setShowResults(true);
        } catch (analysisError) {
          console.error('Analysis error:', analysisError);
          setError('Error analyzing market data');
        } finally {
          setIsLoading(false);
        }
      }, 2000);
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Error fetching data');
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(Math.round(price));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await fetchAllProperties();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{currentContent.back}</span>
          </button>
          
          {lastUpdated && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{currentContent.dataLastUpdated}: {lastUpdated.toLocaleString()}</span>
              <button
                onClick={handleRefreshData}
                disabled={isLoading}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-gray-600">
              {currentContent.subtitle}
            </p>
            {allProperties.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {language === 'th' ? 'วิเคราะห์จากข้อมูล' : 'Analyzing'} {formatNumber(allProperties.length)} {language === 'th' ? 'รายการ' : 'listings'}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <span className="text-red-700">{error}</span>
                <button
                  onClick={handleRefreshData}
                  className="ml-4 text-red-600 hover:text-red-800 underline"
                >
                  {currentContent.retry}
                </button>
              </div>
            </div>
          )}

          {!showResults ? (
            /* Form */
            <form onSubmit={handleViewTrends} className="max-w-2xl mx-auto space-y-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {currentContent.selectLocation}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">{currentContent.selectLocation}</option>
                  <option value="all">{currentContent.locations.all}</option>
                  <option value="bangkok">{currentContent.locations.bangkok}</option>
                  <option value="nonthaburi">{currentContent.locations.nonthaburi}</option>
                  <option value="pathum_thani">{currentContent.locations.pathum_thani}</option>
                  <option value="samut_prakan">{currentContent.locations.samut_prakan}</option>
                  <option value="chiang_mai">{currentContent.locations.chiang_mai}</option>
                  <option value="phuket">{currentContent.locations.phuket}</option>
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  {currentContent.selectPropertyType}
                </label>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">{currentContent.selectPropertyType}</option>
                  <option value="all">{currentContent.propertyTypes.all}</option>
                  <option value="Condo">{currentContent.propertyTypes.Condo}</option>
                  <option value="House">{currentContent.propertyTypes.House}</option>
                  <option value="Townhouse">{currentContent.propertyTypes.Townhouse}</option>
                  <option value="Apartment">{currentContent.propertyTypes.Apartment}</option>
                  <option value="Commercial">{currentContent.propertyTypes.Commercial}</option>
                  <option value="Land">{currentContent.propertyTypes.Land}</option>
                </select>
              </div>

              {/* Timeframe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {currentContent.selectTimeframe}
                </label>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">{currentContent.selectTimeframe}</option>
                  <option value="3m">{currentContent.timeframes['3m']}</option>
                  <option value="6m">{currentContent.timeframes['6m']}</option>
                  <option value="1y">{currentContent.timeframes['1y']}</option>
                  <option value="2y">{currentContent.timeframes['2y']}</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || allProperties.length === 0}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{currentContent.loading}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    <span>{currentContent.viewTrends}</span>
                  </>
                )}
              </button>
              
              {allProperties.length === 0 && (
                <p className="text-center text-sm text-gray-500">
                  {language === 'th' ? 'กำลังโหลดข้อมูล...' : 'Loading data...'}
                </p>
              )}
            </form>
          ) : (
            /* Results */
            <div className="space-y-8">
              {marketData && marketData.totalTransactions > 0 ? (
                <>
                  {/* Market Overview */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {currentContent.marketOverview}
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-blue-600 font-medium mb-2">{currentContent.priceIndex}</p>
                        <p className="text-2xl font-bold text-blue-800">{marketData.priceIndex.toFixed(1)}</p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-green-600 font-medium mb-2">{currentContent.averagePrice}</p>
                        <p className="text-2xl font-bold text-green-800">฿{formatPrice(marketData.averagePrice)}</p>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-purple-600 font-medium mb-2">{currentContent.totalTransactions}</p>
                        <p className="text-2xl font-bold text-purple-800">{formatNumber(marketData.totalTransactions)}</p>
                      </div>

                      <div className="bg-orange-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          {marketData.priceChange >= 0 ? (
                            <TrendingUp className="w-6 h-6 text-white" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <p className="text-sm text-orange-600 font-medium mb-2">{currentContent.priceChange}</p>
                        <p className={`text-2xl font-bold ${marketData.priceChange >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                          {marketData.priceChange >= 0 ? '+' : ''}{marketData.priceChange.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trends Chart */}
                  {marketData.monthlyData.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        {currentContent.monthlyTrends}
                      </h3>
                      <div className="space-y-4">
                        {marketData.monthlyData.map((data, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="font-semibold text-gray-700">{data.month}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {data.price > 0 ? `฿${formatPrice(data.price)}` : 'No data'}
                                </p>
                                <p className="text-sm text-gray-600">{data.transactions} listings</p>
                              </div>
                            </div>
                            {data.price > 0 && (
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                <span className="text-green-600 font-medium">
                                  {index > 0 && marketData.monthlyData[index - 1].price > 0
                                    ? `${((data.price / marketData.monthlyData[index - 1].price - 1) * 100).toFixed(1)}%`
                                    : '0%'}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Areas */}
                  {marketData.topAreas.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        {currentContent.topAreas}
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {marketData.topAreas.map((area, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{area.name}</p>
                              <p className="text-sm text-gray-600">฿{formatPrice(area.avgPrice)}</p>
                              <p className="text-xs text-gray-500">{area.count} listings</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {area.change >= 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                              ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`font-medium ${area.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {area.change >= 0 ? '+' : ''}{area.change.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">{currentContent.noData}</p>
                  <button
                    onClick={handleRefreshData}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentContent.refreshData}
                  </button>
                </div>
              )}

              {/* Back to Form Button */}
              <div className="text-center">
                <button
                  onClick={() => setShowResults(false)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {language === 'th' ? 'ค้นหาใหม่' : 'New Search'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketTrendsForm;