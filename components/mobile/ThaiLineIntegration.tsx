'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// LINE integration optimized for Thai mobile users
export const LineContactButton = ({ 
  artistName, 
  lineId, 
  eventDetails 
}: { 
  artistName: string;
  lineId: string;
  eventDetails?: {
    date: string;
    type: string;
    location: string;
  };
}) => {
  const generateLineMessage = () => {
    const baseMessage = `สวัสดีครับ/ค่ะ คุณ${artistName}! ผมเจอคุณใน Bright Ears และสนใจที่จะจองครับ/ค่ะ`;
    
    if (eventDetails) {
      return `${baseMessage}

📅 วันที่จัดงาน: ${eventDetails.date}
🎉 ประเภทงาน: ${eventDetails.type}
📍 สถานที่: ${eventDetails.location}

ช่วยแจ้งความพร้อมและราคาหน่อยครับ/ค่ะ ขอบคุณครับ/ค่ะ!`;
    }
    
    return `${baseMessage} ช่วยแจ้งความพร้อมและราคาหน่อยครับ/ค่ะ ขอบคุณครับ/ค่ะ!`;
  };

  const openLineChat = () => {
    const message = encodeURIComponent(generateLineMessage());
    const lineUrl = `https://line.me/ti/p/${lineId}?text=${message}`;
    window.open(lineUrl, '_blank');
  };

  return (
    <button
      onClick={openLineChat}
      className="w-full bg-green-500 hover:bg-green-600 text-pure-white font-medium py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95 shadow-lg min-h-[52px]"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
      <span className="text-lg">ติดต่อผ่าน LINE</span>
    </button>
  );
};

// LINE Official Account features for business credibility
export const LineOfficialBadge = ({ isVerified = true }: { isVerified?: boolean }) => {
  if (!isVerified) return null;

  return (
    <div className="inline-flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
      </svg>
      <div>
        <span className="text-sm font-medium text-green-800">LINE Official Account</span>
        <p className="text-xs text-green-600">บัญชีธุรกิจที่ยืนยันแล้ว</p>
      </div>
    </div>
  );
};

// Quick booking through LINE with Thai mobile optimization
export const LineQuickBooking = ({ artist }: { artist: any }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    type: '',
    location: '',
    duration: '4',
    guests: ''
  });

  const eventTypes = [
    { id: 'wedding', name: 'งานแต่งงาน', icon: '💒' },
    { id: 'corporate', name: 'งานบริษัท', icon: '🏢' },
    { id: 'birthday', name: 'งานวันเกิด', icon: '🎂' },
    { id: 'private', name: 'งานเลี้ยงส่วนตัว', icon: '🎉' },
    { id: 'other', name: 'อื่นๆ', icon: '🎭' }
  ];

  const generateLineBookingMessage = () => {
    const eventType = eventTypes.find(t => t.id === bookingData.type)?.name || bookingData.type;
    
    return `สวัสดีครับ/ค่ะ คุณ${artist.name}! 

ผมต้องการจองผ่าน Bright Ears ครับ/ค่ะ

📅 วันที่: ${bookingData.date}
🎉 ประเภทงาน: ${eventType}
📍 สถานที่: ${bookingData.location}
⏰ ระยะเวลา: ${bookingData.duration} ชั่วโมง
👥 จำนวนแขก: ${bookingData.guests} คน

ช่วยแจ้งความพร้อมและราคาหน่อยครับ/ค่ะ ขอบคุณครับ/ค่ะ! 🙏`;
  };

  const sendToLine = () => {
    const message = encodeURIComponent(generateLineBookingMessage());
    const lineUrl = `https://line.me/ti/p/${artist.lineId}?text=${message}`;
    window.open(lineUrl, '_blank');
  };

  if (step === 1) {
    return (
      <div className="bg-pure-white rounded-xl p-4 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-deep-teal">จองด่วนผ่าน LINE</h3>
            <p className="text-sm text-dark-gray/70">ติดต่อศิลปินโดยตรงภายใน 1 นาที</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-deep-teal mb-2">
              📅 วันที่จัดงาน
            </label>
            <input
              type="date"
              value={bookingData.date}
              onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg text-base min-h-[48px]"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-medium text-deep-teal mb-2">
              🎉 ประเภทงาน
            </label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setBookingData({...bookingData, type: type.id})}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all min-h-[48px] ${
                    bookingData.type === type.id
                      ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                      : 'border-gray-200 text-dark-gray hover:border-brand-cyan/50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-xs">{type.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-deep-teal mb-2">
              📍 สถานที่
            </label>
            <input
              type="text"
              placeholder="เช่น โรงแรมสุขุมวิท, ห้องแกรนด์บอลรูม"
              value={bookingData.location}
              onChange={(e) => setBookingData({...bookingData, location: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-lg text-base min-h-[48px]"
            />
          </div>

          {/* Duration and Guests in one row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-deep-teal mb-2">
                ⏰ ระยะเวลา
              </label>
              <select
                value={bookingData.duration}
                onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg text-base min-h-[48px]"
              >
                {[2,3,4,5,6,8,10,12].map(hours => (
                  <option key={hours} value={hours}>{hours} ชม.</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-deep-teal mb-2">
                👥 จำนวนแขก
              </label>
              <input
                type="number"
                placeholder="50"
                value={bookingData.guests}
                onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-lg text-base min-h-[48px]"
              />
            </div>
          </div>

          {/* Estimated Price Display */}
          <div className="bg-brand-cyan/5 rounded-lg p-3 border border-brand-cyan/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-deep-teal">ราคาประมาณ</span>
              <span className="font-bold text-brand-cyan">
                ฿{(artist.hourlyRate * parseInt(bookingData.duration || '4')).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-dark-gray/60 mt-1">
              {artist.hourlyRate.toLocaleString()} บาท/ชม. × {bookingData.duration} ชม.
            </p>
          </div>

          {/* Send to LINE Button */}
          <button
            onClick={sendToLine}
            disabled={!bookingData.date || !bookingData.type || !bookingData.location}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-pure-white font-medium py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 active:scale-95 shadow-lg min-h-[52px]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            <span className="text-lg">ส่งข้อความใน LINE</span>
          </button>

          <p className="text-xs text-center text-dark-gray/60 leading-relaxed">
            คลิกเพื่อเปิด LINE และส่งข้อความถึงศิลปินโดยตรง 
            พวกเขาจะตอบกลับอย่างรวดเร็วพร้อมราคาและรายละเอียด
          </p>
        </div>
      </div>
    );
  }

  return null;
};

// LINE Rich Message component for better engagement
export const LineRichMessage = ({ 
  title, 
  subtitle, 
  imageUrl, 
  actions 
}: {
  title: string;
  subtitle: string;
  imageUrl: string;
  actions: Array<{ label: string; action: () => void; type?: 'primary' | 'secondary' }>;
}) => {
  return (
    <div className="bg-pure-white rounded-xl overflow-hidden shadow-lg border border-gray-200 max-w-sm mx-auto">
      {/* Image */}
      <div className="relative h-48">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            LINE
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-deep-teal text-lg mb-1">{title}</h3>
        <p className="text-dark-gray/70 text-sm mb-4">{subtitle}</p>

        {/* Actions */}
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all min-h-[44px] ${
                action.type === 'primary' 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'border border-green-500 text-green-600 hover:bg-green-50'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};