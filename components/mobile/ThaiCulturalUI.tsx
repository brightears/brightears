'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Thai cultural mobile UI patterns and preferences
export const ThaiMobileTrustSignals = ({ artist }: { artist: any }) => {
  return (
    <div className="bg-pure-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="font-medium text-deep-teal mb-3 flex items-center">
        <span className="mr-2">🛡️</span>
        ความน่าเชื่อถือ
      </h3>
      
      <div className="space-y-3">
        {/* Buddhist year display (important in Thailand) */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-dark-gray/70">เริ่มให้บริการ</span>
          <span className="text-sm font-medium text-deep-teal">
            พ.ศ. {new Date().getFullYear() + 543 - 2} {/* Convert to Buddhist year */}
          </span>
        </div>

        {/* Thai phone number display */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-dark-gray/70">เบอร์ไทย</span>
          <div className="flex items-center">
            <span className="text-green-600 mr-1">✓</span>
            <span className="text-sm font-medium">08X-XXX-XXXX</span>
          </div>
        </div>

        {/* Government ID verification */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-dark-gray/70">ยืนยันบัตรประชาชน</span>
          <div className="flex items-center">
            <span className="text-green-600 mr-1">✓</span>
            <span className="text-sm font-medium text-green-600">ยืนยันแล้ว</span>
          </div>
        </div>

        {/* Tax registration (for professional credibility) */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-dark-gray/70">ทะเบียนภาษี</span>
          <div className="flex items-center">
            <span className="text-green-600 mr-1">✓</span>
            <span className="text-sm font-medium text-green-600">มีทะเบียน</span>
          </div>
        </div>

        {/* Certificate display (Thais value certificates highly) */}
        <div className="mt-4">
          <p className="text-sm font-medium text-deep-teal mb-2">🏆 การรับรอง</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-soft-lavender/20 text-soft-lavender text-xs rounded-full">
              🎵 ใบรับรองดนตรี
            </span>
            <span className="px-3 py-1 bg-earthy-brown/20 text-earthy-brown text-xs rounded-full">
              🏢 การันตีโรงแรม
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Thai social proof component (reviews are crucial for trust)
export const ThaiMobileSocialProof = ({ reviews }: { reviews: any[] }) => {
  const [showAll, setShowAll] = useState(false);
  
  return (
    <div className="bg-pure-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-deep-teal flex items-center">
          <span className="mr-2">💬</span>
          รีวิวจากลูกค้าจริง
        </h3>
        <span className="text-sm text-brand-cyan">
          {reviews.length} รีวิว
        </span>
      </div>

      <div className="space-y-3">
        {(showAll ? reviews : reviews.slice(0, 3)).map((review, index) => (
          <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
            <div className="flex items-start space-x-3">
              {/* Thai style avatar with initial */}
              <div className="w-10 h-10 bg-brand-cyan/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-brand-cyan font-medium text-sm">
                  {review.customerName.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-deep-teal">
                    คุณ{review.customerName.charAt(0)}*** {/* Thai privacy style */}
                  </span>
                  <div className="flex text-yellow-400 text-xs">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                
                <p className="text-sm text-dark-gray/80 leading-relaxed">
                  {review.comment}
                </p>
                
                {/* Thai-style event type display */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded text-dark-gray/60">
                    {review.eventType}
                  </span>
                  <span className="text-xs text-dark-gray/50">
                    {review.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-brand-cyan text-sm font-medium hover:bg-brand-cyan/5 rounded-lg transition-colors"
        >
          {showAll ? 'ดูน้อยลง' : `ดูรีวิวทั้งหมด (${reviews.length})`}
        </button>
      )}
    </div>
  );
};

// Thai cultural elements for mobile booking flow
export const ThaiMobileBookingCultural = ({ onNext }: { onNext: () => void }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isAuspiciousDate, setIsAuspiciousDate] = useState(false);

  // Thai auspicious dates consideration
  const checkAuspiciousDate = (date: string) => {
    const selectedDay = new Date(date).getDay();
    // Avoid major Buddhist holy days and inauspicious days
    const goodDays = [1, 2, 3, 5]; // Monday, Tuesday, Wednesday, Friday generally good
    setIsAuspiciousDate(goodDays.includes(selectedDay));
  };

  return (
    <div className="space-y-4">
      <div className="bg-pure-white rounded-xl p-4 shadow-sm">
        <h3 className="font-medium text-deep-teal mb-3 flex items-center">
          <span className="mr-2">📅</span>
          เลือกวันที่จัดงาน
        </h3>
        
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            checkAuspiciousDate(e.target.value);
          }}
          className="w-full p-3 border border-gray-200 rounded-lg text-base min-h-[48px]"
        />

        {/* Thai cultural date guidance */}
        {selectedDate && (
          <div className={`mt-3 p-3 rounded-lg ${
            isAuspiciousDate 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {isAuspiciousDate ? '🌟' : '⚠️'}
              </span>
              <div>
                <p className={`text-sm font-medium ${
                  isAuspiciousDate ? 'text-green-700' : 'text-yellow-700'
                }`}>
                  {isAuspiciousDate 
                    ? 'วันดี เหมาะสำหรับจัดงาน' 
                    : 'แนะนำให้พิจารณาวันอื่น'
                  }
                </p>
                <p className={`text-xs ${
                  isAuspiciousDate ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {isAuspiciousDate 
                    ? 'วันนี้เหมาะสำหรับการเฉลิมฉลองและความบันเทิง'
                    : 'วันศุกร์หรือวันเสาร์อาจเหมาะสมกว่า'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thai gift giving culture hint */}
      <div className="bg-soft-lavender/10 rounded-xl p-4 border border-soft-lavender/20">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💝</span>
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">
              เคล็ดลับ: วัฒนธรรมการให้ของขวัญ
            </p>
            <p className="text-xs text-dark-gray/70 leading-relaxed">
              ในงานแต่งงานไทย ควรเตรียมซองใส่เงินสำหรับบ่าวสาว 
              และอาจมีการขอเพลงพิเศษสำหรับพิธีกรรม
            </p>
          </div>
        </div>
      </div>

      {/* Buddhist culture consideration */}
      <div className="bg-earthy-brown/10 rounded-xl p-4 border border-earthy-brown/20">
        <div className="flex items-start space-x-3">
          <span className="text-xl">🙏</span>
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">
              การเคารพวัฒนธรรม
            </p>
            <p className="text-xs text-dark-gray/70 leading-relaxed">
              ในงานบุญหรืองานวัด ควรแต่งกายสุภาพ 
              และเลือกเพลงที่เหมาะสมกับบรรยากาศศักดิ์สิทธิ์
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Thai mobile payment cultural preferences
export const ThaiMobilePaymentOptions = () => {
  const [selectedPayment, setSelectedPayment] = useState('');

  const paymentMethods = [
    {
      id: 'promptpay',
      name: 'PromptPay',
      icon: '📱',
      description: 'โอนผ่านเบอร์โทรหรือบัตรประชาชน',
      popular: true,
      fee: 'ฟรี'
    },
    {
      id: 'mobile_banking',
      name: 'Mobile Banking',
      icon: '🏦',
      description: 'แอพธนาคารทุกธนาคาร',
      popular: true,
      fee: 'ฟรี'
    },
    {
      id: 'true_money',
      name: 'TrueMoney Wallet',
      icon: '💰',
      description: 'กระเป๋าเงินอิเล็กทรอนิกส์',
      popular: false,
      fee: 'ฟรี'
    },
    {
      id: 'line_pay',
      name: 'LINE Pay',
      icon: '💚',
      description: 'จ่ายผ่าน LINE',
      popular: false,
      fee: 'ฟรี'
    },
    {
      id: 'credit_card',
      name: 'บัตรเครดิต/เดบิต',
      icon: '💳',
      description: 'Visa, Mastercard, JCB',
      popular: false,
      fee: '2.9%'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-deep-teal mb-3 flex items-center">
        <span className="mr-2">💳</span>
        เลือกวิธีชำระเงิน
      </h3>

      {paymentMethods.map((method) => (
        <label 
          key={method.id}
          className={`block p-4 border rounded-xl cursor-pointer transition-all ${
            selectedPayment === method.id 
              ? 'border-brand-cyan bg-brand-cyan/5' 
              : 'border-gray-200 hover:border-brand-cyan/50'
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selectedPayment === method.id}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="sr-only"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{method.icon}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-deep-teal">{method.name}</span>
                  {method.popular && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      ยอดนิยม
                    </span>
                  )}
                </div>
                <p className="text-sm text-dark-gray/70">{method.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-sm font-medium ${
                method.fee === 'ฟรี' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {method.fee}
              </span>
            </div>
          </div>
        </label>
      ))}

      {/* Trust message for Thai users */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mt-4">
        <div className="flex items-start space-x-3">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              ความปลอดภัยในการชำระเงิน
            </p>
            <p className="text-xs text-blue-800 leading-relaxed">
              การชำระเงินทุกรายการได้รับการปกป้องด้วยระบบความปลอดภัยระดับธนาคาร 
              และเป็นไปตามมาตรฐานของธนาคารแห่งประเทศไทย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};