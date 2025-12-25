/**
 * Unit Tests for Pricing Utilities
 *
 * Tests all pricing formatting functions to ensure consistency
 * across the Bright Ears platform.
 */

import {
  formatPrice,
  formatPriceRange,
  formatHourlyRate,
  formatPackagePrice,
  formatDeposit,
  formatFromPrice,
  shouldShowContactForPricing,
  getContactForPricingText,
  getNegotiableText,
  calculateEstimatedTotal,
  formatCompactPrice
} from '../pricing';

describe('formatPrice', () => {
  it('formats basic price with currency symbol', () => {
    expect(formatPrice(2500)).toBe('฿2,500');
  });

  it('formats price without currency symbol', () => {
    expect(formatPrice(2500, { showCurrency: false })).toBe('2,500');
  });

  it('formats price in Thai locale', () => {
    expect(formatPrice(2500, { locale: 'th' })).toBe('2,500 บาท');
  });

  it('formats price with decimals', () => {
    expect(formatPrice(2500.50, { showDecimals: true })).toBe('฿2,500.50');
  });

  it('handles large numbers with commas', () => {
    expect(formatPrice(125000)).toBe('฿125,000');
  });

  it('handles invalid prices', () => {
    expect(formatPrice(-100)).toBe('Price not set');
    expect(formatPrice(NaN)).toBe('Price not set');
    expect(formatPrice(-100, { locale: 'th' })).toBe('ไม่ระบุราคา');
  });
});

describe('formatHourlyRate', () => {
  it('formats basic hourly rate', () => {
    expect(formatHourlyRate(2500)).toBe('฿2,500/hour');
  });

  it('formats hourly rate with minimum hours', () => {
    expect(formatHourlyRate(2500, 3)).toBe('฿2,500/hour (Min. 3 hours)');
  });

  it('formats hourly rate in Thai locale', () => {
    expect(formatHourlyRate(2500, 3, 'th')).toBe('2,500 บาท/ชั่วโมง (ขั้นต่ำ 3 ชั่วโมง)');
  });

  it('does not show minimum for 1 hour', () => {
    expect(formatHourlyRate(2500, 1)).toBe('฿2,500/hour');
  });

  it('handles invalid rates', () => {
    expect(formatHourlyRate(0)).toBe('Contact for pricing');
    expect(formatHourlyRate(-100)).toBe('Contact for pricing');
    expect(formatHourlyRate(0, 3, 'th')).toBe('ติดต่อสอบถามราคา');
  });
});

describe('formatPriceRange', () => {
  it('formats basic price range', () => {
    expect(formatPriceRange(2500, 5000)).toBe('฿2,500 - ฿5,000');
  });

  it('formats price range with unit', () => {
    expect(formatPriceRange(2500, 5000, { unit: '/hour' })).toBe('฿2,500 - ฿5,000/hour');
  });

  it('formats price range in Thai locale', () => {
    expect(formatPriceRange(2500, 5000, { locale: 'th' })).toBe('2,500 - 5,000 บาท');
  });

  it('shows single price when min equals max', () => {
    expect(formatPriceRange(2500, 2500)).toBe('฿2,500');
  });

  it('handles invalid ranges', () => {
    expect(formatPriceRange(-100, 5000)).toBe('Contact for pricing');
    expect(formatPriceRange(2500, -100)).toBe('Contact for pricing');
    expect(formatPriceRange(-100, -100, { locale: 'th' })).toBe('ติดต่อสอบถามราคา');
  });
});

describe('formatFromPrice', () => {
  it('formats "from" price', () => {
    expect(formatFromPrice(2500)).toBe('From ฿2,500/hour');
  });

  it('formats "from" price with custom unit', () => {
    expect(formatFromPrice(15000, 'event')).toBe('From ฿15,000/event');
  });

  it('formats "from" price in Thai locale', () => {
    expect(formatFromPrice(2500, 'hour', 'th')).toBe('เริ่มต้นที่ 2,500 บาท/ชั่วโมง');
  });

  it('handles invalid amounts', () => {
    expect(formatFromPrice(0)).toBe('Contact for pricing');
    expect(formatFromPrice(-100, 'hour', 'th')).toBe('ติดต่อสอบถามราคา');
  });
});

describe('formatPackagePrice', () => {
  it('formats package price', () => {
    expect(formatPackagePrice(15000, '4 hours')).toBe('฿15,000 for 4 hours');
  });

  it('formats package price in Thai locale', () => {
    expect(formatPackagePrice(15000, '4 hours', 'th')).toBe('15,000 บาท สำหรับ 4 hours');
  });

  it('handles invalid prices', () => {
    expect(formatPackagePrice(0, 'Full event')).toBe('Contact for pricing');
    expect(formatPackagePrice(-100, 'Full event', 'th')).toBe('ติดต่อสอบถามราคา');
  });
});

describe('formatDeposit', () => {
  it('formats deposit with amount only', () => {
    expect(formatDeposit(5000)).toBe('Deposit: ฿5,000');
  });

  it('formats deposit with percentage only', () => {
    expect(formatDeposit(null, 30)).toBe('30% deposit required');
  });

  it('formats deposit with both amount and percentage', () => {
    expect(formatDeposit(5000, 30)).toBe('Deposit: ฿5,000 (30%)');
  });

  it('formats deposit in Thai locale', () => {
    expect(formatDeposit(5000, null, 'th')).toBe('มัดจำ: 5,000 บาท');
    expect(formatDeposit(null, 30, 'th')).toBe('ต้องชำระมัดจำ 30%');
    expect(formatDeposit(5000, 30, 'th')).toBe('มัดจำ: 5,000 บาท (30%)');
  });

  it('handles no deposit information', () => {
    expect(formatDeposit()).toBe('Deposit not specified');
    expect(formatDeposit(undefined, undefined, 'th')).toBe('ไม่ระบุค่ามัดจำ');
  });
});

describe('shouldShowContactForPricing', () => {
  it('returns true for invalid prices', () => {
    expect(shouldShowContactForPricing(null)).toBe(true);
    expect(shouldShowContactForPricing(undefined)).toBe(true);
    expect(shouldShowContactForPricing(0)).toBe(true);
    expect(shouldShowContactForPricing(-100)).toBe(true);
    expect(shouldShowContactForPricing(NaN)).toBe(true);
  });

  it('returns false for valid prices', () => {
    expect(shouldShowContactForPricing(2500)).toBe(false);
    expect(shouldShowContactForPricing(0.01)).toBe(false);
  });
});

describe('getContactForPricingText', () => {
  it('returns English text', () => {
    expect(getContactForPricingText('en')).toBe('Contact for pricing');
  });

  it('returns Thai text', () => {
    expect(getContactForPricingText('th')).toBe('ติดต่อสอบถามราคา');
  });

  it('defaults to English', () => {
    expect(getContactForPricingText()).toBe('Contact for pricing');
  });
});

describe('getNegotiableText', () => {
  it('returns English text', () => {
    expect(getNegotiableText('en')).toBe('Negotiable');
  });

  it('returns Thai text', () => {
    expect(getNegotiableText('th')).toBe('ราคาต่อรองได้');
  });

  it('defaults to English', () => {
    expect(getNegotiableText()).toBe('Negotiable');
  });
});

describe('calculateEstimatedTotal', () => {
  it('calculates total correctly', () => {
    expect(calculateEstimatedTotal(2500, 4)).toBe('฿10,000');
  });

  it('calculates total in Thai locale', () => {
    expect(calculateEstimatedTotal(2500, 4, 'th')).toBe('10,000 บาท');
  });

  it('handles invalid inputs', () => {
    expect(calculateEstimatedTotal(0, 4)).toBe('Contact for pricing');
    expect(calculateEstimatedTotal(2500, 0)).toBe('Contact for pricing');
    expect(calculateEstimatedTotal(-100, 4, 'th')).toBe('ติดต่อสอบถามราคา');
  });
});

describe('formatCompactPrice', () => {
  it('formats small amounts normally', () => {
    expect(formatCompactPrice(500)).toBe('฿500');
    expect(formatCompactPrice(999)).toBe('฿999');
  });

  it('formats thousands with K notation', () => {
    expect(formatCompactPrice(2500)).toBe('฿2.5K');
    expect(formatCompactPrice(15000)).toBe('฿15K');
    expect(formatCompactPrice(150000)).toBe('฿150K');
  });

  it('formats with Thai locale', () => {
    expect(formatCompactPrice(2500, 'th')).toBe('2.5K บาท');
    expect(formatCompactPrice(15000, 'th')).toBe('15K บาท');
  });

  it('handles invalid amounts', () => {
    expect(formatCompactPrice(-100)).toBe('N/A');
    expect(formatCompactPrice(NaN)).toBe('N/A');
  });
});

describe('Edge Cases', () => {
  it('handles very large numbers', () => {
    expect(formatPrice(1000000)).toBe('฿1,000,000');
    expect(formatHourlyRate(999999)).toBe('฿999,999/hour');
  });

  it('handles decimal rounding', () => {
    expect(formatPrice(2500.6)).toBe('฿2,501');
    expect(formatPrice(2500.4)).toBe('฿2,500');
  });

  it('maintains consistency across functions', () => {
    const amount = 2500;
    const formatted = formatPrice(amount);
    expect(formatted).toContain('2,500');

    const hourlyRate = formatHourlyRate(amount);
    expect(hourlyRate).toContain('2,500');
  });
});
