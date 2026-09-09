'use client';

import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { scheduleCalendar, type CalendarAssignment } from '@/lib/schedule-calendar';

export default function CalendarDownload({ assignments, month, locale }: {
  assignments: CalendarAssignment[]; month: string; locale: string;
}) {
  const [downloaded, setDownloaded] = useState(false);
  const isTh = locale === 'th';
  function download() {
    const blob = new Blob([scheduleCalendar(assignments)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bright-ears-${month}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return <div className="space-y-2">
    <button type="button" onClick={download} disabled={!assignments.length}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-cyan/30 bg-brand-cyan/20 px-4 py-2 text-sm text-brand-cyan hover:bg-brand-cyan/30 disabled:opacity-40">
      <ArrowDownTrayIcon className="h-4 w-4" />
      {isTh ? 'ดาวน์โหลดปฏิทิน' : 'Download calendar'}
    </button>
    {downloaded && <p role="status" className="max-w-sm text-xs text-gray-400">
      {isTh ? 'นำเข้าไฟล์ในแอปปฏิทินของคุณ ตารางนี้ไม่อัปเดตอัตโนมัติ โปรดตรวจสอบการเปลี่ยนแปลงในพอร์ทัล' : 'Import the file into your calendar app. This is a snapshot; check the portal for schedule changes.'}
    </p>}
  </div>;
}
