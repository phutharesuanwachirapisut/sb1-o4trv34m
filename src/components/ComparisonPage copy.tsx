import React, { useState } from 'react';
import { ArrowLeft, Plus, X, TrendingUp, TrendingDown, Building2, Bed, Bath, Calendar, Layers, MapPin } from 'lucide-react';

interface ComparisonPageProps {
  language: 'th' | 'en';
  onBack: () => void;
}

interface Property {
  id: string;
  name: string;
  location: string;
  image: string;
  predictedPrice: number;
  priceChange: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSize: number;
  yearBuilt: number;
  floor?: number;
  pricePerSqm: number;
}

const content = {
  th: {
    title: 'เปรียบเทียบอสังหาริมทรัพย์',
    subtitle: 'วิเคราะห์และเปรียบเทียบอสังหาริมทรัพย์หลายแห่งเพื่อการตัดสินใจที่มีข้อมูล',
    pricePerSqm: 'ราคาต่อตร.ม.',
    propertyTypes: {
      condo: 'คอนโดมิเนียม',
      house: 'บ้านเดี่ยว',
      townhouse: 'ทาวน์เฮาส์',
      apartment: 'อพาร์ทเมนท์',
      villa: 'วิลล่า'
    },
    details: {
      bedrooms: 'ห้องนอน',
      bathrooms: 'ห้องน้ำ',
      areaSize: 'พื้นที่',
      yearBuilt: 'ปีที่สร้าง',
      floor: 'ชั้น'
    }
  },
  en: {
    title: 'Compare Properties',
    subtitle: 'Analyze and compare multiple properties side by side to make informed decisions',
    addProperty: 'Add Property',
    searchPlaceholder: 'Search and select properties to compare',
    pricePerSqm: 'Price per sq.m.',
    propertyTypes: {
      condo: 'Condominium',
      house: 'House',
      townhouse: 'Townhouse',
      apartment: 'Apartment',
      villa: 'Villa'
    },
    details: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      areaSize: 'Area Size',
      yearBuilt: 'Year Built',
      floor: 'Floor'
    }
  }
};

// Sample property data
const sampleProperties: Property[] = [
  {
    id: '1',
    name: 'Noble Ploenchit',
    location: 'Ploenchit',
    image: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    predictedPrice: 12500000,
    priceChange: 8.7,
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    areaSize: 85,
    yearBuilt: 2019,
    floor: 25,
    pricePerSqm: 147059
  },
  {
    id: '2',
    name: 'The Lumpini 24',
    location: 'Sukhumvit',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    predictedPrice: 8900000,
    priceChange: -2.3,
    propertyType: 'condo',
    bedrooms: 1,
    bathrooms: 1,
    areaSize: 45,
    yearBuilt: 2020,
    floor: 15,
    pricePerSqm: 197778
  },
  {
    id: '3',
    name: 'Baan Klang Muang',
    location: 'Sathorn',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    predictedPrice: 15800000,
    priceChange: 12.4,
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 3,
    areaSize: 120,
    yearBuilt: 2018,
    pricePerSqm: 131667
  },
  {
    id: '4',
    name: 'Villa Asoke',
    location: 'Asoke',
    image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    predictedPrice: 22000000,
    priceChange: 5.2,
    propertyType: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    areaSize: 180,
    yearBuilt: 2017,
    pricePerSqm: 122222
  }
];

const ComparisonPage: React.FC<ComparisonPageProps> = ({ language, onBack }) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([sampleProperties[0], sampleProperties[1]]);
  const [availableProperties] = useState<Property[]>(sampleProperties);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');

  const currentContent = content[language];
  const maxProperties = 4;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-US').format(price);
  };

  const removeProperty = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const addProperty = (property: Property) => {
    if (selectedProperties.length < maxProperties && !selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(prev => [...prev, property]);
      setShowAddModal(false);
    }
  };

  const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Remove Button */}
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => removeProperty(property.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Property Info */}
      <div className="p-6">
        {/* Name and Location */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{property.name}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-blue-900 mb-1">
            ฿{formatPrice(property.predictedPrice)}
          </div>
          <div className={`flex items-center text-sm font-medium ${
            property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {property.priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {property.priceChange >= 0 ? '+' : ''}{property.priceChange}%
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{currentContent.propertyTypes[property.propertyType as keyof typeof currentContent.propertyTypes]}</span>
            <Building2 className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.bedrooms} {currentContent.details.bedrooms}</span>
            <Bed className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.bathrooms} {currentContent.details.bathrooms}</span>
            <Bath className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.areaSize} {language === 'th' ? 'ตร.ม.' : 'sq.m.'}</span>
            <span className="text-gray-400">📐</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{property.yearBuilt}</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          
          {property.floor && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{currentContent.details.floor} {property.floor}</span>
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Price per sq.m. */}
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
  
  return (
      <div className="min-h-screen relative bg-gradient-to-br from-white to-gray-100">
        {/* Background */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          }}
        />
  
        {/* Content Wrapper */}
        <div className="relative z-10">
          {/* Header */}
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
  
{/* Title and subtitle centered below header */}
<div className="text-center mt-4">
  <h1 className="text-3xl font-extrabold text-gray-900">{currentContent.title}</h1>
  <p className="text-gray-600 text-sm sm:text-base">{currentContent.subtitle}</p>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-0 flex justify-center">
  <div className="relative w-full max-w-md">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      <MapPin className="w-5 h-5 text-blue-500" />
    </span>
    <input
      type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder={
        language === 'th'
          ? 'ค้นหาอสังหาริมทรัพย์เพื่อเปรียบเทียบ'
          : 'Search property to compare'
      }
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white"
    />
  </div>
</div>

        {/* Property Cards Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedProperties
           .filter((property) =>
            property.name.toLowerCase().includes(searchText.toLowerCase()) ||
            property.location.toLowerCase().includes(searchText.toLowerCase())
  )
          .map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
          <div 
      onClick={() => setShowAddModal(true)}
      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-8 min-h-[500px]"
    >
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-blue-600" />
      </div>
    </div>   
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
              <th key={property.id} className="p-4 text-left border-l border-gray-200">
                {property.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {/* Price per Sq.m. */}
          <tr className="border-t border-gray-100">
            <td className="p-4 font-medium">{currentContent.pricePerSqm}</td>
            {selectedProperties.map((property) => (
              <td key={property.id} className="p-4 border-l border-gray-100 text-blue-700 font-semibold">
                ฿{formatPrice(property.pricePerSqm)}
              </td>
            ))}
          </tr>

          {/* Price Trend */}
          <tr className="border-t border-gray-100">
            <td className="p-4 font-medium">
              {language === 'th' ? 'แนวโน้มราคา' : 'Price Trend'}
            </td>
            {selectedProperties.map((property) => (
              <td
                key={property.id}
                className={`p-4 border-l border-gray-100 font-semibold ${
                  property.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {property.priceChange >= 0 ? '+' : ''}
                {property.priceChange}% {property.priceChange >= 0 ? '📈' : '📉'}
              </td>
            ))}
          </tr>

          {/* Payback Period */}
          <tr className="border-t border-gray-100">
            <td className="p-4 font-medium">
              {language === 'th' ? 'ระยะเวลาคืนทุน' : 'Payback Period'}
            </td>
            {selectedProperties.map((property) => {
              const hasRent = (property as any).monthlyRent;
              const annualRent = hasRent ? (property as any).monthlyRent * 12 : 0;
              const payback = hasRent
                ? (property.predictedPrice / annualRent).toFixed(1)
                : '-';
              return (
                <td key={property.id} className="p-4 border-l border-gray-100">
                  {payback} {hasRent ? (language === 'th' ? 'ปี' : 'years') : ''}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}


        {/* Add Property Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableProperties
                    .filter(property =>
                     !selectedProperties.find(p => p.id === property.id) &&
                    property.name.toLowerCase().includes(searchText.toLowerCase())
       ) 
                    .map((property) => (
                      <div
                        key={property.id}
                        onClick={() => addProperty(property)}
                        className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border hover:border-blue-300"
                      >
                        <div className="flex items-center space-x-4">
                          <img 
                            src={property.image} 
                            alt={property.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600">{property.location}</p>
                            <p className="text-lg font-bold text-blue-900">
                              ฿{formatPrice(property.predictedPrice)}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    ))}
                </div>
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