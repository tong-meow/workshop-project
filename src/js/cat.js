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
    const colors = ["orange", "calico", "white", "black", "tabby", "sesame"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get cat icon based on color
   */
  getCatIcon() {
    const icons = {
      orange: "🐱",
      calico: "🐈",
      white: "🤍",
      black: "��‍⬛",
      tabby: "assets/cats/tabby-cat-1.png", // Use actual image for tabby
      sesame: "🦁",
    };
    return icons[this.color] || "🐱";
  }

  /**
   * Generate random needs for the cat
   */
  generateRandomNeeds() {
    const possibleNeeds = ["hunger", "thirst", "illness", "sadness"];
    const numNeeds = Math.floor(Math.random() * 3) + 1; // 1-3 needs

    // Shuffle and pick random needs
    const shuffled = possibleNeeds.sort(() => 0.5 - Math.random());
    this.needs = shuffled.slice(0, numNeeds);

    this.updateNeedDisplay();
  }

  /**
   * Create the DOM element for the cat
   */
  createElement() {
    this.element = document.createElement("div");
    this.element.className = `cat ${this.state}`;
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

    // Add click event listener
    this.element.addEventListener("click", () => {
      this.onCatClick();
    });
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
    const icons = {
      hunger: "🍽️",
      thirst: "💧",
      illness: "🏥",
      sadness: "😢",
    };
    return icons[need] || "❓";
  }

  /**
   * Handle cat click event
   */
  onCatClick() {
    console.log(`${this.name} was clicked! Needs: ${this.needs.join(", ")}`);

    // Add visual feedback
    this.element.style.transform = "scale(1.1)";
    setTimeout(() => {
      this.element.style.transform = "";
    }, 200);

    // Trigger custom event for game to handle
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
   * Update cat's emotional state
   */
  updateState() {
    const oldState = this.state;

    if (this.needs.length === 0) {
      this.state = "happy";
    } else if (this.needs.length >= 3) {
      this.state = "urgent";
    } else if (this.needs.includes("illness")) {
      this.state = "sick";
    } else {
      this.state = "stressed";
    }

    // Update visual state if changed
    if (oldState !== this.state) {
      this.element.className = `cat ${this.state}`;
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
   * Get cat info for debugging
   */
  getInfo() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      needs: this.needs,
      hearts: this.hearts,
      state: this.state,
    };
  }
}
