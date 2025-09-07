"use client";

import React, { useState } from 'react';

// Types
interface Advertisement {
  id: string;
  title: string;
  description: string;
  category: 'contractor' | 'entrepreneur' | 'client' | 'worker' | 'hiring';
  subcategory: string;
  location: string;
  contactName: string;
  phone: string;
  email: string;
  budget?: string;
  deadline?: string;
  rating?: number;
  createdAt: Date;
  urgent?: boolean;
  verified?: boolean;
  userId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'contractor' | 'entrepreneur' | 'client' | 'worker';
  verified: boolean;
  rating: number;
  avatar?: string;
}

// Enhanced sample data
const sampleAds: Advertisement[] = [
  {
    id: '1',
    title: 'בניית וילה 500 מ"ר בהרצליה',
    description: 'חיפוש קבלן מנוסה לבניית וילה פרטית. כולל תכנון, רישוי ובניה. דרוש ניסיון בבניית וילות יוקרה ואחריות מלאה.',
    category: 'client',
    subcategory: 'בנייה וקבלנות',
    location: 'הרצליה',
    contactName: 'דוד כהן',
    phone: '050-1234567',
    email: 'david@example.com',
    budget: '₪2,500,000 - ₪3,000,000',
    deadline: '18 חודשים',
    createdAt: new Date('2024-12-01'),
    urgent: true,
    verified: true
  },
  {
    id: '2',
    title: 'חיפוש עבודה - חשמלאי מוסמך',
    description: 'חשמלאי מוסמך עם 8 שנות ניסיון מחפש עבודה. מתמחה בחיווט בתים פרטיים ומערכות חכמות. אמין ואחראי.',
    category: 'worker',
    subcategory: 'חשמל',
    location: 'מרכז הארץ',
    contactName: 'יוסי לוי',
    phone: '052-9876543',
    email: 'yossi@example.com',
    createdAt: new Date('2024-11-28'),
    verified: true,
    rating: 4.7
  },
  {
    id: '3',
    title: 'דרושים פועלי בנייה לפרויקט בתל אביב',
    description: 'חברת קבלנות מחפשת פועלי בנייה מנוסים לפרויקט של 6 חודשים. עבודה קבועה, תנאים טובים וצוות מקצועי.',
    category: 'hiring',
    subcategory: 'בנייה וקבלנות',
    location: 'תל אביב',
    contactName: 'מאיר בניסטי',
    phone: '054-1122334',
    email: 'meir@construction.com',
    budget: '₪180-220 ליום',
    deadline: '6 חודשים',
    createdAt: new Date('2024-11-25'),
    verified: true
  },
  {
    id: '4',
    title: 'קבלן בנייה מנוסה - 15 שנות ניסיון',
    description: 'קבלן רשוי עם צוות מקצועי. מתמחה בבניית בתים פרטיים ושיפוצים. אחריות מלאה על העבודה וביטוח מקצועי.',
    category: 'contractor',
    subcategory: 'בנייה וקבלנות',
    location: 'מרכז הארץ',
    contactName: 'משה אברהם',
    phone: '054-1122334',
    email: 'moshe@contractor.com',
    rating: 4.8,
    createdAt: new Date('2024-11-25'),
    verified: true
  },
  {
    id: '5',
    title: 'שותפות לפרויקט נדל&quot;ן באזור השרון',
    description: 'יזם מנוסה מחפש שותף לפרויקט מגורים באזור השרון. השקעה של 5 מיליון ₪, רווח צפוי של 40%. דרוש ניסיון בפיתוח נדל&quot;ן.',
    category: 'entrepreneur',
    subcategory: 'נדלן ופיתוח',
    location: 'השרון',
    contactName: 'אבי מזרחי',
    phone: '050-5566778',
    email: 'avi@realestate.com',
    budget: '₪5,000,000',
    createdAt: new Date('2024-11-20'),
    verified: true
  }
];

// Enhanced category configurations
const categoryConfig = {
  contractor: {
    label: 'קבלנים',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    subcategories: ['בנייה וקבלנות', 'שיפוצים', 'חשמל', 'אינסטלציה', 'גינון', 'צביעה', 'ריצוף וחיפוי', 'נגרות', 'אלומיניום']
  },
  entrepreneur: {
    label: 'יזמים',
    color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    subcategories: ['נדלן ופיתוח', 'השקעות', 'שותפויות', 'פרויקטים חדשים', 'קרקעות']
  },
  client: {
    label: 'לקוחות',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    subcategories: ['בנייה וקבלנות', 'שיפוצים', 'תכנון ועיצוב', 'פרויקטים מיוחדים', 'תחזוקה']
  },
  worker: {
    label: 'מחפשי עבודה',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    subcategories: ['בנייה כללית', 'חשמל', 'אינסטלציה', 'צביעה', 'ריצוף וחיפוי', 'נגרות', 'גינון', 'ניקיון']
  },
  hiring: {
    label: 'מעסיקים',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    subcategories: ['בנייה כללית', 'חשמל', 'אינסטלציה', 'צביעה', 'ריצוף וחיפוי', 'נגרות', 'גינון', 'ניקיון']
  }
};

// Enhanced Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

export default function ContractorsPlatform() {
  const [ads, setAds] = useState<Advertisement[]>(sampleAds);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [user] = useState<User | null>(null);

  // Future functionality (commented out to avoid build errors)
  // const [showAddForm, setShowAddForm] = useState(false);
  // const [showAuthModal, setShowAuthModal] = useState(false);
  // const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  // const [formData, setFormData] = useState<Partial<Advertisement>>({
  //   category: 'client'
  // });

  // Filter ads based on search and category
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || ad.subcategory === selectedSubcategory;
    
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Get subcategories for selected category
  const availableSubcategories = selectedCategory === 'all' 
    ? Object.values(categoryConfig).flatMap(config => config.subcategories)
    : categoryConfig[selectedCategory as keyof typeof categoryConfig]?.subcategories || [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Future functionality for adding ads (commented out to avoid build errors)
  // const handleAddAd = () => {
  //   if (!user) {
  //     setShowAuthModal(true);
  //     return;
  //   }
  //   
  //   if (!formData.title || !formData.description || !formData.contactName) return;
  //
  //   const newAd: Advertisement = {
  //     id: Date.now().toString(),
  //     title: formData.title,
  //     description: formData.description,
  //     category: formData.category as Advertisement['category'],
  //     subcategory: formData.subcategory || '',
  //     location: formData.location || '',
  //     contactName: formData.contactName,
  //     phone: formData.phone || '',
  //     email: formData.email || '',
  //     budget: formData.budget,
  //     deadline: formData.deadline,
  //     urgent: formData.urgent,
  //     verified: user.verified,
  //     userId: user.id,
  //     createdAt: new Date()
  //   };
  //
  //   setAds(prev => [newAd, ...prev]);
  //   setFormData({ category: 'client' });
  //   setShowAddForm(false);
  // };

  // Enhanced Ad Card Component
  const AdCard = ({ ad }: { ad: Advertisement }) => {
    const config = categoryConfig[ad.category];
    
    return (
      <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:border-gray-200 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {ad.urgent && (
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg animate-pulse">
                  דחוף!
                </div>
              )}
              {ad.verified && (
                <div className="flex items-center gap-1 bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
                  <ShieldIcon />
                  מאומת
                </div>
              )}
            </div>
            
            {ad.rating && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-1 rounded-full">
                <StarIcon />
                <span className="text-sm font-bold text-yellow-700">{ad.rating}</span>
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`${config.color} text-white p-3 rounded-xl shadow-lg`}>
              <div className="w-5 h-5">
                <UserIcon />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{config.label}</span>
              <div className={`text-sm font-medium ${config.textColor}`}>{ad.subcategory}</div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors">
            {ad.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {ad.description}
          </p>

          {/* Details */}
          <div className="space-y-3 mb-6">
            {ad.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="text-gray-400">
                  <MapPinIcon />
                </div>
                <span className="text-sm font-medium">{ad.location}</span>
              </div>
            )}
            
            {ad.budget && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  תקציב: {ad.budget}
                </span>
              </div>
            )}
            
            {ad.deadline && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="text-gray-400">
                  <ClockIcon />
                </div>
                <span className="text-sm">זמן ביצוע: {ad.deadline}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900">{ad.contactName}</div>
                <div className="text-xs text-gray-500">{formatDate(ad.createdAt)}</div>
              </div>
              
              <div className="flex gap-2">
                {ad.phone && (
                  <button 
                    onClick={() => window.open(`tel:${ad.phone}`)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <PhoneIcon />
                  </button>
                )}
                {ad.email && (
                  <button
                    onClick={() => window.open(`mailto:${ad.email}`)}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-sm"
                  >
                    <MailIcon />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Stats Component
  const StatsSection = () => (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {Object.entries(categoryConfig).map(([key, config]) => {
        const count = ads.filter(ad => ad.category === key).length;
        return (
          <div key={key} className={`${config.lightColor} rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer`}>
            <div className={`text-2xl font-bold ${config.textColor} mb-1`}>{count}</div>
            <div className="text-sm text-gray-600">{config.label}</div>
          </div>
        );
      })}
    </div>
  );

  // Placeholder function for future authentication modal
  const handleAuthAction = () => {
    // Future implementation
    console.log('Authentication modal will be implemented');
  };

  // Placeholder function for future add ad functionality
  const handleAddAdAction = () => {
    if (!user) {
      handleAuthAction();
      return;
    }
    // Future implementation
    console.log('Add ad functionality will be implemented');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg">
                <HomeIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  בילדפרו
                </h1>
                <p className="text-xs text-gray-500">פלטפורמת הבנייה המובילה</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{categoryConfig[user.userType].label}</div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAuthAction}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <UserIcon />
                  התחבר
                </button>
              )}
              
              <button
                onClick={handleAddAdAction}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <PlusIcon />
                פרסם מודעה
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            הפלטפורמה המובילה לעולם הבנייה והנדל&quot;ן
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            מצא קבלנים מנוסים, עובדים מקצועיים ופרויקטים מרתקים. הכל במקום אחד, בטוח ומאומת.
          </p>
        </div>

        {/* Stats */}
        <StatsSection />

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Enhanced Search */}
            <div className="flex-1 relative">
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="חיפוש מודעות, קבלנים, פרויקטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-lg bg-white/50 backdrop-blur-sm transition-all"
              />
            </div>

            {/* Enhanced Filters */}
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('all');
                }}
                className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-gray-700 font-medium min-w-[160px]"
              >
                <option value="all">כל הקטגוריות</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>

              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-6 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm text-gray-700 font-medium min-w-[160px]"
              >
                <option value="all">כל התחומים</option>
                {availableSubcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Enhanced Filter Stats */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700">נמצאו {filteredAds.length} מודעות</span>
              {filteredAds.length > 0 && (
                <span className="text-gray-500">• מעודכן לאחרונה לפני דקות</span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredAds.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <SearchIcon />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">לא נמצאו מודעות</h3>
            <p className="text-gray-500 mb-6">נסה לשנות את מונחי החיפוש או הפילטרים</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              נקה סינונים
            </button>
          </div>
        )}
      </main>

      {/* Future: Modals will be added here */}
      
    </div>
  );
}