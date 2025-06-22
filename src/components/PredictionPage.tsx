import React, { useState } from 'react';
import { ArrowLeft, MapPin, Home, Bed, Bath, Car, Calculator, TrendingUp, BarChart3, AlertCircle, Loader2, Sofa } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface PredictionPageProps {
  language: 'th' | 'en';
  onBack: () => void;
}

interface RealEstateListing {
  listing_id: string;
  property_type: string;
  location: string;
  latitude: number;
  longitude: number;
  price: number;
  size_sq_m: number;
  furnished: string;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  date_listed: string;
}

interface PredictionResult {
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  confidence: number;
  factors: {
    location: number;
    size: number;
    age: number;
    amenities: number;
    furnished: number;
  };
  comparableProperties: RealEstateListing[];
  marketInsights: {
    averagePricePerSqm: number;
    totalListings: number;
    priceGrowth: number;
    marketTrend: 'increasing' | 'decreasing' | 'stable';
  };
}

// Complete list of Thai provinces
const thailandProvinces = {
  th: [
    'กรุงเทพมหานคร',
    'กระบี่',
    'กาญจนบุรี',
    'กาฬสินธุ์',
    'กำแพงเพชร',
    'ขอนแก่น',
    'จันทบุรี',
    'ฉะเชิงเทรา',
    'ชลบุรี',
    'ชัยนาท',
    'ชัยภูมิ',
    'ชุมพร',
    'เชียงราย',
    'เชียงใหม่',
    'ตรัง',
    'ตราด',
    'ตาก',
    'นครนายก',
    'นครปฐม',
    'นครพนม',
    'นครราชสีมา',
    'นครศรีธรรมราช',
    'นครสวรรค์',
    'นนทบุรี',
    'นราธิวาส',
    'น่าน',
    'บึงกาฬ',
    'บุรีรัมย์',
    'ปทุมธานี',
    'ประจวบคีรีขันธ์',
    'ปราจีนบุรี',
    'ปัตตานี',
    'พระนครศรีอยุธยา',
    'พังงา',
    'พัทลุง',
    'พิจิตร',
    'พิษณุโลก',
    'เพชรบุรี',
    'เพชรบูรณ์',
    'แพร่',
    'ภูเก็ต',
    'มหาสารคาม',
    'มุกดาหาร',
    'แม่ฮ่องสอน',
    'ยโสธร',
    'ยะลา',
    'ร้อยเอ็ด',
    'ระนอง',
    'ระยอง',
    'ราชบุรี',
    'ลพบุรี',
    'ลำปาง',
    'ลำพูน',
    'เลย',
    'ศรีสะเกษ',
    'สกลนคร',
    'สงขลา',
    'สตูล',
    'สมุทรปราการ',
    'สมุทรสงคราม',
    'สมุทรสาคร',
    'สระแก้ว',
    'สระบุรี',
    'สิงห์บุรี',
    'สุโขทัย',
    'สุพรรณบุรี',
    'สุราษฎร์ธานี',
    'สุรินทร์',
    'หนองคาย',
    'หนองบัวลำภู',
    'อ่างทอง',
    'อำนาจเจริญ',
    'อุดรธานี',
    'อุตรดิตถ์',
    'อุทัยธานี',
    'อุบลราชธานี'
  ],
  en: [
    'Bangkok',
    'Krabi',
    'Kanchanaburi',
    'Kalasin',
    'Kamphaeng Phet',
    'Khon Kaen',
    'Chanthaburi',
    'Chachoengsao',
    'Chonburi',
    'Chai Nat',
    'Chaiyaphum',
    'Chumphon',
    'Chiang Rai',
    'Chiang Mai',
    'Trang',
    'Trat',
    'Tak',
    'Nakhon Nayok',
    'Nakhon Pathom',
    'Nakhon Phanom',
    'Nakhon Ratchasima',
    'Nakhon Si Thammarat',
    'Nakhon Sawan',
    'Nonthaburi',
    'Narathiwat',
    'Nan',
    'Bueng Kan',
    'Buriram',
    'Pathum Thani',
    'Prachuap Khiri Khan',
    'Prachinburi',
    'Pattani',
    'Phra Nakhon Si Ayutthaya',
    'Phang Nga',
    'Phatthalung',
    'Phichit',
    'Phitsanulok',
    'Phetchaburi',
    'Phetchabun',
    'Phrae',
    'Phuket',
    'Maha Sarakham',
    'Mukdahan',
    'Mae Hong Son',
    'Yasothon',
    'Yala',
    'Roi Et',
    'Ranong',
    'Rayong',
    'Ratchaburi',
    'Lopburi',
    'Lampang',
    'Lamphun',
    'Loei',
    'Sisaket',
    'Sakon Nakhon',
    'Songkhla',
    'Satun',
    'Samut Prakan',
    'Samut Songkhram',
    'Samut Sakhon',
    'Sa Kaeo',
    'Saraburi',
    'Sing Buri',
    'Sukhothai',
    'Suphan Buri',
    'Surat Thani',
    'Surin',
    'Nong Khai',
    'Nong Bua Lam Phu',
    'Ang Thong',
    'Amnat Charoen',
    'Udon Thani',
    'Uttaradit',
    'Uthai Thani',
    'Ubon Ratchathani'
  ]
};

const content = {
  th: {
    title: 'ทำนายราคาอสังหาริมทรัพย์',
    subtitle: 'กรอกข้อมูลทรัพย์สินเพื่อประเมินราคาจากข้อมูลตลาดจริง',
    propertyType: 'ประเภททรัพย์สิน',
    location: 'จังหวัด',
    area: 'พื้นที่ (ตร.ม.)',
    bedrooms: 'ห้องนอน',
    bathrooms: 'ห้องน้ำ',
    parking: 'ที่จอดรถ',
    age: 'อายุอาคาร (ปี)',
    yearBuilt: 'ปีที่สร้าง',
    furnished: 'เฟอร์นิเจอร์',
    floor: 'ชั้น',
    predictButton: 'ทำนายราคา',
    back: 'กลับ',
    result: 'ผลการทำนาย',
    estimatedPrice: 'ราคาประเมิน',
    priceRange: 'ช่วงราคา',
    confidence: 'ความเชื่อมั่น',
    factors: 'ปัจจัยที่มีผลต่อราคา',
    locationFactor: 'ที่ตั้ง',
    sizeFactor: 'ขนาด',
    ageFactor: 'อายุอาคาร',
    amenitiesFactor: 'สิ่งอำนวยความสะดวก',
    furnishedFactor: 'เฟอร์นิเจอร์',
    marketInsights: 'ข้อมูลเชิงลึกตลาด',
    averagePricePerSqm: 'ราคาเฉลี่ยต่อตร.ม.',
    totalListings: 'จำนวนประกาศทั้งหมด',
    priceGrowth: 'การเติบโตของราคา',
    marketTrend: 'แนวโน้มตลาด',
    comparableProperties: 'อสังหาริมทรัพย์ที่เปรียบเทียบได้',
    analyzing: 'กำลังวิเคราะห์ข้อมูลตลาด...',
    noDataFound: 'ไม่พบข้อมูลในพื้นที่นี้',
    databaseError: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล',
    retry: 'ลองใหม่',
    selectLocation: 'เลือกจังหวัด',
    propertyTypes: {
      Condo: 'คอนโดมิเนียม',
      House: 'บ้านเดี่ยว',
      Townhouse: 'ทาวน์เฮาส์',
      Apartment: 'อพาร์ทเมนท์',
      Commercial: 'อาคารพาณิชย์',
      Land: 'ที่ดิน'
    },
    furnishedOptions: {
      Yes: 'มีเฟอร์นิเจอร์',
      No: 'ไม่มีเฟอร์นิเจอร์',
      Partial: 'เฟอร์นิเจอร์บางส่วน'
    },
    trends: {
      increasing: 'เพิ่มขึ้น',
      decreasing: 'ลดลง',
      stable: 'คงที่'
    }
  },
  en: {
    title: 'Property Price Prediction',
    subtitle: 'Enter property details to get price estimation based on real market data',
    propertyType: 'Property Type',
    location: 'Province',
    area: 'Area (sqm)',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    parking: 'Parking Spaces',
    age: 'Building Age (years)',
    yearBuilt: 'Year Built',
    furnished: 'Furnished',
    floor: 'Floor',
    predictButton: 'Predict Price',
    back: 'Back',
    result: 'Prediction Result',
    estimatedPrice: 'Estimated Price',
    priceRange: 'Price Range',
    confidence: 'Confidence',
    factors: 'Price Factors',
    locationFactor: 'Location',
    sizeFactor: 'Size',
    ageFactor: 'Building Age',
    amenitiesFactor: 'Amenities',
    furnishedFactor: 'Furnished Status',
    marketInsights: 'Market Insights',
    averagePricePerSqm: 'Average Price per sqm',
    totalListings: 'Total Listings',
    priceGrowth: 'Price Growth',
    marketTrend: 'Market Trend',
    comparableProperties: 'Comparable Properties',
    analyzing: 'Analyzing market data...',
    noDataFound: 'No data found for this area',
    databaseError: 'Database connection error',
    retry: 'Retry',
    selectLocation: 'Select Province',
    propertyTypes: {
      Condo: 'Condominium',
      House: 'House',
      Townhouse: 'Townhouse',
      Apartment: 'Apartment',
      Commercial: 'Commercial',
      Land: 'Land'
    },
    furnishedOptions: {
      Yes: 'Furnished',
      No: 'Unfurnished',
      Partial: 'Partially Furnished'
    },
    trends: {
      increasing: 'Increasing',
      decreasing: 'Decreasing',
      stable: 'Stable'
    }
  }
};

const PredictionPage: React.FC<PredictionPageProps> = ({ language, onBack }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    furnished: ''
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentContent = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const fetchMarketData = async () => {
    try {
      console.log('Fetching market data from Supabase...');
      
      const { data, error } = await supabase
        .from('realestatelistings')
        .select('*')
        .order('date_listed', { ascending: false })
        .limit(200);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Market data fetched:', data?.length || 0, 'records');
      
      if (!data || data.length === 0) {
        throw new Error('No market data available');
      }

      return data as RealEstateListing[];
    } catch (err) {
      console.error('Error fetching market data:', err);
      throw err;
    }
  };

  const analyzeMarketData = (
    marketData: RealEstateListing[],
    userInput: typeof formData
  ): PredictionResult => {
    console.log('Analyzing market data with', marketData.length, 'properties');
    
    // Filter comparable properties
    const comparableProperties = marketData.filter(property => {
      const locationMatch = property.location?.toLowerCase().includes(userInput.location.toLowerCase());
      const typeMatch = property.property_type?.toLowerCase() === userInput.propertyType.toLowerCase();
      const sizeRange = Math.abs(property.size_sq_m - parseFloat(userInput.area)) <= 100;
      const furnishedMatch = property.furnished === userInput.furnished;
      
      return locationMatch || typeMatch || sizeRange || furnishedMatch;
    }).slice(0, 10);

    console.log('Found', comparableProperties.length, 'comparable properties');

    // Calculate market insights
    const locationProperties = marketData.filter(p => 
      p.location?.toLowerCase().includes(userInput.location.toLowerCase())
    );

    console.log('Found', locationProperties.length, 'properties in location');

    const validProperties = locationProperties.filter(p => p.price > 0 && p.size_sq_m > 0);
    const averagePricePerSqm = validProperties.length > 0
      ? validProperties.reduce((sum, p) => sum + (p.price / p.size_sq_m), 0) / validProperties.length
      : 50000;

    const totalListings = locationProperties.length;

    // Calculate price growth based on year built
    const recentProperties = validProperties.filter(p => p.year_built >= 2020);
    const olderProperties = validProperties.filter(p => p.year_built < 2020);
    
    const recentAvgPrice = recentProperties.length > 0
      ? recentProperties.reduce((sum, p) => sum + (p.price / p.size_sq_m), 0) / recentProperties.length
      : averagePricePerSqm;
    
    const olderAvgPrice = olderProperties.length > 0
      ? olderProperties.reduce((sum, p) => sum + (p.price / p.size_sq_m), 0) / olderProperties.length
      : averagePricePerSqm;

    const priceGrowth = olderAvgPrice > 0 
      ? ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100
      : 5;

    const marketTrend: 'increasing' | 'decreasing' | 'stable' = 
      priceGrowth > 3 ? 'increasing' : priceGrowth < -3 ? 'decreasing' : 'stable';

    // Calculate estimated price
    const basePrice = averagePricePerSqm * parseFloat(userInput.area);
    
    // Apply multipliers
    const locationMultiplier = getLocationMultiplier(userInput.location);
    const propertyTypeMultiplier = getPropertyTypeMultiplier(userInput.propertyType);
    const ageMultiplier = getAgeMultiplier(new Date().getFullYear() - (parseFloat(userInput.yearBuilt) || new Date().getFullYear()));
    const amenitiesMultiplier = getAmenitiesMultiplier(
      parseFloat(userInput.bedrooms) || 0,
      parseFloat(userInput.bathrooms) || 0
    );
    const furnishedMultiplier = getFurnishedMultiplier(userInput.furnished);

    const estimatedPrice = basePrice * locationMultiplier * propertyTypeMultiplier * ageMultiplier * amenitiesMultiplier * furnishedMultiplier;

    // Calculate confidence based on data availability
    const confidence = Math.min(95, 60 + (comparableProperties.length * 5) + (totalListings > 10 ? 20 : totalListings));

    console.log('Analysis complete:', {
      estimatedPrice,
      confidence,
      comparableCount: comparableProperties.length,
      totalListings
    });

    return {
      estimatedPrice,
      priceRange: {
        min: estimatedPrice * 0.85,
        max: estimatedPrice * 1.15
      },
      confidence,
      factors: {
        location: locationMultiplier * 25,
        size: 20,
        age: (2 - ageMultiplier) * 25,
        amenities: (amenitiesMultiplier - 1) * 100 + 15,
        furnished: (furnishedMultiplier - 1) * 100 + 10
      },
      comparableProperties,
      marketInsights: {
        averagePricePerSqm: Math.round(averagePricePerSqm),
        totalListings,
        priceGrowth: Math.round(priceGrowth * 10) / 10,
        marketTrend
      }
    };
  };

  const getLocationMultiplier = (location: string): number => {
    const multipliers: Record<string, number> = {
      // Major economic centers
      'กรุงเทพมหานคร': 1.5, 'bangkok': 1.5,
      'นนทบุรี': 1.3, 'nonthaburi': 1.3,
      'ปทุมธานี': 1.25, 'pathum thani': 1.25,
      'สมุทรปราการ': 1.2, 'samut prakan': 1.2,
      'ชลบุรี': 1.15, 'chonburi': 1.15,
      'ระยอง': 1.1, 'rayong': 1.1,
      
      // Tourist destinations
      'ภูเก็ต': 1.4, 'phuket': 1.4,
      'เชียงใหม่': 1.2, 'chiang mai': 1.2,
      'กระบี่': 1.15, 'krabi': 1.15,
      'สุราษฎร์ธานี': 1.1, 'surat thani': 1.1,
      'ประจวบคีรีขันธ์': 1.05, 'prachuap khiri khan': 1.05,
      
      // Regional centers
      'นครราชสีมา': 1.0, 'nakhon ratchasima': 1.0,
      'ขอนแก่น': 0.95, 'khon kaen': 0.95,
      'อุดรธานี': 0.9, 'udon thani': 0.9,
      'หาดใหญ่': 0.95, 'hat yai': 0.95,
      'สงขลา': 0.95, 'songkhla': 0.95
    };
    
    const locationKey = location.toLowerCase();
    return multipliers[locationKey] || 0.85; // Default for other provinces
  };

  const getPropertyTypeMultiplier = (propertyType: string): number => {
    const multipliers: Record<string, number> = {
      Condo: 1.1,
      House: 1.05,
      Townhouse: 1.0,
      Apartment: 0.95,
      Commercial: 1.2,
      Land: 0.8
    };
    return multipliers[propertyType] || 1.0;
  };

  const getAgeMultiplier = (age: number): number => {
    if (age <= 5) return 1.1;
    if (age <= 10) return 1.0;
    if (age <= 20) return 0.95;
    return 0.9;
  };

  const getAmenitiesMultiplier = (bedrooms: number, bathrooms: number): number => {
    let multiplier = 1.0;
    if (bedrooms >= 3) multiplier += 0.05;
    if (bathrooms >= 2) multiplier += 0.03;
    return multiplier;
  };

  const getFurnishedMultiplier = (furnished: string): number => {
    const multipliers: Record<string, number> = {
      Yes: 1.1,
      Partial: 1.05,
      No: 1.0
    };
    return multipliers[furnished] || 1.0;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Starting prediction with form data:', formData);
      
      const marketData = await fetchMarketData();
      
      if (marketData.length === 0) {
        setError(currentContent.noDataFound);
        setIsLoading(false);
        return;
      }

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = analyzeMarketData(marketData, formData);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage.includes('Database') ? currentContent.databaseError : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(Math.round(price));
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('th-TH').format(num);
  };

  const getPropertyTypes = () => {
    return Object.keys(currentContent.propertyTypes);
  };

  const getProvinces = () => {
    return thailandProvinces[language];
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-gray-600">
              {currentContent.subtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <span className="text-red-700">{error}</span>
                {error.includes('Database') && (
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-4 text-red-600 hover:text-red-800 underline"
                  >
                    {currentContent.retry}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <form onSubmit={handlePredict} className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Home className="w-4 h-4 inline mr-2" />
                    {currentContent.propertyType}
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">Select property type</option>
                    {getPropertyTypes().map(type => (
                      <option key={type} value={type}>
                        {currentContent.propertyTypes[type as keyof typeof currentContent.propertyTypes]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {currentContent.location}
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">{currentContent.selectLocation}</option>
                    {getProvinces().map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.area}
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., 50"
                    required
                    min="1"
                  />
                </div>

                {/* Furnished */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Sofa className="w-4 h-4 inline mr-2" />
                    {currentContent.furnished}
                  </label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => handleInputChange('furnished', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="">Select furnished status</option>
                    {Object.entries(currentContent.furnishedOptions).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Bed className="w-4 h-4 inline mr-2" />
                      {currentContent.bedrooms}
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="2"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Bath className="w-4 h-4 inline mr-2" />
                      {currentContent.bathrooms}
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="2"
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentContent.yearBuilt}
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="2020"
                    required
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{currentContent.analyzing}</span>
                    </>
                  ) : (
                    <>
                      <Calculator className="w-5 h-5" />
                      <span>{currentContent.predictButton}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            <div>
              {prediction ? (
                <div className="space-y-6">
                  {/* Main Prediction */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      {currentContent.result}
                    </h3>

                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {currentContent.estimatedPrice}
                      </p>
                      <p className="text-3xl font-bold text-blue-900 mb-4">
                        ฿{formatPrice(prediction.estimatedPrice)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentContent.priceRange}: ฿{formatPrice(prediction.priceRange.min)} - ฿{formatPrice(prediction.priceRange.max)}
                      </p>
                    </div>

                    {/* Confidence */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {currentContent.confidence}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <p className="text-right text-sm text-gray-600 mt-1">
                        {Math.round(prediction.confidence)}%
                      </p>
                    </div>
                  </div>

                  {/* Market Insights */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {currentContent.marketInsights}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">{currentContent.averagePricePerSqm}</p>
                        <p className="text-lg font-bold text-gray-900">
                          ฿{formatNumber(prediction.marketInsights.averagePricePerSqm)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">{currentContent.totalListings}</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatNumber(prediction.marketInsights.totalListings)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">{currentContent.priceGrowth}</p>
                        <p className={`text-lg font-bold ${
                          prediction.marketInsights.priceGrowth > 0 ? 'text-green-600' : 
                          prediction.marketInsights.priceGrowth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {prediction.marketInsights.priceGrowth > 0 ? '+' : ''}{prediction.marketInsights.priceGrowth}%
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">{currentContent.marketTrend}</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currentContent.trends[prediction.marketInsights.marketTrend]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Factors */}
                  <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {currentContent.factors}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{currentContent.locationFactor}</span>
                        <span className="text-sm font-medium">{Math.round(prediction.factors.location)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{currentContent.sizeFactor}</span>
                        <span className="text-sm font-medium">{Math.round(prediction.factors.size)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{currentContent.ageFactor}</span>
                        <span className="text-sm font-medium">{Math.round(prediction.factors.age)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{currentContent.amenitiesFactor}</span>
                        <span className="text-sm font-medium">{Math.round(prediction.factors.amenities)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{currentContent.furnishedFactor}</span>
                        <span className="text-sm font-medium">{Math.round(prediction.factors.furnished)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Comparable Properties */}
                  {prediction.comparableProperties.length > 0 && (
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {currentContent.comparableProperties}
                      </h4>
                      <div className="space-y-3">
                        {prediction.comparableProperties.slice(0, 3).map((property, index) => (
                          <div key={property.listing_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{property.property_type}</p>
                              <p className="text-sm text-gray-600">
                                {property.location} • {property.size_sq_m} ตร.ม. • {currentContent.furnishedOptions[property.furnished as keyof typeof currentContent.furnishedOptions] || property.furnished}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">฿{formatPrice(property.price)}</p>
                              <p className="text-sm text-gray-600">
                                ฿{formatPrice(property.price / property.size_sq_m)}/ตร.ม.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === 'th' 
                      ? 'กรอกข้อมูลและกดทำนายราคาเพื่อดูผลลัพธ์จากข้อมูลตลาดจริง'
                      : 'Fill in the form and click predict to see results based on real market data'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;