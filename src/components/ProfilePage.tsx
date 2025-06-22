import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, Crown, Settings, Shield, Bell, Globe, Trash2, Save, Edit3 } from 'lucide-react';
import { getProductByPriceId } from '../stripe-config';

interface ProfilePageProps {
  language: 'th' | 'en';
  onBack: () => void;
  user: any;
  userSubscription: any;
}

const content = {
  th: {
    title: 'โปรไฟล์',
    subtitle: 'จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี',
    personalInfo: 'ข้อมูลส่วนตัว',
    subscription: 'การสมัครสมาชิก',
    settings: 'การตั้งค่า',
    security: 'ความปลอดภัย',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล',
    email: 'อีเมล',
    memberSince: 'สมาชิกตั้งแต่',
    currentPlan: 'แผนปัจจุบัน',
    planStatus: 'สถานะ',
    renewsOn: 'ต่ออายุในวันที่',
    managePlan: 'จัดการแผน',
    language: 'ภาษา',
    notifications: 'การแจ้งเตือน',
    emailNotifications: 'การแจ้งเตือนทางอีเมล',
    pushNotifications: 'การแจ้งเตือนแบบ Push',
    marketUpdates: 'อัปเดตตลาด',
    priceAlerts: 'แจ้งเตือนราคา',
    changePassword: 'เปลี่ยนรหัสผ่าน',
    twoFactor: 'การยืนยันตัวตน 2 ขั้นตอน',
    deleteAccount: 'ลบบัญชี',
    save: 'บันทึก',
    edit: 'แก้ไข',
    cancel: 'ยกเลิก',
    back: 'กลับ',
    status: {
      active: 'ใช้งานอยู่',
      canceled: 'ยกเลิกแล้ว',
      past_due: 'ค้างชำระ',
      incomplete: 'ไม่สมบูรณ์',
      trialing: 'ทดลองใช้',
      not_started: 'ยังไม่เริ่ม'
    },
    noSubscription: 'ไม่มีการสมัครสมาชิก',
    freePlan: 'แผนฟรี'
  },
  en: {
    title: 'Profile',
    subtitle: 'Manage your personal information and account settings',
    personalInfo: 'Personal Information',
    subscription: 'Subscription',
    settings: 'Settings',
    security: 'Security',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    memberSince: 'Member Since',
    currentPlan: 'Current Plan',
    planStatus: 'Status',
    renewsOn: 'Renews On',
    managePlan: 'Manage Plan',
    language: 'Language',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    marketUpdates: 'Market Updates',
    priceAlerts: 'Price Alerts',
    changePassword: 'Change Password',
    twoFactor: 'Two-Factor Authentication',
    deleteAccount: 'Delete Account',
    save: 'Save',
    edit: 'Edit',
    cancel: 'Cancel',
    back: 'Back',
    status: {
      active: 'Active',
      canceled: 'Canceled',
      past_due: 'Past Due',
      incomplete: 'Incomplete',
      trialing: 'Trialing',
      not_started: 'Not Started'
    },
    noSubscription: 'No active subscription',
    freePlan: 'Free Plan'
  }
};

const ProfilePage: React.FC<ProfilePageProps> = ({ language, onBack, user, userSubscription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || ''
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketUpdates: true,
    priceAlerts: false
  });

  const currentContent = content[language];

  const getCurrentPlan = () => {
    if (!userSubscription?.price_id) return currentContent.freePlan;
    const product = getProductByPriceId(userSubscription.price_id);
    return product?.name || currentContent.freePlan;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US');
  };

  const formatSubscriptionDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US');
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
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

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentContent.title}</h1>
                <p className="text-blue-100 mt-2">{currentContent.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    {currentContent.personalInfo}
                  </h2>
                  <button
                    onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditing ? currentContent.cancel : currentContent.edit}</span>
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentContent.firstName}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.firstName || 'Not set'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {currentContent.lastName}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{formData.lastName || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {currentContent.email}
                    </label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {currentContent.memberSince}
                    </label>
                    <p className="text-gray-900">{formatDate(user?.created_at)}</p>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Save className="w-4 h-4" />
                        <span>{currentContent.save}</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        {currentContent.cancel}
                      </button>
                    </div>
                  )}
                </div>

                {/* Subscription Info */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    {currentContent.subscription}
                  </h2>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{currentContent.currentPlan}</span>
                        <span className="font-semibold text-gray-900">{getCurrentPlan()}</span>
                      </div>
                      
                      {userSubscription && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{currentContent.planStatus}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              userSubscription.subscription_status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {currentContent.status[userSubscription.subscription_status as keyof typeof currentContent.status] || userSubscription.subscription_status}
                            </span>
                          </div>
                          
                          {userSubscription.current_period_end && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">{currentContent.renewsOn}</span>
                              <span className="text-gray-900">{formatSubscriptionDate(userSubscription.current_period_end)}</span>
                            </div>
                          )}
                        </>
                      )}
                      
                      <button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition font-medium">
                        {currentContent.managePlan}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                {/* Notifications */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    {currentContent.notifications}
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{currentContent.emailNotifications}</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{currentContent.marketUpdates}</p>
                        <p className="text-sm text-gray-600">Weekly market analysis</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.marketUpdates}
                          onChange={(e) => handleSettingChange('marketUpdates', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{currentContent.priceAlerts}</p>
                        <p className="text-sm text-gray-600">Property price change alerts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.priceAlerts}
                          onChange={(e) => handleSettingChange('priceAlerts', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {currentContent.security}
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                    <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <span className="font-medium text-gray-900">{currentContent.changePassword}</span>
                      <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>

                    <button className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <span className="font-medium text-gray-900">{currentContent.twoFactor}</span>
                      <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div>
                  <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <button className="w-full flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      <Trash2 className="w-4 h-4" />
                      <span>{currentContent.deleteAccount}</span>
                    </button>
                    <p className="text-sm text-red-600 mt-2 text-center">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;