import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface MapPageProps {
  language: "th" | "en";
  onBack: () => void;
}

interface Property {
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

const typeToThai: Record<string, string> = {
  Condo: "คอนโด",
  House: "บ้าน",
  Land: "ที่ดิน",
  Townhouse: "ทาวน์เฮาส์",
  Commercial: "อาคารพาณิชย์",
  Apartment: "อพาร์ทเมนท์",
};

const icons: Record<string, L.Icon> = {
  บ้าน: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/69/69524.png",
    iconSize: [30, 30],
  }),
  คอนโด: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946436.png",
    iconSize: [30, 30],
  }),
  ที่ดิน: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [30, 30],
  }),
  ทาวน์เฮาส์: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6195/6195700.png",
    iconSize: [30, 30],
  }),
  อาคารพาณิชย์: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190406.png",
    iconSize: [30, 30],
  }),
  อพาร์ทเมนท์: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946436.png",
    iconSize: [30, 30],
  }),
};

const trendsTH = ["เพิ่มขึ้น", "ลดลง", "คงที่"];
const trendsEN = ["Increasing", "Decreasing", "Stable"];

export default function MapPage({ language, onBack }: MapPageProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('realestatelistings')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('date_listed', { ascending: false });

      if (error) throw error;

      const processedProperties = data.map((p: any) => {
        const trend = Math.floor(Math.random() * 3);
        return {
          listing_id: p.listing_id,
          property_type: p.property_type,
          location: p.location,
          latitude: p.latitude,
          longitude: p.longitude,
          price: p.price,
          size_sq_m: p.size_sq_m,
          furnished: p.furnished || 'N/A',
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          year_built: p.year_built,
          date_listed: p.date_listed,
          trendIndex: trend,
          amenities: [
            `ขนาด ${p.size_sq_m} ตร.ม.`,
            `${p.bedrooms || 0} ห้องนอน`,
            `${p.bathrooms || 0} ห้องน้ำ`,
            `เฟอร์ฯ: ${p.furnished || 'ไม่ระบุ'}`,
          ],
        };
      });

      setProperties(processedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = properties.filter(
    (p) =>
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.property_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trends = language === "th" ? trendsTH : trendsEN;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH').format(price);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-800 hover:text-black font-medium text-lg"
            >
              <ArrowLeft className="text-xl mr-2" />
              <span className="font-medium">{language === 'th' ? 'กลับ' : 'Back'}</span>
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">
              {language === 'th' ? 'กำลังโหลดข้อมูลอสังหาริมทรัพย์...' : 'Loading property data...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-800 hover:text-black font-medium text-lg"
          >
            <ArrowLeft className="text-xl mr-2" />
            <span className="font-medium">{language === 'th' ? 'กลับ' : 'Back'}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#f0f4ff] px-4 py-6 text-center flex-shrink-0">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {language === "th"
            ? "แผนที่อสังหาริมทรัพย์"
            : "Property Map"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === "th"
            ? "สำรวจทำเลอสังหาริมทรัพย์ที่คุณสนใจผ่านแผนที่"
            : "Explore property locations of interest through the map"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {language === "th" 
            ? `พบอสังหาริมทรัพย์ ${properties.length} รายการ`
            : `Found ${properties.length} properties`}
        </p>
      </div>

      {/* Search */}
      <div className="p-4 bg-white shadow z-10 flex-shrink-0">
        <input
          type="text"
          placeholder={
            language === "th"
              ? "ค้นหาทำเลหรือชื่ออสังหา..."
              : "Search location or property name..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Map Container - Takes remaining space and allows scrolling */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <MapContainer 
            center={[13.75, 100.5]} 
            zoom={6} 
            className="h-full w-full z-0"
            scrollWheelZoom={true}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            boxZoom={true}
            keyboard={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            {filtered.map((p: any) => (
              <Marker
                key={p.listing_id}
                position={[p.latitude, p.longitude]}
                icon={icons[typeToThai[p.property_type]] || icons["บ้าน"]}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold mb-1">
                      {typeToThai[p.property_type] || p.property_type} - {p.location}
                    </div>
                    <div className="mb-1">
                      💰 {language === "th" ? "ราคา" : "Price"}:{" "}
                      <span className="text-red-500 font-semibold">฿{formatPrice(p.price)}</span>
                    </div>
                    <div className="mb-1">📐 {p.amenities[0]}</div>
                    <div className="mb-1">
                      🛏 {p.amenities[1]} | 🛁 {p.amenities[2]}
                    </div>
                    <div className="mb-1">
                      🏗️ {language === "th" ? "ปีที่สร้าง" : "Built"}: {p.year_built}
                    </div>
                    <div className="mb-1">
                      📊 {language === "th" ? "แนวโน้ม" : "Trend"}:{" "}
                      <span className="text-blue-600">
                        {trends[p.trendIndex]}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ID: {p.listing_id}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}