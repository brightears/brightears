export interface Partner {
  name: string;
  logoPath: string;
  websiteUrl?: string;
  altText: string;
}

export const partners: Partner[] = [
  {
    name: 'Hilton Bangkok',
    logoPath: '/partners/hilton-bangkok.svg',
    websiteUrl: 'https://hilton.com',
    altText: 'Hilton Bangkok Hotel Logo'
  },
  {
    name: 'Marriott Sukhumvit',
    logoPath: '/partners/marriott-sukhumvit.svg',
    websiteUrl: 'https://marriott.com',
    altText: 'Marriott Sukhumvit Hotel Logo'
  },
  {
    name: 'W Hotel Bangkok',
    logoPath: '/partners/w-hotel-bangkok.svg',
    websiteUrl: 'https://marriott.com/en-us/hotels/bkkwh-w-bangkok',
    altText: 'W Hotel Bangkok Logo'
  },
  {
    name: 'Anantara Siam',
    logoPath: '/partners/anantara-siam.svg',
    websiteUrl: 'https://anantara.com',
    altText: 'Anantara Siam Bangkok Hotel Logo'
  },
  {
    name: 'Conrad Bangkok',
    logoPath: '/partners/conrad-bangkok.svg',
    websiteUrl: 'https://hilton.com/en/hotels/bkkcici-conrad-bangkok/',
    altText: 'Conrad Bangkok Hotel Logo'
  },
  {
    name: 'The Peninsula Bangkok',
    logoPath: '/partners/peninsula-bangkok.svg',
    websiteUrl: 'https://peninsula.com',
    altText: 'The Peninsula Bangkok Hotel Logo'
  }
];

export default partners;