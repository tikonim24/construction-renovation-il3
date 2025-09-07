"use client";

import React, { useState, useMemo } from 'react';

// Types
interface Advertisement {
  id: string;
  title: string;
  description: string;
  category: 'contractor' | 'entrepreneur' | 'client';
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
}

// Sample data
const sampleAds: Advertisement[] = [
  {
    id: '1',
    title: 'בניית וילה 500 מ"ר בהרצליה',
    description: 'חיפוש קבלן מנוסה לבניית וילה פרטית. כולל תכנון, רישוי ובניה. דרוש ניסיון בבניית וילות יוקרה.',
    category: 'client',
    subcategory: 'בנייה וקבלנות',
    location: 'הרצליה',
    contactName: 'דוד כהן',
    phone: '050-1234567',
    email: 'david@example.com',
    budget: '₪2,500,000 - ₪3,000,000',
    deadline: '18 חודשים',
    createdAt: new Date('2024-12-01'),
    urgent: true
  },
  {
    id: '2',
    title: 'שיפוץ דירת 4 חדרים בתל אביב',
    description: 'שיפוץ כללי של דירה כולל החלפת רצפות, צביעה, מטבח חדש וחדרי רחצה. מחפש קבלן אמין.',
    category: 'client',
    subcategory: 'שיפוצים',
    location: 'תל אביב',
    contactName: 'רחל לוי',
    phone: '052-9876543',
    email: 'rachel@example.com',
    budget: '₪150,000 - ₪200,000',
    deadline: '3 חודשים',
    createdAt: new Date('2024-11-28')
  },
  {
    id: '3',
    title: 'קבלן בנייה מנוסה - 15 שנות ניסיון',
    description: 'קבלן רשוי עם צוות מקצועי. מתמחה בבניית בתים פרטיים ושיפוצים. אחריות מלאה על העבודה.',
    category: 'contractor',
    subcategory: 'בנייה וקבלנות',
    location: 'מרכז הארץ',
    contactName: 'משה אברהם',
    phone: '054-1122334',
    email: 'moshe@contractor.com',
    rating: 4.8,
    createdAt: new Date('2024-11-25')
  },
  {
    id: '4',
    title: 'יזם נדל"ן מחפש קרקעות לפיתוח',
    description: 'יזם מנוסה מחפש קרקעות למגורים ומסחר באזור המרכז. תקציב גבוה, עסקה מהירה.',
    category: 'entrepreneur',
    subcategory: 'נדלן ופיתוח',
    location: 'המרכז',
    contactName: 'אבי מזרחי',
    phone: '050-5566778',
    email: 'avi@realestate.com',
    budget: '₪10,000,000+',
    createdAt: new Date('2024-11-20')
  }
];

// Icons as simple SVG components (to avoid lucide-react dependency issues)
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
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

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6zM6 12H4a2 2 0 0 0-2 2v8h4v-8zM18 12h2a2 2 0 0 1 2 2v8h-4v-8z"></path>
  </svg>
);

const HammerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

// Category configurations
const categoryConfig = {
  contractor: {
    label: 'קבלנים',
    icon: HammerIcon,
    color: 'bg-blue-500',
    subcategories: ['בנייה וקבלנות', 'שיפוצים', 'חשמל', 'אינסטלציה', 'גינון', 'צביעה', 'ריצוף וחיפוי']
  },
  entrepreneur: {
    label: 'יזמים',
    icon: BuildingIcon,
    color: 'bg-green-500',
    subcategories: ['נדלן ופיתוח', 'השקעות', 'שותפויות', 'פרויקטים חדשים']
  },
  client: {
    label: 'לקוחות',
    icon: UserIcon,
    color: 'bg-purple-500',
    subcategories: ['בנייה וקבלנות', 'שיפוצים', 'תכנון ועיצוב', 'פרויקטים מיוחדים']
  }
};

export default function Home() {
  const [ads, setAds] = useState<Advertisement[]>(sampleAds);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Advertisement>>({
    category: 'client'
  });

  // Filter ads based on search and category
  const filteredAds = useMemo(() => {
    return ads.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ad.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || ad.subcategory === selectedSubcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [ads, searchTerm, selectedCategory, selectedSubcategory]);

  // Get subcategories for selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return Object.values(categoryConfig).flatMap(config => config.subcategories);
    }
    return categoryConfig[selectedCategory as keyof typeof categoryConfig]?.subcategories || [];
  }, [selectedCategory]);

  const handleAddAd = () => {
    if (!formData.title || !formData.description || !formData.contactName) return;

    const newAd: Advertisement = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category as Advertisement['category'],
      subcategory: formData.subcategory || '',
      location: formData.location || '',
      contactName: formData.contactName,
      phone: formData.phone || '',
      email: formData.email || '',
      budget: formData.budget,
      deadline: formData.deadline,
      urgent: formData.urgent,
      createdAt: new Date()
    };

    setAds(prev => [newAd, ...prev]);
    setFormData({ category: 'client' });
    setShowAddForm(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const AdCard = ({ ad }: { ad: Advertisement }) => {
    const config = categoryConfig[ad.category];
    const IconComponent = config.icon;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {ad.urgent && (
          <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-3 font-semibold">
            דחוף!
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${config.color} text-white p-2 rounded-lg`}>
              <IconComponent />
            </div>
            <div>
              <span className="text-xs text-gray-500 font-medium">{config.label}</span>
              <div className="text-sm text-gray-600">{ad.subcategory}</div>
            </div>
          </div>
          {ad.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <StarIcon />
              <span className="text-sm font-semibold text-yellow-700">{ad.rating}</span>
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
          {ad.title}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {ad.description}
        </p>

        <div className="space-y-2 mb-4">
          {ad.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon />
              <span className="text-sm">{ad.location}</span>
            </div>
          )}
          
          {ad.budget && (
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-sm font-semibold text-green-600">תקציב: {ad.budget}</span>
            </div>
          )}
          
          {ad.deadline && (
            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon />
              <span className="text-sm">זמן ביצוע: {ad.deadline}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">{ad.contactName}</div>
              <div className="text-xs text-gray-500">{formatDate(ad.createdAt)}</div>
            </div>
            
            <div className="flex gap-2">
              {ad.phone && (
                <a href={`tel:${ad.phone}`} 
                   className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors">
                  <PhoneIcon />
                </a>
              )}
              {ad.email && (
                <a href={`mailto:${ad.email}`}
                   className="bg-gray-50 hover:bg-gray-100 text-gray-600 p-2 rounded-lg transition-colors">
                  <MailIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl">
                <HomeIcon />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                לוח מודעות לקבלנים ויזמים
              </h1>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
            >
              <PlusIcon />
              פרסם מודעה
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="חיפוש מודעות..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('all');
                }}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">כל הקטגוריות</option>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>

              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">כל התחומים</option>
                {availableSubcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Stats */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>נמצאו {filteredAds.length} מודעות</span>
            <div className="flex gap-4">
              {Object.entries(categoryConfig).map(([key, config]) => {
                const count = ads.filter(ad => ad.category === key).length;
                return (
                  <span key={key} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                    {config.label}: {count}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>

        {filteredAds.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">לא נמצאו מודעות</h3>
            <p className="text-gray-500">נסה לשנות את המונחים או הפילטרים</p>
          </div>
        )}
      </main>

      {/* Add Advertisement Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">פרסום מודעה חדשה</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">סוג המודעה</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Advertisement['category'] }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">תחום</label>
                  <select
                    value={formData.subcategory || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">בחר תחום</option>
                    {(formData.category ? categoryConfig[formData.category].subcategories : []).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">כותרת המודעה</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="לדוגמה: בניית בית פרטי בתל אביב"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">תיאור מפורט</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="תאר בפירוט את הפרויקט או השירות..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">איזור</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="לדוגמה: תל אביב, המרכז"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">שם מלא</label>
                  <input
                    type="text"
                    value={formData.contactName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="השם שיוצג במודעה"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="050-1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">אימייל</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-left"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">תקציב (אופציונלי)</label>
                  <input
                    type="text"
                    value={formData.budget || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="לדוגמה: ₪100,000 - ₪150,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">זמן ביצוע (אופציונלי)</label>
                  <input
                    type="text"
                    value={formData.deadline || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="לדוגמה: 3 חודשים"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.urgent || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgent: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="urgent" className="mr-2 text-sm font-medium text-gray-700">
                  מודעה דחופה
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button
                  onClick={handleAddAd}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  פרסם מודעה
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-semibold transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}