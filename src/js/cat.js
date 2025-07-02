/**
 * Cat class - Represents an individual cat in the shelter
 */
class Cat {
  constructor(id, name = null) {
    this.id = id;
    this.name = name || this.generateRandomName();
    this.needs = [];
    this.hearts = 3;
    this.element = null;
    this.position = { x: 0, y: 0 };
    this.state = "happy"; // happy, stressed, sick, urgent
    this.arrivalTime = Date.now(); // Track when cat arrived

    // Cat appearance
    this.color = this.getRandomColor();
    this.icon = this.getCatIcon();

    this.createElement();
    this.generateRandomNeeds();
  }

  /**
   * Generate a random cat name
   */
  generateRandomName() {
    const names = [
      "Whiskers",
      "Mittens",
      "Shadow",
      "Luna",
      "Oliver",
      "Bella",
      "Max",
      "Lucy",
      "Charlie",
      "Lily",
      "Milo",
      "Chloe",
      "Leo",
      "Nala",
      "Simba",
      "Zoe",
      "Tiger",
      "Princess",
      "Smokey",
      "Angel",
      "Buddy",
      "Coco",
      "Oreo",
      "Patches",
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  /**
   * Get random cat color
   */
  getRandomColor() {
    const colors = ["orange", "calico", "white", "black", "tabby"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get cat icon based on color
   */
  getCatIcon() {
    const icons = {
      orange: "assets/cats/orange-cat-1.png",
      calico: "assets/cats/calico-cat-1.png",
      white: "assets/cats/white-cat-1.png",
      black: "assets/cats/black-cat-1.png",
      tabby: "assets/cats/tabby-cat-1.png",
    };
    return icons[this.color] || "assets/cats/tabby-cat-1.png";
  }

  /**
   * Generate random needs for the cat (1-3 needs as per requirements)
   */
  generateRandomNeeds() {
    // Use the NeedManager to generate random needs
    this.needs = NeedManager.generateRandomNeeds();

    console.log(
      `🎲 ${this.name} generated ${this.needs.length} needs: ${this.needs.join(
        ", "
      )}`
    );

    this.updateNeedDisplay();
    this.updateState();
  }

  /**
   * Get random number of needs (1-3) with weighted distribution
   * 50% chance of 1 need, 35% chance of 2 needs, 15% chance of 3 needs
   * (Now delegated to NeedManager)
   */
  getRandomNeedCount() {
    return NeedManager.getRandomNeedCount();
  }

  /**
   * Create the DOM element for the cat
   */
  createElement() {
    this.element = document.createElement("div");
    this.element.className = `cat ${this.state} arriving`;
    this.element.dataset.catId = this.id;

    // Check if icon is an image path or emoji
    const iconContent = this.icon.includes(".png")
      ? `<img src="${this.icon}" alt="${this.color} cat" class="cat-image">`
      : this.icon;

    this.element.innerHTML = `
            <div class="cat-needs"></div>
            <div class="cat-icon">${iconContent}</div>
            <div class="cat-name">${this.name}</div>
            <div class="cat-hearts">
                ${"❤️".repeat(this.hearts)}${"🤍".repeat(3 - this.hearts)}
            </div>
        `;

    // Remove arriving animation after it completes
    setTimeout(() => {
      this.element.classList.remove("arriving");
    }, 600);

    // Setup click handler and drag/drop
    this.element.addEventListener("click", () => {
      this.handleClick();
    });

    // Setup drag and drop handlers for receiving inventory items
    this.setupDragAndDrop();
  }

  /**
   * Update the need icons display
   */
  updateNeedDisplay() {
    if (!this.element) return;

    const needsContainer = this.element.querySelector(".cat-needs");
    needsContainer.innerHTML = "";

    this.needs.forEach((need) => {
      const needIcon = document.createElement("div");
      needIcon.className = `need-icon ${need}`;
      needIcon.innerHTML = this.getNeedIcon(need);
      needsContainer.appendChild(needIcon);
    });
  }

  /**
   * Get icon for specific need type
   */
  getNeedIcon(need) {
    return NeedManager.getNeedIcon(need);
  }

  /**
   * Handle cat click events
   */
  handleClick() {
    // Dispatch custom event for game to handle
    const event = new CustomEvent("catClicked", {
      detail: { cat: this },
    });
    document.dispatchEvent(event);
  }

  /**
   * Fulfill a specific need
   */
  fulfillNeed(needType) {
    const needIndex = this.needs.indexOf(needType);
    if (needIndex !== -1) {
      this.needs.splice(needIndex, 1);
      this.updateNeedDisplay();

      // Update cat state based on remaining needs
      this.updateState();

      console.log(
        `${
          this.name
        }'s ${needType} need fulfilled! Remaining needs: ${this.needs.join(
          ", "
        )}`
      );
      return true;
    }
    return false;
  }

  /**
   * Update cat's emotional state based on needs and time
   */
  updateState() {
    const oldState = this.state;
    const needCount = this.needs.length;
    const timeSinceArrival = Date.now() - this.arrivalTime;
    const minutesSinceArrival = timeSinceArrival / (1000 * 60);

    // Determine state based on needs and time
    if (needCount === 0) {
      this.state = "happy";
    } else if (needCount >= 3 || this.needs.includes("illness")) {
      this.state = "urgent";
    } else if (needCount >= 2 || minutesSinceArrival > 2) {
      this.state = "stressed";
    } else if (this.needs.includes("illness")) {
      this.state = "sick";
    } else {
      this.state = "stressed";
    }

    // Update visual state if changed
    if (oldState !== this.state) {
      this.element.className = `cat ${this.state}`;
      console.log(`😸 ${this.name} is now ${this.state} (${needCount} needs)`);
    }
  }

  /**
   * Lose a heart (when needs aren't met in time)
   */
  loseHeart() {
    if (this.hearts > 0) {
      this.hearts--;
      this.updateHeartsDisplay();

      if (this.hearts === 0) {
        this.state = "leaving";
        return true; // Cat is leaving
      }
    }
    return false;
  }

  /**
   * Update hearts display
   */
  updateHeartsDisplay() {
    const heartsContainer = this.element.querySelector(".cat-hearts");
    heartsContainer.innerHTML =
      "❤️".repeat(this.hearts) + "🤍".repeat(3 - this.hearts);
  }

  /**
   * Remove cat from display
   */
  remove() {
    if (this.element && this.element.parentNode) {
      // Add leaving animation
      this.element.style.opacity = "0";
      this.element.style.transform = "scale(0.8)";

      setTimeout(() => {
        this.element.remove();
      }, 300);
    }
  }

  /**
   * Add a new need to the cat (for dynamic gameplay)
   */
  addNeed(needType) {
    if (!this.needs.includes(needType)) {
      this.needs.push(needType);
      this.updateNeedDisplay();
      this.updateState();
      console.log(`➕ ${this.name} developed ${needType} need`);
      return true;
    }
    return false;
  }

  /**
   * Get time since cat arrived (for urgency calculations)
   */
  getTimeSinceArrival() {
    return Date.now() - this.arrivalTime;
  }

  /**
   * Get cat's urgency level (0-1, where 1 is most urgent)
   */
  getUrgencyLevel() {
    const needCount = this.needs.length;
    const timeSinceArrival = this.getTimeSinceArrival() / (1000 * 60); // minutes

    // Base urgency from need count
    let urgency = needCount / 3; // 0-1 based on needs

    // Add time pressure
    urgency += Math.min(timeSinceArrival / 5, 0.5); // Up to 0.5 from time (5 minutes max)

    // Illness is always urgent
    if (this.needs.includes("illness")) {
      urgency = Math.max(urgency, 0.8);
    }

    return Math.min(urgency, 1);
  }

  /**
   * Check if cat is in critical condition
   */
  isCritical() {
    return (
      this.hearts <= 1 ||
      this.state === "urgent" ||
      this.getUrgencyLevel() > 0.8
    );
  }

  /**
   * Get detailed cat info for debugging and UI
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      needs: this.needs,
      hearts: this.hearts,
      state: this.state,
      urgency: this.getUrgencyLevel(),
      timeSinceArrival: Math.round(this.getTimeSinceArrival() / 1000), // seconds
      isCritical: this.isCritical(),
    };
  }

  /**
   * Setup drag and drop handlers for receiving inventory items
   */
  setupDragAndDrop() {
    this.element.addEventListener("dragover", (event) => {
      event.preventDefault(); // Allow drop
      event.dataTransfer.dropEffect = "copy";

      // Add visual feedback
      this.element.classList.add("drag-over");
    });

    this.element.addEventListener("dragleave", (event) => {
      // Remove visual feedback
      this.element.classList.remove("drag-over");
    });

    this.element.addEventListener("drop", (event) => {
      event.preventDefault();

      // Remove visual feedback
      this.element.classList.remove("drag-over");

      // Get dropped item data
      try {
        const itemData = JSON.parse(
          event.dataTransfer.getData("application/json")
        );
        this.handleItemDrop(itemData);
      } catch (error) {
        console.log("❌ Invalid item data dropped");
      }
    });
  }

  /**
   * Handle item drop on this cat
   */
  handleItemDrop(itemData) {
    console.log(`🎯 ${itemData.name} dropped on ${this.name}`);

    // Get the inventory manager and handle the drop
    if (window.game && window.game.inventory) {
      window.game.inventory.handleItemDrop(this, itemData);
    } else {
      console.log("❌ Game or inventory not available");
    }
  }
}
