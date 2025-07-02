/**
 * Main Game Logic - Kitty Shelter Game
 */
class KittyShelterGame {
  constructor() {
    this.cats = new Map(); // Store cats by ID
    this.nextCatId = 1;
    this.catsHelped = 0;
    this.isGameRunning = false;
    this.maxCats = 8; // Maximum cats on screen
    this.arrivalTimer = null; // Timer for cat arrivals

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

    // Add initial cats for immediate gameplay
    this.addInitialCats();

    // Start automatic cat arrivals
    this.startCatArrivals();

    console.log("✅ Game initialized successfully!");
  }

  /**
   * Add initial cats when game starts (3 cats for immediate gameplay)
   */
  addInitialCats() {
    console.log("🐱 Adding initial cats to shelter...");

    // Add 3 initial cats with slight delays for visual effect
    setTimeout(() => this.addCat(), 100);
    setTimeout(() => this.addCat(), 300);
    setTimeout(() => this.addCat(), 500);

    console.log("✅ Initial cats added to shelter");
  }

  /**
   * Start automatic cat arrivals with random timing
   */
  startCatArrivals() {
    if (!this.isGameRunning) return;

    // Schedule next cat arrival (10-30 seconds)
    const arrivalDelay = Math.random() * 20000 + 10000; // 10-30 seconds in milliseconds

    this.arrivalTimer = setTimeout(() => {
      if (this.cats.size < this.maxCats) {
        this.addCat();
        console.log(
          `⏰ Next cat will arrive in ${Math.round(
            arrivalDelay / 1000
          )} seconds`
        );
      } else {
        console.log("🏠 Shelter is full! Waiting for space...");
      }

      // Schedule next arrival
      this.startCatArrivals();
    }, arrivalDelay);

    console.log(
      `⏰ Next cat will arrive in ${Math.round(arrivalDelay / 1000)} seconds`
    );
  }

  /**
   * Stop automatic cat arrivals
   */
  stopCatArrivals() {
    if (this.arrivalTimer) {
      clearTimeout(this.arrivalTimer);
      this.arrivalTimer = null;
    }
  }

  /**
   * Add a new cat to the shelter
   */
  addCat(name = null) {
    // Check if shelter is full
    if (this.cats.size >= this.maxCats) {
      console.log("🏠 Shelter is full! Cannot add more cats.");
      return null;
    }

    const cat = new Cat(this.nextCatId++, name);
    this.cats.set(cat.id, cat);

    // Position the cat to avoid overlap
    this.positionCat(cat);

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
   * Position a cat to avoid overlap with existing cats
   */
  positionCat(cat) {
    // CSS Grid handles positioning automatically
    // The 'arriving' CSS class provides the visual animation

    console.log(`📍 Positioning ${cat.name} in the shelter`);
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

      // If shelter was full, this creates space for new arrivals
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
      `📊 Game State: ${this.cats.size}/${this.maxCats} cats, ${this.catsHelped} cats helped`
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

    if (cat && needs) {
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
   * Pause/Resume the game
   */
  pauseGame() {
    this.isGameRunning = false;
    this.stopCatArrivals();
    console.log("⏸️ Game paused");
  }

  resumeGame() {
    this.isGameRunning = true;
    this.startCatArrivals();
    console.log("▶️ Game resumed");
  }

  /**
   * Debug functions for testing
   */
  debug() {
    console.log("🔧 Debug Mode Activated");
    console.log("Available commands:");
    console.log("- game.addTestCat(['hunger', 'thirst'], 'TestCat')");
    console.log("- game.clearAllCats()");
    console.log("- game.pauseGame() / game.resumeGame()");
    console.log("- game.getStats()");
    console.log(`- Current cats: ${this.cats.size}/${this.maxCats}`);

    // Add some test cats for immediate testing
    console.log("Adding test cats...");
    this.addTestCat(["hunger"], "Hungry Cat");
    this.addTestCat(["thirst", "sadness"], "Thirsty Cat");
    this.addTestCat(["illness"], "Sick Cat");
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
