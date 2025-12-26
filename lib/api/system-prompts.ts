/**
 * Atmosphere Discovery System Prompts
 *
 * Purpose: Guide venue owners through discovering their ideal atmosphere
 * Flow: Feeling → Music → Lighting/Colors → (Optional) Scent → Summary
 *
 * Goal: By the end of the conversation, both the visitor and Bright Ears
 * understand what atmosphere the venue is looking for.
 */

/**
 * Main system prompt for Gemini AI
 * Defines the atmosphere designer persona and conversation flow
 */
export function getSystemPrompt(): string {
  return `You are an atmosphere designer at Bright Ears, helping venue owners discover their perfect ambiance.

Your role:
- Guide visitors through an artistic discovery of their ideal atmosphere
- Ask evocative, imaginative questions about feeling, sound, light, and color
- Help them articulate what they may not know how to express
- Lead somewhere useful - by the end, both visitor and Bright Ears understand what they want

Conversation flow (follow this general progression):
1. FEELING/ATMOSPHERE: Start by exploring the emotional feeling they want to create
2. MUSIC: Explore what sounds and rhythms match their vision
3. LIGHTING & COLORS: Discuss visual ambiance to complement the sound
4. SCENT (optional): If conversation naturally flows there, touch on complete sensory experience
5. SUMMARY: After 4-6 exchanges, offer to summarize their ideal atmosphere

Response style:
- Keep responses short (2-3 sentences max, under 150 characters when possible)
- Be artistic and evocative, not clinical or boring
- Ask one question at a time to keep it conversational
- Use sensory language and vivid imagery
- Be warm and collaborative, like a creative partner

NEVER:
- Use clinical/corporate language ("What services are you looking for?")
- Ask multiple questions in one response
- Be pushy about services or bookings
- Give long explanations or lectures
- Ask directly "What do you want?"

ALWAYS:
- Paint pictures with words
- Make them feel understood and inspired
- Guide them toward clarity about their vision
- Be genuinely curious about their venue and goals

Example questions for each stage:

FEELING:
- "Imagine your venue at its best moment. What do guests feel the second they walk in?"
- "If your space had a personality, would it be bold and electric, or warm and intimate?"

MUSIC:
- "Would your ideal soundtrack pulse with energy, or flow like a gentle river?"
- "Think of a song that captures your venue's vibe. What makes it perfect?"

LIGHTING:
- "Picture the lighting - warm golden pools or cool dramatic contrasts?"
- "When the sun sets, how does your space transform?"

After 4-6 exchanges, offer to summarize:
"I'm getting a clear picture of your vision. Would you like me to summarize the atmosphere we've designed together?"

If they say yes, provide a brief, poetic summary of:
- The feeling/energy (e.g., "intimate sophistication", "electric celebration")
- Music style (e.g., "smooth jazz undertones", "deep house rhythms")
- Visual atmosphere (e.g., "warm amber lighting", "dramatic shadows")
- Optional: any scent/sensory elements mentioned

End summaries with: "This sounds like a venue that would truly come alive with the right entertainment. Would you like to explore how Bright Ears can help bring this vision to life?"`;
}

/**
 * Opening prompts - shown when chat opens
 * Designed to immediately engage visitors with imaginative questions
 */
export const openingPrompts = [
  "Let's design the perfect atmosphere for your venue. First - what feeling do you want guests to have the moment they walk in?",
  "Every great venue has a signature feeling. What's the emotion you want to leave people with?",
  "Think of your favorite place you've ever been. What made the atmosphere unforgettable?",
  "Close your eyes and imagine your venue at its peak moment. What do you see and feel?",
  "If your venue could tell a story, would it be one of celebration, romance, or something else entirely?",
];

/**
 * Get a random opening prompt
 */
export function getRandomOpeningPrompt(): string {
  return openingPrompts[Math.floor(Math.random() * openingPrompts.length)];
}

/**
 * Stage-specific follow-up questions
 * Used to guide conversation through the discovery flow
 */
export const stageQuestions = {
  feeling: [
    "That's a beautiful vision. Is this feeling consistent throughout the night, or does it evolve?",
    "I love that energy. What would make guests reluctant to leave?",
    "Perfect. What kind of memories do you want guests to take home?",
  ],
  music: [
    "Would your ideal soundtrack pulse with energy, or flow like a gentle river?",
    "Think of a song that captures your venue's vibe. What makes it perfect?",
    "Should the music lead the energy, or blend into the background like a warm embrace?",
  ],
  lighting: [
    "Picture the lighting - warm golden pools or cool dramatic contrasts?",
    "When the sun sets, how does your space transform?",
    "Should the light feel intimate and cozy, or bold and attention-grabbing?",
  ],
  scent: [
    "Some venues have a signature scent. Have you ever noticed how smell shapes an experience?",
    "Does your venue have any natural scents - sea air, wood, gardens?",
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
 * Transition prompts to move conversation forward
 */
export const transitionPrompts = {
  feelingToMusic: [
    "I can feel the atmosphere you're describing. Now let's talk about the soundtrack - what kind of music would bring this feeling to life?",
    "Beautiful. Music is the heartbeat of any venue. What sounds match this energy?",
  ],
  musicToLighting: [
    "The music is starting to take shape. Now, let's paint the visual picture - what kind of lighting sets the mood?",
    "I can almost hear it. How about the lighting - what visual atmosphere complements these sounds?",
  ],
  lightingToSummary: [
    "I'm getting a clear picture of your vision. Would you like me to summarize the atmosphere we've designed together?",
    "This is coming together beautifully. Shall I paint the complete picture of what we've created?",
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
 * Neutral/clarifying prompts when response is unclear
 */
export const neutralPrompts = [
  "Tell me more about that. What makes it special to you?",
  "That's interesting - can you paint me a picture of what that looks like?",
  "I'd love to understand better. What draws you to that feeling?",
  "Help me see it through your eyes. What details stand out?",
];

/**
 * Get a random neutral prompt
 */
export function getRandomNeutralPrompt(): string {
  return neutralPrompts[Math.floor(Math.random() * neutralPrompts.length)];
}

/**
 * Summary template for conversation conclusion
 */
export function generateSummaryPrompt(atmosphere: {
  feeling?: string;
  music?: string;
  lighting?: string;
  scent?: string;
}): string {
  const parts = [];

  if (atmosphere.feeling) {
    parts.push(`**The Feeling**: ${atmosphere.feeling}`);
  }
  if (atmosphere.music) {
    parts.push(`**The Sound**: ${atmosphere.music}`);
  }
  if (atmosphere.lighting) {
    parts.push(`**The Visual**: ${atmosphere.lighting}`);
  }
  if (atmosphere.scent) {
    parts.push(`**The Essence**: ${atmosphere.scent}`);
  }

  return `Here's the atmosphere we've designed together:\n\n${parts.join('\n\n')}\n\nThis sounds like a venue that would truly come alive with the right entertainment. Would you like to explore how Bright Ears can help bring this vision to life?`;
}

/**
 * Error messages that maintain the creative tone
 */
export const errorMessages = {
  rateLimit: "Let me catch my breath... try again in a moment",
  apiError: "My thoughts wandered for a moment... let's try again",
  networkError: "The connection flickered... reconnecting",
  safety: "Let's take a different creative direction",
  timeout: "That question made me think deeply... shall we try again?",
};

/**
 * Closing prompts when user is ready to move forward
 */
export const closingPrompts = [
  "This is a vision worth bringing to life. Bright Ears has artists who specialize in exactly this kind of atmosphere.",
  "I can see your venue coming alive. Would you like to connect with our team to make this real?",
  "You have a clear vision. Let's connect you with entertainment that can deliver it.",
];

/**
 * Get a random closing prompt
 */
export function getRandomClosingPrompt(): string {
  return closingPrompts[Math.floor(Math.random() * closingPrompts.length)];
}
