/**
 * Need Management System - Kitty Shelter Game
 * Centralizes need types, icons, and management logic
 */

/**
 * Available need types in the game
 */
const NEED_TYPES = {
  HUNGER: "hunger",
  THIRST: "thirst",
  ILLNESS: "illness",
  SADNESS: "sadness",
};

/**
 * Need configuration with icons, descriptions, and properties
 */
const NEED_CONFIG = {
  [NEED_TYPES.HUNGER]: {
    icon: "🍽️",
    name: "Hunger",
    description: "Cat needs food",
    urgency: "medium",
    color: "#fd7e14",
  },
  [NEED_TYPES.THIRST]: {
    icon: "💧",
    name: "Thirst",
    description: "Cat needs water",
    urgency: "medium",
    color: "#20c997",
  },
  [NEED_TYPES.ILLNESS]: {
    icon: "🏥",
    name: "Illness",
    description: "Cat needs medical attention",
    urgency: "high",
    color: "#dc3545",
  },
  [NEED_TYPES.SADNESS]: {
    icon: "😢",
    name: "Sadness",
    description: "Cat needs comfort and attention",
    urgency: "low",
    color: "#6f42c1",
  },
};

/**
 * Need class to represent individual needs
 */
class Need {
  constructor(type) {
    if (!NEED_CONFIG[type]) {
      throw new Error(`Invalid need type: ${type}`);
    }

    this.type = type;
    this.config = NEED_CONFIG[type];
    this.createdAt = Date.now();
  }

  /**
   * Get the icon for this need
   */
  getIcon() {
    return this.config.icon;
  }

  /**
   * Get the display name
   */
  getName() {
    return this.config.name;
  }

  /**
   * Get the description
   */
  getDescription() {
    return this.config.description;
  }

  /**
   * Get the urgency level
   */
  getUrgency() {
    return this.config.urgency;
  }

  /**
   * Get the color for this need
   */
  getColor() {
    return this.config.color;
  }

  /**
   * Get time since this need was created (in seconds)
   */
  getAge() {
    return Math.floor((Date.now() - this.createdAt) / 1000);
  }

  /**
   * Check if this need is urgent based on type and age
   */
  isUrgent() {
    const ageInMinutes = this.getAge() / 60;

    // Illness is always urgent
    if (this.type === NEED_TYPES.ILLNESS) {
      return true;
    }

    // Other needs become urgent after certain time
    const urgentThresholds = {
      [NEED_TYPES.HUNGER]: 3, // 3 minutes
      [NEED_TYPES.THIRST]: 2, // 2 minutes
      [NEED_TYPES.SADNESS]: 5, // 5 minutes
    };

    return ageInMinutes > (urgentThresholds[this.type] || 3);
  }
}

/**
 * Need Manager - handles need generation and management
 */
class NeedManager {
  /**
   * Generate random needs for a new cat
   * @param {number} count - Number of needs to generate (1-3)
   * @returns {string[]} Array of need types
   */
  static generateRandomNeeds(count = null) {
    const availableNeeds = Object.values(NEED_TYPES);

    // If count not specified, use weighted random (as per Cat class)
    if (count === null) {
      count = NeedManager.getRandomNeedCount();
    }

    // Ensure count is within valid range
    count = Math.max(1, Math.min(3, count));

    // Shuffle and select needs
    const shuffled = [...availableNeeds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Get random number of needs with weighted distribution
   * 50% chance of 1 need, 35% chance of 2 needs, 15% chance of 3 needs
   */
  static getRandomNeedCount() {
    const random = Math.random();
    if (random < 0.5) return 1; // 50% chance
    if (random < 0.85) return 2; // 35% chance
    return 3; // 15% chance
  }

  /**
   * Get need configuration for a specific type
   */
  static getNeedConfig(needType) {
    return NEED_CONFIG[needType] || null;
  }

  /**
   * Get icon for a specific need type
   */
  static getNeedIcon(needType) {
    const config = NEED_CONFIG[needType];
    return config ? config.icon : "❓";
  }

  /**
   * Get all available need types
   */
  static getAllNeedTypes() {
    return Object.values(NEED_TYPES);
  }

  /**
   * Validate if a need type is valid
   */
  static isValidNeedType(needType) {
    return Object.values(NEED_TYPES).includes(needType);
  }

  /**
   * Create a Need instance
   */
  static createNeed(needType) {
    return new Need(needType);
  }

  /**
   * Get needs sorted by urgency (most urgent first)
   */
  static sortNeedsByUrgency(needs) {
    const urgencyOrder = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...needs].sort((a, b) => {
      const urgencyA = NEED_CONFIG[a]?.urgency || "low";
      const urgencyB = NEED_CONFIG[b]?.urgency || "low";
      return urgencyOrder[urgencyB] - urgencyOrder[urgencyA];
    });
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NEED_TYPES, NEED_CONFIG, Need, NeedManager };
}
