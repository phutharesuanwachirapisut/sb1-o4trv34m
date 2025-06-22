import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, TrendingUp, TrendingDown, Building2, Bed, Bath, Calendar, Layers, MapPin, Loader2, Search, AlertCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ComparisonPageProps {
  language: 'th' | 'en';
  onBack: () => void;
}

interface Property {
  listing_id: string;
  property_type: string;
  location: string;
  price: number;
  size_sq_m: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  furnished: string;
  date_listed: string;
  latitude?: number;
  longitude?: number;
  pricePerSqm: number;
  priceChange: number;
  image: string;
}

const content = {
  th: {
    title: 'เปรียบเทียบอสังหาริมทรัพย์',
    subtitle: 'วิเคราะห์และเปรียบเทียบอสังหาริมทรัพย์หลายแห่งเพื่อการตัดสินใจที่มีข้อมูล',
    pricePerSqm: 'ราคาต่อตร.ม.',
    loading: 'กำลังโหลดข้อมูล...',
    noProperties: 'ไม่พบข้อมูลอสังหาริมทรัพย์',
    addProperty: 'เพิ่มอสังหาริมทรัพย์',
    searchPlaceholder: 'ค้นหาตามประเภท, ที่ตั้ง หรือราคา...',
    noSearchResults: 'ไม่พบผลการค้นหา',
    clearSearch: 'ล้างการค้นหา',
    totalProperties: 'พบทั้งหมด',
    properties: 'รายการ',
    propertyTypes: {
      Condo: 'คอนโดมิเนียม',
      House: 'บ้านเดี่ยว',
      Townhouse: 'ทาวน์เฮาส์',
      Apartment: 'อพาร์ทเมนท์',
      Commercial: 'อาคารพาณิชย์',
      Land: 'ที่ดิน'
    },
    details: {
      bedrooms: 'ห้องนอน',
      bathrooms: 'ห้องน้ำ',
      areaSize: 'พื้นที่',
      yearBuilt: 'ปีที่สร้าง',
      furnished: 'เฟอร์นิเจอร์'
    },
    furnished: {
      Yes: 'มีเฟอร์นิเจอร์',
      No: 'ไม่มีเฟอร์นิเจอร์',
      Partial: 'เฟอร์นิเจอร์บางส่วน',
      'N/A': 'ไม่ระบุ'
    },
    errorLoading: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
    retry: 'ลองใหม่'
  },
  en: {
    title: 'Compare Properties',
    subtitle: 'Analyze and compare multiple properties side by side to make informed decisions',
    pricePerSqm: 'Price per sq.m.',
    loading: 'Loading properties...',
    noProperties: 'No properties found',
    addProperty: 'Add Property',
    searchPlaceholder: 'Search by type, location, or price...',
    noSearchResults: 'No search results found',
    clearSearch: 'Clear search',
    totalProperties: 'Found',
    properties: 'properties',
    propertyTypes: {
      Condo: 'Condominium',
      House: 'House',
      Townhouse: 'Townhouse',
      Apartment: 'Apartment',
      Commercial: 'Commercial',
      Land: 'Land'
    },
    details: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      areaSize: 'Area Size',
      yearBuilt: 'Year Built',
      furnished: 'Furnished'
    },
    furnished: {
      Yes: 'Furnished',
      No: 'Unfurnished',
      Partial: 'Partially Furnished',
      'N/A': 'Not Applicable'
    },
    errorLoading: 'Error loading data',
    retry: 'Retry'
  }
};

const ComparisonPage: React.FC<ComparisonPageProps> = ({ language, onBack }) => {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentContent = content[language];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching properties from Supabase...');
      
      const { data, error: fetchError } = await supabase
        .from('realestatelistings')
        .select('*')
        .order('date_listed', { ascending: false })
        .limit(100); // จำกัดจำนวนเพื่อประสิทธิภาพ

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        throw fetchError;
      }

      console.log('Raw data from Supabase:', data);

      if (!data || data.length === 0) {
        console.log('No data returned from database');
        setAllProperties([]);
        return;
      }

      const processedProperties = data.map((property: any) => {
        const pricePerSqm = property.size_sq_m > 0 ? property.price / property.size_sq_m : 0;
        // สร้างการเปลี่ยนแปลงราคาแบบจำลอง
        const listingAge = Math.floor((new Date().getTime() - new Date(property.date_listed).getTime()) / (1000 * 60 * 60 * 24));
        const priceChange = (Math.random() - 0.5) * 20; // การเปลี่ยนแปลงระหว่าง -10% ถึง +10%
        
        return {
          listing_id: property.listing_id,
          property_type: property.property_type || 'Unknown',
          location: property.location || 'Unknown Location',
          price: property.price || 0,
          size_sq_m: property.size_sq_m || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          year_built: property.year_built || new Date().getFullYear(),
          furnished: property.furnished || 'N/A',
          date_listed: property.date_listed,
          latitude: property.latitude,
          longitude: property.longitude,
          pricePerSqm,
          priceChange,
          image: getPropertyImage(property.property_type)
        };
      });

      console.log('Processed properties:', processedProperties);
      setAllProperties(processedProperties);
      
      // เลือกอสังหาริมทรัพย์ 2 รายการแรกสำหรับการเปรียบเทียบ
      if (processedProperties.length >= 2) {
        setSelectedProperties([processedProperties[0], processedProperties[1]]);
      } else if (processedProperties.length === 1) {
        setSelectedProperties([processedProperties[0]]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getPropertyImage = (propertyType: string) => {
    const images: Record<string, string> = {
      'Condo': 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'House': 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Townhouse': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Apartment': 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Commercial': 'https://images.pexels.com/photos/273209/pexels-photo-273209.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
      'Land': 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
    };
    return images[propertyType] || images['House'];
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US').format(price);
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.listing_id !== propertyId));
  };

  const addProperty = (property: Property) => {
    if (selectedProperties.length < 4 && !selectedProperties.find(p => p.listing_id === property.listing_id)) {
      setSelectedProperties(prev => [...prev, property]);
      setShowAddModal(false);
    }
  };

  // ปรับปรุงการค้นหาให้ครอบคลุมมากขึ้น
  const filteredProperties = allProperties.filter((property) => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    const propertyTypeTh = currentContent.propertyTypes[property.property_type as keyof typeof currentContent.propertyTypes] || property.property_type;
    
    return (
      property.property_type.toLowerCase().includes(searchLower) ||
      propertyTypeTh.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower) ||
      property.price.toString().includes(searchText) ||
      property.size_sq_m.toString().includes(searchText) ||
      property.year_built.toString().includes(searchText)
    );
  });

  const filteredSelectedProperties = selectedProperties.filter((property) => {
    if (!searchText.trim()) return true;
    
    const searchLower = searchText.toLowerCase();
    const propertyTypeTh = currentContent.propertyTypes[property.property_type as keyof typeof currentContent.propertyTypes] || property.property_type;
    
    return (
      property.property_type.toLowerCase().includes(searchLower) ||
      propertyTypeTh.toLowerCase().includes(searchLower) ||
      property.location.toLowerCase().includes(searchLower)
    );
  });

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={property.image} 
          alt={`${property.property_type} in ${property.location}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
          }}
        />
        <button
          onClick={() => removeProperty(property.listing_id)}
          className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {currentContent.propertyTypes[property.property_type as keyof typeof currentContent.propertyTypes] || property.property_type}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-2xl font-bold text-blue-900 mb-1">
            ฿{formatPrice(property.price)}
          </div>
          <div className={`flex items-center text-sm font-medium ${
            property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {property.priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {property.priceChange >= 0 ? '+' : ''}{property.priceChange.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.size_sq_m} {language === 'th' ? 'ตร.ม.' : 'sq.m.'}</span>
            <span className="text-gray-400">📐</span>
          </div>
          
          {property.bedrooms > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{property.bedrooms} {currentContent.details.bedrooms}</span>
              <Bed className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          {property.bathrooms > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{property.bathrooms} {currentContent.details.bathrooms}</span>
              <Bath className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.year_built}</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {currentContent.furnished[property.furnished as keyof typeof currentContent.furnished] || property.furnished}
            </span>
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-center">
            <div className="text-xs text-green-600 font-medium mb-1">
              {currentContent.pricePerSqm}
            </div>
            <div className="text-lg font-bold text-green-700">
              ฿{formatPrice(property.pricePerSqm)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{currentContent.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{currentContent.errorLoading}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProperties}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentContent.retry}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white to-gray-100">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
        }}
      />

      <div className="relative z-10">
        <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-800 hover:text-black font-medium text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>{language === 'th' ? 'กลับ' : 'Back'}</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <h1 className="text-3xl font-extrabold text-gray-900">{currentContent.title}</h1>
          <p className="text-gray-600 text-sm sm:text-base">{currentContent.subtitle}</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mt-0 flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-blue-500" />
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={currentContent.searchPlaceholder}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {searchText && (
            <div className="text-center mb-4">
              <p className="text-gray-600">
                {filteredProperties.length > 0 ? (
                  <>
                    {currentContent.totalProperties} {filteredProperties.length} {currentContent.properties}
                    {searchText && ` สำหรับ "${searchText}"`}
                  </>
                ) : (
                  currentContent.noSearchResults
                )}
              </p>
            </div>
          )}

          {allProperties.length === 0 ? (
            <div className="text-center mt-10">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">{currentContent.noProperties}</p>
              <button
                onClick={fetchProperties}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentContent.retry}
              </button>
            </div>
          ) : (
            <>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSelectedProperties.map((property) => (
                  <PropertyCard key={property.listing_id} property={property} />
                ))}
                
                {selectedProperties.length < 4 && (
                  <div 
                    onClick={() => setShowAddModal(true)}
                    className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 min-h-[500px]"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-gray-600 font-medium">{currentContent.addProperty}</span>
                  </div>
                )}
              </div>

              {selectedProperties.length >= 2 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {language === 'th'
                      ? 'ตารางเปรียบเทียบอสังหาริมทรัพย์'
                      : 'Property Comparison Table'}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow">
                      <thead>
                        <tr className="bg-gray-100 text-sm text-gray-700">
                          <th className="p-4 text-left">{language === 'th' ? 'รายการ' : 'Item'}</th>
                          {selectedProperties.map((property) => (
                            <th key={property.listing_id} className="p-4 text-left border-l border-gray-200">
                              {currentContent.propertyTypes[property.property_type as keyof typeof currentContent.propertyTypes] || property.property_type}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">{language === 'th' ? 'ที่ตั้ง' : 'Location'}</td>
                          {selectedProperties.map((property) => (
                            <td key={property.listing_id} className="p-4 border-l border-gray-100">
                              {property.location}
                            </td>
                          ))}
                        </tr>
                        
                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">{language === 'th' ? 'ราคา' : 'Price'}</td>
                          {selectedProperties.map((property) => (
                            <td key={property.listing_id} className="p-4 border-l border-gray-100 text-blue-700 font-semibold">
                              ฿{formatPrice(property.price)}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">{currentContent.pricePerSqm}</td>
                          {selectedProperties.map((property) => (
                            <td key={property.listing_id} className="p-4 border-l border-gray-100 text-blue-700 font-semibold">
                              ฿{formatPrice(property.pricePerSqm)}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">
                            {language === 'th' ? 'แนวโน้มราคา' : 'Price Trend'}
                          </td>
                          {selectedProperties.map((property) => (
                            <td
                              key={property.listing_id}
                              className={`p-4 border-l border-gray-100 font-semibold ${
                                property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {property.priceChange >= 0 ? '+' : ''}
                              {property.priceChange.toFixed(1)}% {property.priceChange >= 0 ? '📈' : '📉'}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">{currentContent.details.areaSize}</td>
                          {selectedProperties.map((property) => (
                            <td key={property.listing_id} className="p-4 border-l border-gray-100">
                              {property.size_sq_m} {language === 'th' ? 'ตร.ม.' : 'sq.m.'}
                            </td>
                          ))}
                        </tr>

                        <tr className="border-t border-gray-100">
                          <td className="p-4 font-medium">{currentContent.details.yearBuilt}</td>
                          {selectedProperties.map((property) => (
                            <td key={property.listing_id} className="p-4 border-l border-gray-100">
                              {property.year_built}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      {currentContent.addProperty}
                    </h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {filteredProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">{currentContent.noSearchResults}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredProperties
                        .filter(property =>
                          !selectedProperties.find(p => p.listing_id === property.listing_id)
                        ) 
                        .map((property) => (
                          <div
                            key={property.listing_id}
                            onClick={() => addProperty(property)}
                            className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border hover:border-blue-300"
                          >
                            <div className="flex items-center space-x-4">
                              <img 
                                src={property.image} 
                                alt={`${property.property_type} in ${property.location}`}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop';
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                  {currentContent.propertyTypes[property.property_type as keyof typeof currentContent.propertyTypes] || property.property_type}
                                </h3>
                                <p className="text-sm text-gray-600">{property.location}</p>
                                <p className="text-lg font-bold text-blue-900">
                                  ฿{formatPrice(property.price)}
                                </p>
                              </div>
                              <Plus className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;