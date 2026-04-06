/**
 * AI Content Generation Prompts for BrightEars
 *
 * Entertainment-specific prompt templates for different content types.
 * Each template instructs Gemini to generate a promotional image + caption + hashtags.
 */

export type ContentType = 'INSTAGRAM_POST' | 'EVENT_POSTER' | 'INSTAGRAM_STORY' | 'EPK_HEADER' | 'SOCIAL_BANNER';

interface ContentMetadata {
  artistName?: string;
  venueName?: string;
  eventDate?: string;
  genre?: string;
  customPrompt?: string;
}

/**
 * Build a structured prompt for Gemini image generation based on content type.
 */
export function buildContentPrompt(contentType: ContentType, metadata: ContentMetadata): string {
  const { artistName, venueName, eventDate, genre, customPrompt } = metadata;

  const artistPart = artistName ? `for artist "${artistName}"` : 'for a performing artist';
  const venuePart = venueName ? `at ${venueName}` : '';
  const datePart = eventDate ? `on ${eventDate}` : '';
  const genrePart = genre ? `Genre/style: ${genre}.` : '';
  const customPart = customPrompt ? `Additional instructions: ${customPrompt}` : '';

  const baseStyle = `Use a premium dark nightlife aesthetic. Color palette: deep blacks (#131313), electric cyan (#00bbe4, #4fd6ff) accents, warm amber (#f1bca6) highlights. Modern, sophisticated — think luxury hospitality, not cheap club flyer.`;

  const templates: Record<ContentType, string> = {
    INSTAGRAM_POST: `Create a professional Instagram post image ${artistPart} ${venuePart} ${datePart}.

DESIGN REQUIREMENTS:
- Square format (1080x1080 pixels)
- Use the provided photo as the hero visual
- Apply a dark, cinematic treatment with subtle color grading
- ${baseStyle}
- Overlay the artist name in a clean, modern font (large, readable)
- ${venuePart ? `Include the venue name in smaller text` : ''}
- ${datePart ? `Include the date` : ''}
- Keep text minimal and impactful — this is social media, not a flyer
${genrePart}
${customPart}

Also provide text output in this exact format:
---CAPTION---
Write a 2-3 sentence Instagram caption with a nightlife/entertainment tone. Mention the artist and venue if provided. Keep it engaging and professional.
---HASHTAGS---
Generate 10 relevant hashtags including #BrightEars #LiveEntertainment ${artistName ? `#${artistName.replace(/\s+/g, '')}` : ''} ${genre ? `#${genre.replace(/\s+/g, '')}` : ''}`,

    EVENT_POSTER: `Create a professional event poster ${artistPart} ${venuePart} ${datePart}.

DESIGN REQUIREMENTS:
- Vertical format (1080x1350 pixels), portrait orientation
- Use the provided photo as the main visual element
- ${baseStyle}
- Large, bold artist name as the primary text element
- ${venuePart ? `Venue name prominently displayed` : ''}
- ${datePart ? `Event date in clear, readable format` : ''}
- Professional event poster layout — hierarchy: artist > date > venue > details
- Add subtle graphic elements (lines, shapes) for sophistication
${genrePart}
${customPart}

Also provide text output in this exact format:
---CAPTION---
Write a short promotional caption for this event poster.
---HASHTAGS---
Generate 8 relevant hashtags for event promotion`,

    INSTAGRAM_STORY: `Create an Instagram Story image ${artistPart} ${venuePart} ${datePart}.

DESIGN REQUIREMENTS:
- Vertical format (1080x1920 pixels), 9:16 ratio
- Use the provided photo as the background
- ${baseStyle}
- Bold, minimal text — artist name large, date if available
- "Swipe up" or tap-friendly layout
- Text should be in the center-to-upper area (bottom reserved for Instagram UI)
- Maximum impact, minimum words
${genrePart}
${customPart}

Also provide text output in this exact format:
---CAPTION---
Write a one-line Story caption.
---HASHTAGS---
Generate 5 hashtags`,

    EPK_HEADER: `Create a professional Electronic Press Kit header image ${artistPart}.

DESIGN REQUIREMENTS:
- Wide format (1200x630 pixels), landscape orientation
- Use the provided photo as the hero image
- Clean, professional design — this is for booking agents and venue managers
- ${baseStyle} but more restrained — less "club", more "professional portfolio"
- Artist name in elegant, readable typography
- ${genrePart ? `Genre text in small, subtle font` : ''}
- No event dates — this is a timeless piece
${customPart}

Also provide text output in this exact format:
---CAPTION---
Write a one-line professional artist bio tagline.
---HASHTAGS---
Generate 5 industry hashtags`,

    SOCIAL_BANNER: `Create a social media banner/cover image ${artistPart}.

DESIGN REQUIREMENTS:
- Wide format (1500x500 pixels) suitable for Twitter/Facebook cover
- Use the provided photo as the visual base
- ${baseStyle}
- Artist name positioned for readability on both desktop and mobile crops
- Clean, uncluttered — the banner should look good at any size
- No date-specific info — this is a persistent banner
${genrePart}
${customPart}

Also provide text output in this exact format:
---CAPTION---
Write a short bio-style description for the banner.
---HASHTAGS---
Generate 5 hashtags`,
  };

  return templates[contentType];
}

/**
 * Parse the text response from Gemini to extract caption and hashtags.
 */
export function parseGeneratedText(text: string): { caption: string; hashtags: string[] } {
  let caption = '';
  let hashtags: string[] = [];

  // Try to parse structured format
  const captionMatch = text.match(/---CAPTION---\s*([\s\S]*?)(?:---HASHTAGS---|$)/i);
  const hashtagMatch = text.match(/---HASHTAGS---\s*([\s\S]*?)$/i);

  if (captionMatch) {
    caption = captionMatch[1].trim();
  } else {
    // Fallback: use the whole text as caption
    caption = text.split('#')[0].trim();
  }

  if (hashtagMatch) {
    const hashtagText = hashtagMatch[1].trim();
    hashtags = hashtagText.match(/#\w+/g) || [];
  } else {
    // Fallback: extract any hashtags from the text
    hashtags = text.match(/#\w+/g) || [];
  }

  return { caption, hashtags };
}
