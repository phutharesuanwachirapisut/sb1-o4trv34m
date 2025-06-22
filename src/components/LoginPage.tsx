import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthWrapper';

interface LoginPageProps {
  language: 'th' | 'en';
  onBack: () => void;
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const content = {
  th: {
    title: 'เข้าสู่ระบบ',
    subtitle: 'เข้าสู่ระบบเพื่อใช้งาน ThaiPropertyAI',
    email: 'อีเมล',
    password: 'รหัสผ่าน',
    loginButton: 'เข้าสู่ระบบ',
    forgotPassword: 'ลืมรหัสผ่าน?',
    noAccount: 'ยังไม่มีบัญชี?',
    signUp: 'สมัครสมาชิก',
    emailPlaceholder: 'กรอกอีเมลของคุณ',
    passwordPlaceholder: 'กรอกรหัสผ่านของคุณ',
    back: 'กลับ',
    signingIn: 'กำลังเข้าสู่ระบบ...'
  },
  en: {
    title: 'Sign In',
    subtitle: 'Sign in to access ThaiPropertyAI',
    email: 'Email',
    password: 'Password',
    loginButton: 'Sign In',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    back: 'Back',
    signingIn: 'Signing in...'
  }
};

const LoginPage: React.FC<LoginPageProps> = ({ language, onBack, onLoginSuccess, onSwitchToRegister }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentContent = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await signIn(email, password);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      onLoginSuccess();
    }
  };

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

        {/* Login Card */}
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
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {currentContent.email}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-black hover:text-gray-700 transition-colors"
              >
                {currentContent.forgotPassword}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{currentContent.signingIn}</span>
                </div>
              ) : (
                currentContent.loginButton
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {currentContent.noAccount}{' '}
              <button 
                onClick={onSwitchToRegister}
                className="text-black hover:text-gray-700 font-semibold transition-colors"
              >
                {currentContent.signUp}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;