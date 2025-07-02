/**
 * Main Game Logic - Kitty Shelter Game
 */
class KittyShelterGame {
  constructor() {
    this.cats = new Map(); // Store cats by ID
    this.nextCatId = 1;
    this.catsHelped = 0;
    this.isGameRunning = false;

    // DOM elements
    this.catsContainer = document.getElementById("cats-container");
    this.catsHelpedElement = document.getElementById("cats-helped");
    this.activeCatsElement = document.getElementById("active-cats");

    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    console.log("🐱 Kitty Shelter Game Starting...");

    // Listen for cat click events
    document.addEventListener("catClicked", (event) => {
      this.handleCatClick(event.detail.cat);
    });

    // Update UI
    this.updateUI();

    // Start the game
    this.isGameRunning = true;

    console.log("✅ Game initialized successfully!");

    // Add some demo cats for testing
    this.addDemoCats();
  }

  /**
   * Add demo cats for testing the UI
   */
  addDemoCats() {
    console.log("Adding demo cats for testing...");

    // Add 3 demo cats with different needs
    setTimeout(() => this.addCat(), 500);
    setTimeout(() => this.addCat(), 1000);
    setTimeout(() => this.addCat(), 1500);
  }

  /**
   * Add a new cat to the shelter
   */
  addCat(name = null) {
    const cat = new Cat(this.nextCatId++, name);
    this.cats.set(cat.id, cat);

    // Add to DOM
    this.catsContainer.appendChild(cat.element);

    // Update UI
    this.updateUI();

    console.log(
      `🐱 New cat ${cat.name} arrived with needs: ${cat.needs.join(", ")}`
    );

    return cat;
  }

  /**
   * Remove a cat from the shelter
   */
  removeCat(catId) {
    const cat = this.cats.get(catId);
    if (cat) {
      cat.remove();
      this.cats.delete(catId);
      this.updateUI();

      console.log(`👋 ${cat.name} left the shelter`);
      return true;
    }
    return false;
  }

  /**
   * Handle cat click events
   */
  handleCatClick(cat) {
    console.log(`🖱️ Player clicked on ${cat.name}`);

    // For now, just show cat info
    // Later this will be used for need fulfillment
    this.showCatInfo(cat);
  }

  /**
   * Show cat information (for testing/debugging)
   */
  showCatInfo(cat) {
    const info = cat.getInfo();
    console.log("Cat Info:", info);

    // You could add a modal or tooltip here later
    alert(
      `Cat: ${info.name}\nColor: ${info.color}\nNeeds: ${info.needs.join(
        ", "
      )}\nHearts: ${info.hearts}/3`
    );
  }

  /**
   * Update the game UI
   */
  updateUI() {
    // Update stats
    this.activeCatsElement.textContent = this.cats.size;
    this.catsHelpedElement.textContent = this.catsHelped;

    // Log current state
    console.log(
      `📊 Game State: ${this.cats.size} active cats, ${this.catsHelped} cats helped`
    );
  }

  /**
   * Get all cats
   */
  getAllCats() {
    return Array.from(this.cats.values());
  }

  /**
   * Get cats by need type
   */
  getCatsByNeed(needType) {
    return this.getAllCats().filter((cat) => cat.needs.includes(needType));
  }

  /**
   * Get cats by state
   */
  getCatsByState(state) {
    return this.getAllCats().filter((cat) => cat.state === state);
  }

  /**
   * Test function to add a cat with specific needs
   */
  addTestCat(needs = null, name = null) {
    const cat = this.addCat(name);

    if (needs) {
      cat.needs = Array.isArray(needs) ? needs : [needs];
      cat.updateNeedDisplay();
      cat.updateState();
    }

    return cat;
  }

  /**
   * Clear all cats (for testing)
   */
  clearAllCats() {
    this.cats.forEach((cat) => cat.remove());
    this.cats.clear();
    this.updateUI();
    console.log("🧹 All cats cleared");
  }

  /**
   * Get game statistics
   */
  getStats() {
    const cats = this.getAllCats();
    const stats = {
      totalCats: cats.length,
      catsHelped: this.catsHelped,
      catsByState: {
        happy: this.getCatsByState("happy").length,
        stressed: this.getCatsByState("stressed").length,
        sick: this.getCatsByState("sick").length,
        urgent: this.getCatsByState("urgent").length,
      },
      catsByNeeds: {
        hunger: this.getCatsByNeed("hunger").length,
        thirst: this.getCatsByNeed("thirst").length,
        illness: this.getCatsByNeed("illness").length,
        sadness: this.getCatsByNeed("sadness").length,
      },
    };

    return stats;
  }

  /**
   * Debug function to log game state
   */
  debug() {
    console.log("🐛 Game Debug Info:");
    console.log(
      "Cats:",
      Array.from(this.cats.values()).map((cat) => cat.getInfo())
    );
    console.log("Stats:", this.getStats());
  }
}

// Global game instance
let game;

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  game = new KittyShelterGame();

  // Make game available globally for testing
  window.game = game;

  // Add some helpful console commands for testing
  console.log("🎮 Game loaded! Try these commands in the console:");
  console.log("game.addCat() - Add a random cat");
  console.log(
    'game.addTestCat(["hunger", "thirst"], "TestCat") - Add cat with specific needs'
  );
  console.log("game.clearAllCats() - Remove all cats");
  console.log("game.debug() - Show debug info");
  console.log("game.getStats() - Show game statistics");
});
