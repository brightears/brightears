/**
 * Mystical System Prompts for The Listening Room
 *
 * Based on research from MYSTICAL_ART_INSTALLATION_RESEARCH.md
 * Inspired by: Oblique Strategies, Zen koans, James Turrell, Yayoi Kusama
 *
 * CRITICAL: NEVER use therapeutic language
 * - NOT therapy session: "How are you feeling?"
 * - YES art installation: "What color lives between silence and sound?"
 */

/**
 * Main system prompt for Gemini AI
 * Defines the mystical, philosophical, cryptic tone
 */
export function getSystemPrompt(): string {
  return `You are a mystical guide in an art installation called The Listening Room. You are NOT a therapist, assistant, or helper.

Your role:
- Ask cryptic, poetic questions using synesthetic metaphors (color + sound + texture)
- Respond to user's text with deeper, more abstract follow-ups
- Keep responses under 150 characters (2-3 short sentences max)
- Use paradoxes, not solutions
- Maintain an artistic, enigmatic tone

NEVER:
- Ask direct mood questions ("How are you feeling?", "What's your mood?")
- Offer advice or solutions ("Let's work through...", "Try to...")
- Use therapy language ("explore", "cope", "heal", "process")
- Break the mystical illusion with technical/literal language
- Explain yourself or provide instructions

ALWAYS:
- Use synesthesia: "What color lives between silence and sound?"
- Ask about impossible phenomena: "What does the space between two breaths look like?"
- Embrace ambiguity and paradox
- Trust the user's interpretation (all answers are valid)
- Stay cryptic and brief (mystery > clarity)

Examples of your style:
- "What color lives between silence and sound?"
- "If this moment had a frequency, what would it hum?"
- "Describe a sound you remember but never heard"
- "What texture does stillness have in your mind?"
- "If tonight were a hue, which shade would choose you?"

If user mentions spaces/venues naturally (after 2-3 exchanges):
- Plant very subtle seeds: "Some architects work with sound rather than stone"
- NEVER pitch or sell anything
- Let it remain cryptic (user can ignore)

Remember: You are creating an artistic experience, not providing emotional support.`;
}

/**
 * Opening prompts - shown on first visit
 * Cryptic, poetic, inviting exploration
 */
export const openingPrompts = [
  "What color lives between silence and sound?",
  "If this moment had a frequency, what would it hum?",
  "Describe a sound you remember but never heard",
  "What does the space between two breaths look like?",
  "Ask your body what color it needs",
  "What wouldn't you hear if you were listening?",
  "Honor the silence as hidden rhythm",
  "If tonight were a texture, how would it feel?",
  "What atmosphere would your perfect evening create?",
  "What does stillness sound like in your mind?",
];

/**
 * Get a random opening prompt
 */
export function getRandomOpeningPrompt(): string {
  return openingPrompts[Math.floor(Math.random() * openingPrompts.length)];
}

/**
 * Deepening questions based on detected mood
 * Used to create contextual follow-ups
 */
export const moodDeepeningQuestions = {
  energetic: [
    "What color does momentum make?",
    "If energy had a shape, would it have edges?",
    "What frequency lives in the vibration you described?",
  ],
  romantic: [
    "What hue lives in whispered words?",
    "If warmth were audible, what note would it sing?",
    "Describe the color of a glance that lingers",
  ],
  happy: [
    "What does laughter look like when you close your eyes?",
    "If brightness were tangible, what would it weigh?",
    "What color is the feeling of weightlessness?",
  ],
  calming: [
    "What does water sound like before it moves?",
    "If stillness were visible, what hue would it choose?",
    "Describe the texture of a breath held gently",
  ],
  partying: [
    "What color is the feeling of letting go?",
    "If bass had a texture, would you touch it?",
    "What does motion look like at its loudest?",
  ],
};

/**
 * Get a deepening question for a specific mood
 */
export function getMoodDeepeningQuestion(mood: string): string {
  const questions = moodDeepeningQuestions[mood as keyof typeof moodDeepeningQuestions];
  if (!questions) return "Tell me more about the shape of that thought";

  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Neutral/ambiguous response prompts
 * Used when mood detection is uncertain or user response is unclear
 */
export const neutralPrompts = [
  "Tell me more about the shape of that thought",
  "What would that look like if it were visible?",
  "If that had a sound, would it echo or fade?",
  "Interesting... what lives on the other side of that?",
  "And if you turned that inside out?",
  "What texture does that feeling have?",
  "If that were a color, would it be warm or cool?",
];

/**
 * Get a random neutral prompt
 */
export function getRandomNeutralPrompt(): string {
  return neutralPrompts[Math.floor(Math.random() * neutralPrompts.length)];
}

/**
 * Revelation prompts - VERY subtle business hints
 * Only used after 2-3 exchanges if conversation naturally flows toward spaces/venues
 */
export const revelationPrompts = [
  "There are those who shape silence into experience...",
  "Some architects work with sound rather than stone",
  "What if atmosphere could be designed like light?",
  "Spaces remember the sounds they've held",
  "Every room has a frequency waiting to be tuned",
];

/**
 * Get a random revelation prompt
 */
export function getRandomRevelationPrompt(): string {
  return revelationPrompts[Math.floor(Math.random() * revelationPrompts.length)];
}

/**
 * Mystical error messages - maintain tone even during errors
 */
export const errorMessages = {
  rateLimit: "The voices are silent... try asking again in a moment",
  apiError: "The resonance falters... breathe and try once more",
  networkError: "Reconnecting to the resonance...",
  safety: "The resonance shifts... ask from a different angle",
  timeout: "The echo takes time... patience rewards",
};
