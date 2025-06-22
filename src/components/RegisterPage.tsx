import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthWrapper';

interface RegisterPageProps {
  language: 'th' | 'en';
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const content = {
  th: {
    title: 'สมัครสมาชิก',
    subtitle: 'สร้างบัญชีใหม่เพื่อใช้งาน ThaiPropertyAI',
    firstName: 'ชื่อ',
    lastName: 'นามสกุล',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    confirmPassword: 'ยืนยันรหัสผ่าน',
    registerButton: 'สมัครสมาชิก',
    haveAccount: 'มีบัญชีแล้ว?',
    signIn: 'เข้าสู่ระบบ',
    firstNamePlaceholder: 'กรอกชื่อของคุณ',
    lastNamePlaceholder: 'กรอกนามสกุลของคุณ',
    emailPlaceholder: 'กรอกอีเมลของคุณ',
    passwordPlaceholder: 'กรอกรหัสผ่านของคุณ',
    confirmPasswordPlaceholder: 'ยืนยันรหัสผ่านของคุณ',
    back: 'กลับ',
    terms: 'ฉันยอมรับ',
    termsLink: 'ข้อกำหนดและเงื่อนไข',
    and: 'และ',
    privacyLink: 'นโยบายความเป็นส่วนตัว',
    registering: 'กำลังสมัครสมาชิก...',
    success: 'สมัครสมาชิกสำเร็จ!',
    successMessage: 'บัญชีของคุณถูกสร้างเรียบร้อยแล้ว',
    passwordMismatch: 'รหัสผ่านไม่ตรงกัน'
  },
  en: {
    title: 'Sign Up',
    subtitle: 'Create a new account to access ThaiPropertyAI',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    registerButton: 'Sign Up',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    confirmPasswordPlaceholder: 'Confirm your password',
    back: 'Back',
    terms: 'I agree to the',
    termsLink: 'Terms and Conditions',
    and: 'and',
    privacyLink: 'Privacy Policy',
    registering: 'Creating account...',
    success: 'Registration Successful!',
    successMessage: 'Your account has been created successfully',
    passwordMismatch: 'Passwords do not match'
  }
};

const RegisterPage: React.FC<RegisterPageProps> = ({ language, onBack, onSwitchToLogin }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentContent = content[language];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;
    
    if (formData.password !== formData.confirmPassword) {
      setError(currentContent.passwordMismatch);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const result = await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      // Auto redirect after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {currentContent.success}
            </h1>
            <p className="text-gray-600 mb-6">
              {currentContent.successMessage}
            </p>
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{currentContent.back}</span>
        </button>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div className="font-bold text-2xl text-gray-900">ThaiPropertyAI</div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentContent.title}
            </h1>
            <p className="text-gray-600">
              {currentContent.subtitle}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  {currentContent.firstName}
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder={currentContent.firstNamePlaceholder}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  {currentContent.lastName}
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder={currentContent.lastNamePlaceholder}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.email}
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder={currentContent.emailPlaceholder}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.password}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12"
                  placeholder={currentContent.passwordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.confirmPassword}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all pr-12"
                  placeholder={currentContent.confirmPasswordPlaceholder}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                {currentContent.terms}{' '}
                <button type="button" className="text-black hover:text-gray-700 underline">
                  {currentContent.termsLink}
                </button>{' '}
                {currentContent.and}{' '}
                <button type="button" className="text-black hover:text-gray-700 underline">
                  {currentContent.privacyLink}
                </button>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{currentContent.registering}</span>
                </div>
              ) : (
                currentContent.registerButton
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {currentContent.haveAccount}{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-black hover:text-gray-700 font-semibold transition-colors"
              >
                {currentContent.signIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;