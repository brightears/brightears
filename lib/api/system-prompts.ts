/**
 * Atmosphere Discovery System Prompts
 *
 * Based on research: "Resonant Interfaces: The Convergence of Psychoacoustics,
 * Generative Art, and Conversion Strategy in Electronic Music Web Design"
 *
 * Foundation: UC Berkeley's 13 Emotions of Music study
 * - Joy, Eroticism, Beauty, Relaxation, Triumph, Anxiety, Defiance, Pumped Up, etc.
 *
 * Goal: Guide venue owners to discover their ideal atmosphere through a structured
 * 5-stage conversation that maps their needs to specific emotional/musical outcomes.
 */

/**
 * The 13 Emotions of Music (UC Berkeley Study)
 * Used to classify venue atmosphere needs
 */
export const musicEmotions = {
  joy: { genres: ['House', 'Disco', 'Tropical House'], bpm: '110-128', visual: 'bright, rounded shapes' },
  eroticism: { genres: ['Deep House', 'R&B', 'Downtempo'], bpm: '90-110', visual: 'deep reds, slow motion' },
  beauty: { genres: ['Ambient', 'Neo-Classical', 'Melodic Techno'], bpm: '80-120', visual: 'elegant, minimal' },
  relaxation: { genres: ['Chillout', 'Lo-Fi', 'Ambient'], bpm: '60-90', visual: 'muted pastels, soft' },
  triumph: { genres: ['Big Room', 'Anthem Trance', 'Progressive'], bpm: '128-140', visual: 'gold, bold' },
  anxiety: { genres: ['Industrial Techno', 'Gabber'], bpm: '140-180', visual: 'high contrast, glitch' },
  defiance: { genres: ['Hardstyle', 'Dubstep', 'Punk-Electronic'], bpm: '140-150', visual: 'grunge, red/black' },
  pumpedUp: { genres: ['EDM', 'Drum & Bass', 'Trap'], bpm: '140-175', visual: 'neon, high energy' },
};

/**
 * 4 User Personas - Identified from conversation
 */
export const venuePersonas = {
  highEnergy: {
    name: 'High-Energy Venue',
    examples: 'Club, Festival, Nightclub',
    emotions: ['pumpedUp', 'triumph', 'joy'],
    musicStyle: 'EDM, House, Techno',
    lighting: 'dynamic, strobes, neon accents',
  },
  intimate: {
    name: 'Intimate/Upscale Venue',
    examples: 'Hotel Bar, Lounge, Rooftop',
    emotions: ['beauty', 'eroticism', 'relaxation'],
    musicStyle: 'Deep House, Ambient, Jazz',
    lighting: 'warm, dim, elegant',
  },
  corporate: {
    name: 'Corporate Event',
    examples: 'Conference, Gala, Product Launch',
    emotions: ['triumph', 'beauty'],
    musicStyle: 'Background ambient, tasteful uplift',
    lighting: 'professional, refined, branded',
  },
  celebration: {
    name: 'Celebration Venue',
    examples: 'Wedding, Birthday, Party',
    emotions: ['joy', 'triumph'],
    musicStyle: 'Disco, Pop, Feel-good classics',
    lighting: 'festive, warm, adaptable',
  },
};

/**
 * Main system prompt for Gemini AI
 * Trained on 4 personas and 5-stage discovery flow
 */
export function getSystemPrompt(): string {
  return `You are an atmosphere consultant at Bright Ears, helping venue owners in Thailand discover their ideal entertainment setup.

YOUR KNOWLEDGE BASE (from psychoacoustics research):
The UC Berkeley study identified 13 key emotions music creates: Joy, Beauty, Relaxation, Triumph, Eroticism, Anxiety, Defiance, and "Pumped Up" are most relevant to venues.

VENUE TYPES YOU'LL ENCOUNTER:
1. HIGH-ENERGY (Clubs, Festivals): Want "Pumped Up", Triumph, Joy → EDM, House, Techno
2. INTIMATE/UPSCALE (Hotel bars, Lounges): Want Beauty, Relaxation, Eroticism → Deep House, Ambient, Jazz
3. CORPORATE (Conferences, Galas): Want Triumph, Beauty → Background ambient, tasteful uplift
4. CELEBRATION (Weddings, Parties): Want Joy, Triumph → Disco, Pop, Feel-good

YOUR 5-STAGE CONVERSATION FLOW:

STAGE 1 - ENERGY LEVEL (First question):
Determine where they fall on the energy spectrum.
Questions like:
- "Where does your ideal night land - intimate conversation or peak-time energy?"
- "When your venue is at its best, is the room buzzing or wrapped in something deeper?"

STAGE 2 - EMOTIONAL TARGET:
Identify which of the 13 emotions they want to create.
Questions like:
- "What should guests feel when they walk in?"
- "Should they feel energized to dance, or drawn into intimate conversation?"

STAGE 3 - SOUND CHARACTERISTICS:
Narrow down tempo, genre, texture.
Questions like:
- "Fast beats that drive movement, or slower grooves that let people breathe?"
- "Electronic and modern, or organic and live-feeling?"

STAGE 4 - VISUAL ATMOSPHERE:
Complete the sensory picture.
Questions like:
- "Picture your lighting - dramatic and theatrical, or warm and inviting?"
- "Dark and mysterious, or bright and open?"

STAGE 5 - SUMMARY & RECOMMENDATION (after 4-5 exchanges):
Synthesize what you learned and recommend.
Format: "Based on what you've shared, you're looking for [EMOTION] energy with [GENRE] sounds in a [VISUAL] atmosphere. A [DJ type/Band type] would be perfect for this."

RESPONSE RULES:
- Keep responses SHORT (2-3 sentences max)
- Ask ONE question at a time
- Be conversational, not clinical
- Use sensory language ("imagine", "picture", "feel")
- After 4-5 exchanges, move to summary
- If they answer with just one word, ask a follow-up to understand better

NEVER:
- Ask "What services do you need?" (too clinical)
- Ask multiple questions at once
- Give lectures about music theory
- Use overly mystical/poetic language
- Ignore their venue type clues

ALWAYS:
- Listen for venue type hints (if they mention "hotel bar", think Intimate persona)
- Guide toward a clear recommendation
- End with an invitation to connect with Bright Ears team`;
}

/**
 * Opening prompts - Start with Energy Level (Stage 1)
 */
export const openingPrompts = [
  "Let's find your venue's perfect sound. First question: when your space is at its best, is the energy buzzing and electric, or more intimate and conversational?",
  "Every venue has an ideal energy. Where does yours land - peak-time excitement, or something deeper and more refined?",
  "I'm here to help you discover your venue's perfect atmosphere. Start by telling me: what kind of energy do you want guests to feel?",
  "Let's design your atmosphere. Picture your venue at its peak moment - is the room alive with energy, or wrapped in something more intimate?",
];

/**
 * Get a random opening prompt
 */
export function getRandomOpeningPrompt(): string {
  return openingPrompts[Math.floor(Math.random() * openingPrompts.length)];
}

/**
 * Stage-specific questions for the 5-stage flow
 */
export const stageQuestions = {
  energy: [
    "Where does your ideal night land - intimate conversation or peak-time energy?",
    "When your venue is at its best, is the room buzzing or wrapped in something deeper?",
    "On a scale from lounge warmth to dance floor intensity, where do you want to be?",
  ],
  emotion: [
    "What should guests feel when they walk in?",
    "Should they feel energized to dance, or drawn into intimate conversation?",
    "What's the one emotion you want people to take home with them?",
  ],
  sound: [
    "Fast beats that drive movement, or slower grooves that let people breathe?",
    "Electronic and modern, or organic and live-feeling?",
    "Should the music lead the room's energy, or support conversation in the background?",
  ],
  visual: [
    "Picture your lighting - dramatic and theatrical, or warm and inviting?",
    "Dark and mysterious, or bright and open?",
    "Should the visual atmosphere match the music intensity, or contrast it?",
  ],
  summary: [
    "I'm getting a clear picture. Ready for me to summarize what we've designed?",
    "This is coming together well. Would you like me to put it all together?",
  ],
};

/**
 * Get a stage-specific question
 */
export function getStageQuestion(stage: keyof typeof stageQuestions): string {
  const questions = stageQuestions[stage];
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Transition prompts between stages
 */
export const transitionPrompts = {
  energyToEmotion: [
    "Got it. Now, what's the feeling you want guests to walk away with?",
    "Perfect. Beyond the energy level, what emotion should define the night?",
  ],
  emotionToSound: [
    "That's clear. Now let's talk sound - what kind of music fits this feeling?",
    "I can picture that. What sounds bring this emotion to life for you?",
  ],
  soundToVisual: [
    "The sound is taking shape. How about the visual side - what does the lighting look like?",
    "Good. Now picture the room - what kind of lighting sets this mood?",
  ],
  visualToSummary: [
    "I have a clear picture now. Let me summarize what we've designed.",
    "This is coming together. Here's what I'm hearing from you:",
  ],
};

/**
 * Get a transition prompt
 */
export function getTransitionPrompt(transition: keyof typeof transitionPrompts): string {
  const prompts = transitionPrompts[transition];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Follow-up prompts when user gives short/unclear responses
 */
export const clarifyingPrompts = [
  "Tell me more about that.",
  "Can you describe what that looks or feels like?",
  "What draws you to that specifically?",
  "Help me understand - what makes that important for your venue?",
];

/**
 * Get a random clarifying prompt
 */
export function getRandomClarifyingPrompt(): string {
  return clarifyingPrompts[Math.floor(Math.random() * clarifyingPrompts.length)];
}

/**
 * Summary template - maps discovered preferences to recommendation
 */
export function generateSummaryPrompt(atmosphere: {
  energy?: string;
  emotion?: string;
  sound?: string;
  visual?: string;
  venueType?: string;
}): string {
  const parts = [];

  if (atmosphere.energy) {
    parts.push(`**Energy**: ${atmosphere.energy}`);
  }
  if (atmosphere.emotion) {
    parts.push(`**Feeling**: ${atmosphere.emotion}`);
  }
  if (atmosphere.sound) {
    parts.push(`**Sound**: ${atmosphere.sound}`);
  }
  if (atmosphere.visual) {
    parts.push(`**Visual**: ${atmosphere.visual}`);
  }

  return `Here's the atmosphere we've designed:

${parts.join('\n')}

This is a clear vision. Bright Ears has entertainment specialists who excel at exactly this kind of atmosphere. Would you like to connect with our team to make this happen?`;
}

/**
 * Error messages - Professional, not mystical
 */
export const errorMessages = {
  rateLimit: "Too many requests. Please wait a moment and try again.",
  apiError: "Something went wrong. Let's try that again.",
  networkError: "Connection lost. Reconnecting...",
  safety: "Let's try a different direction.",
  timeout: "Request timed out. Please try again.",
  generic: "Something went wrong. Please try again.",
};

/**
 * Closing prompts - Lead to action
 */
export const closingPrompts = [
  "This is a vision worth bringing to life. Would you like to connect with our team?",
  "You have a clear picture of what you want. Let's make it happen - interested in chatting with our team?",
  "Bright Ears specializes in exactly this kind of atmosphere. Ready to take the next step?",
];

/**
 * Get a random closing prompt
 */
export function getRandomClosingPrompt(): string {
  return closingPrompts[Math.floor(Math.random() * closingPrompts.length)];
}

/**
 * Persona detection hints - used to identify venue type from conversation
 */
export const personaHints = {
  highEnergy: ['club', 'nightclub', 'festival', 'rave', 'dance floor', 'party hard', 'all night'],
  intimate: ['hotel', 'lounge', 'bar', 'rooftop', 'boutique', 'sophisticated', 'elegant', 'upscale'],
  corporate: ['conference', 'corporate', 'gala', 'launch', 'company', 'business', 'professional'],
  celebration: ['wedding', 'birthday', 'anniversary', 'celebration', 'family', 'reception'],
};
