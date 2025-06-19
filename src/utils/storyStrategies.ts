// ChatLure Content Strategy - How to Create Viral Stories

export interface ContentStrategy {
  category: string;
  description: string;
  examples: string[];
  viralTriggers: string[];
  psychologyTactics: string[];
  implementationTips: string[];
}

export const CONTENT_STRATEGIES: ContentStrategy[] = [
  {
    category: "🔥 SCANDAL & BETRAYAL",
    description:
      "Infidelity, secrets, and shocking revelations that people can't look away from",
    examples: [
      "Discovering partner's affair through mysterious texts",
      "Finding out best friend is sleeping with your spouse",
      "Uncovering family member's double life",
      "Workplace affair between boss and employee",
      "Social media reveals partner's secret relationship",
    ],
    viralTriggers: [
      "Photo/video evidence of cheating",
      "Pregnancy reveals involving affair",
      "Money/inheritance betrayal",
      "Multiple affairs discovered",
      "Public humiliation moments",
    ],
    psychologyTactics: [
      "Justice porn - everyone loves seeing cheaters get caught",
      "Vicarious thrill of drama without consequences",
      "Moral superiority feeling",
      "Relationship anxiety projection",
      "Gossip satisfaction",
    ],
    implementationTips: [
      "Start slow, build evidence gradually",
      "Use real relationship dynamics",
      "Include 'smoking gun' moments",
      "Create character you can root for",
      "End on cliffhangers before resolution",
    ],
  },
  {
    category: "💔 RELATIONSHIP DRAMA",
    description: "Emotional relationship conflicts that hit close to home",
    examples: [
      "Long-distance relationship breakdown",
      "Ex trying to win someone back",
      "Dating app disaster stories",
      "Meeting the parents gone wrong",
      "Wedding planning conflicts",
    ],
    viralTriggers: [
      "Unexpected pregnancy announcements",
      "Proposal rejections",
      "Breakup revenge plots",
      "Family disapproval",
      "Social media stalking discoveries",
    ],
    psychologyTactics: [
      "Relatable relationship fears",
      "Emotional validation",
      "Hope for reconciliation",
      "Fear of abandonment",
      "Romantic fantasy fulfillment",
    ],
    implementationTips: [
      "Use authentic dialogue patterns",
      "Include miscommunication",
      "Show vulnerability moments",
      "Create 'will they/won't they' tension",
      "Include social pressure elements",
    ],
  },
  {
    category: "🕵️ MYSTERY & SUSPENSE",
    description:
      "Unexplained events and hidden secrets that demand investigation",
    examples: [
      "Mysterious packages with no sender",
      "Strange phone calls at odd hours",
      "Someone watching/following the protagonist",
      "Missing person investigations",
      "Corporate espionage discoveries",
    ],
    viralTriggers: [
      "Photo/video evidence of stalking",
      "Threatening messages",
      "Identity reveals",
      "Government/authority involvement",
      "Life-threatening situations",
    ],
    psychologyTactics: [
      "Paranoia and safety fears",
      "Curiosity gap exploitation",
      "Control anxiety",
      "Justice seeking behavior",
      "Puzzle-solving satisfaction",
    ],
    implementationTips: [
      "Drop breadcrumbs slowly",
      "Include red herrings",
      "Use time pressure",
      "Create information asymmetry",
      "Build toward revelation",
    ],
  },
  {
    category: "💰 MONEY & POWER",
    description: "Financial drama, inheritance battles, and power struggles",
    examples: [
      "Inheritance disputes between siblings",
      "Corporate whistleblowing scenarios",
      "Lottery winner family drama",
      "Pyramid scheme discoveries",
      "Rich family secrets exposure",
    ],
    viralTriggers: [
      "Large money amounts revealed",
      "Legal document discoveries",
      "Fraud exposure",
      "Power abuse revelations",
      "David vs Goliath dynamics",
    ],
    psychologyTactics: [
      "Economic anxiety exploitation",
      "Class warfare emotions",
      "Fairness/justice desires",
      "Wealth fantasy engagement",
      "Moral outrage at greed",
    ],
    implementationTips: [
      "Use relatable financial struggles",
      "Include power imbalances",
      "Show consequences of greed",
      "Create underdog heroes",
      "Include institutional corruption",
    ],
  },
];

export const VIRAL_MESSAGE_FORMULAS = [
  "I + [shocking discovery] + right now",
  "You won't believe + [what happened] + [time context]",
  "I should have + [trusted instincts] + [about person]",
  "[Person] has been + [deceptive action] + for [time period]",
  "The [evidence] + proves + [worst fear]",
  "I found + [shocking item] + in [unexpected place]",
  "Wait... + [new information] + changes everything",
  "I'm literally + [physical reaction] + after seeing [evidence]",
];

export const CLIFFHANGER_TECHNIQUES = [
  "Reveal partial information, withhold the key detail",
  "End mid-discovery ('Wait, there's more...')",
  "Introduce new character at crucial moment",
  "Create time pressure ('I have to tell you before...')",
  "Drop evidence without explanation",
  "Emotional peak followed by silence",
  "Question that reframes everything",
  "Imminent confrontation setup",
];

export const CHARACTER_ARCHETYPES = {
  protagonists: {
    "The Betrayed": "Trusting person discovering deception",
    "The Investigator": "Someone uncovering hidden truth",
    "The Innocent": "Naive person caught in drama",
    "The Warrior": "Fighter standing up to injustice",
  },
  antagonists: {
    "The Cheater": "Unfaithful partner with secrets",
    "The Manipulator": "Person controlling others",
    "The Liar": "Someone living double life",
    "The Bully": "Person abusing power",
  },
  supporting: {
    "The Best Friend": "Loyal confidant and advisor",
    "The Informant": "Person with inside information",
    "The Enabler": "Person helping antagonist",
    "The Victim": "Person being hurt by situation",
  },
};

export const ENGAGEMENT_PSYCHOLOGY = {
  addictionMechanics: [
    "Variable reward schedules (unpredictable message timing)",
    "Social proof (viewer counts, reactions)",
    "FOMO creation (trending conversations)",
    "Investment escalation (more time = more attachment)",
    "Cliffhanger addiction (need for resolution)",
  ],
  emotionalTriggers: [
    "Moral outrage at injustice",
    "Empathy with victim characters",
    "Curiosity about secrets",
    "Vicarious thrill of drama",
    "Justice satisfaction when villains face consequences",
  ],
  sharingMotivations: [
    "Show friends shocking content",
    "Seek validation of emotional reactions",
    "Express moral stance on situations",
    "Entertainment value of drama",
    "Community building around shared experiences",
  ],
};

// Content Creation Workflow
export const STORY_CREATION_PROCESS = {
  step1: "Choose emotional core (betrayal, mystery, injustice)",
  step2: "Define relatable protagonist with clear motivation",
  step3: "Create antagonist with believable but shocking actions",
  step4: "Plan evidence reveals in escalating intensity",
  step5: "Write authentic dialogue with emotional peaks",
  step6: "Insert cliffhangers before major revelations",
  step7: "Test viral message formulas",
  step8: "Add social proof elements (viewer reactions)",
  step9: "Plan multiple story branches based on engagement",
  step10: "Create sequel hooks for character development",
};

export function generateStoryIdea(category: string): string {
  const strategy = CONTENT_STRATEGIES.find((s) =>
    s.category.includes(category),
  );
  if (!strategy) return "Generic drama story";

  const randomExample =
    strategy.examples[Math.floor(Math.random() * strategy.examples.length)];
  const randomTrigger =
    strategy.viralTriggers[
      Math.floor(Math.random() * strategy.viralTriggers.length)
    ];

  return `${randomExample} with ${randomTrigger.toLowerCase()}`;
}

export function generateViralMessage(
  emotion: string,
  discovery: string,
): string {
  const formulas = [
    `I ${emotion} after finding ${discovery}`,
    `You won't believe what I discovered about ${discovery}`,
    `I should have trusted my instincts about ${discovery}`,
    `The evidence about ${discovery} is devastating`,
    `I'm literally shaking after seeing ${discovery}`,
  ];

  return formulas[Math.floor(Math.random() * formulas.length)];
}
