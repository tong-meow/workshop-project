/**
 * Inventory System - Kitty Shelter Game
 * Manages items, selection, and need fulfillment
 */

/**
 * Available inventory items and their properties
 */
const INVENTORY_ITEMS = {
  FOOD: {
    id: "food",
    name: "Food",
    icon: "🍽️",
    description: "Satisfies hunger",
    fulfills: "hunger",
    color: "#fd7e14",
  },
  WATER: {
    id: "water",
    name: "Water",
    icon: "💧",
    description: "Satisfies thirst",
    fulfills: "thirst",
    color: "#20c997",
  },
  MEDICINE: {
    id: "medicine",
    name: "Medicine",
    icon: "🏥",
    description: "Treats illness",
    fulfills: "illness",
    color: "#dc3545",
  },
  TOYS: {
    id: "toys",
    name: "Toys",
    icon: "🧸",
    description: "Cheers up sad cats",
    fulfills: "sadness",
    color: "#6f42c1",
  },
};

/**
 * Inventory Manager Class
 */
class InventoryManager {
  constructor() {
    this.selectedItem = null;
    this.inventoryElement = null;
    this.items = Object.values(INVENTORY_ITEMS);

    this.createInventoryUI();
    this.setupEventListeners();

    console.log("🎒 Inventory system initialized");
  }

  /**
   * Create the inventory UI at the bottom of the screen
   */
  createInventoryUI() {
    // Create inventory container
    this.inventoryElement = document.createElement("div");
    this.inventoryElement.className = "inventory-container";
    this.inventoryElement.innerHTML = `
      <div class="inventory-header">
        <h3>🎒 Inventory</h3>
        <p class="inventory-hint">Select an item, then click a cat to help!</p>
      </div>
      <div class="inventory-items">
        ${this.items.map((item) => this.createItemHTML(item)).join("")}
      </div>
    `;

    // Add to page
    document.body.appendChild(this.inventoryElement);
  }

  /**
   * Create HTML for an individual inventory item
   */
  createItemHTML(item) {
    return `
      <div class="inventory-item" data-item-id="${item.id}">
        <div class="item-icon">${item.icon}</div>
        <div class="item-name">${item.name}</div>
        <div class="item-description">${item.description}</div>
      </div>
    `;
  }

  /**
   * Setup event listeners for inventory interactions
   */
  setupEventListeners() {
    // Item selection
    this.inventoryElement.addEventListener("click", (event) => {
      const itemElement = event.target.closest(".inventory-item");
      if (itemElement) {
        const itemId = itemElement.dataset.itemId;
        this.selectItem(itemId);
      }
    });

    // Listen for cat clicks when item is selected
    document.addEventListener("catClicked", (event) => {
      if (this.selectedItem) {
        this.attemptNeedFulfillment(event.detail.cat);
      }
    });
  }

  /**
   * Select an inventory item
   */
  selectItem(itemId) {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return;

    // Update selected item
    this.selectedItem = item;

    // Update visual selection
    this.updateItemSelection();

    // Update cursor/feedback
    this.updateSelectionFeedback();

    console.log(`🎒 Selected ${item.name} - click a cat to help!`);
  }

  /**
   * Update visual selection of inventory items
   */
  updateItemSelection() {
    // Remove previous selection
    this.inventoryElement.querySelectorAll(".inventory-item").forEach((el) => {
      el.classList.remove("selected");
    });

    // Add selection to current item
    if (this.selectedItem) {
      const selectedElement = this.inventoryElement.querySelector(
        `[data-item-id="${this.selectedItem.id}"]`
      );
      if (selectedElement) {
        selectedElement.classList.add("selected");
      }
    }
  }

  /**
   * Update selection feedback (cursor, hints, etc.)
   */
  updateSelectionFeedback() {
    const hintElement = this.inventoryElement.querySelector(".inventory-hint");

    if (this.selectedItem) {
      hintElement.textContent = `${this.selectedItem.icon} ${this.selectedItem.name} selected - click a cat with ${this.selectedItem.fulfills}!`;
      hintElement.className = "inventory-hint active";

      // Add cursor feedback
      document.body.classList.add("item-selected");
      document.body.style.cursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><text y="24" font-size="24">${this.selectedItem.icon}</text></svg>'), auto`;
    } else {
      hintElement.textContent = "Select an item, then click a cat to help!";
      hintElement.className = "inventory-hint";

      // Remove cursor feedback
      document.body.classList.remove("item-selected");
      document.body.style.cursor = "";
    }
  }

  /**
   * Attempt to fulfill a cat's need with the selected item
   */
  attemptNeedFulfillment(cat) {
    if (!this.selectedItem) {
      console.log("❌ No item selected");
      return false;
    }

    const needType = this.selectedItem.fulfills;

    // Check if cat has this need
    if (!cat.needs.includes(needType)) {
      console.log(`❌ ${cat.name} doesn't need ${this.selectedItem.name}`);
      this.showFulfillmentFeedback(
        cat,
        false,
        `${cat.name} doesn't need ${this.selectedItem.name}`
      );
      return false;
    }

    // Fulfill the need
    const success = cat.fulfillNeed(needType);

    if (success) {
      console.log(
        `✅ ${cat.name}'s ${needType} fulfilled with ${this.selectedItem.name}!`
      );
      this.showFulfillmentFeedback(cat, true, `${cat.name} feels better!`);

      // Deselect item after successful use
      this.deselectItem();

      // Trigger game event
      this.triggerFulfillmentEvent(cat, needType);

      return true;
    }

    return false;
  }

  /**
   * Show visual feedback for need fulfillment attempt
   */
  showFulfillmentFeedback(cat, success, message) {
    // Create feedback element
    const feedback = document.createElement("div");
    feedback.className = `fulfillment-feedback ${
      success ? "success" : "failure"
    }`;
    feedback.textContent = message;

    // Position near the cat
    const catRect = cat.element.getBoundingClientRect();
    feedback.style.position = "fixed";
    feedback.style.left = `${catRect.left + catRect.width / 2}px`;
    feedback.style.top = `${catRect.top - 30}px`;
    feedback.style.transform = "translateX(-50%)";
    feedback.style.zIndex = "1000";

    document.body.appendChild(feedback);

    // Animate and remove
    setTimeout(() => {
      feedback.style.opacity = "0";
      feedback.style.transform = "translateX(-50%) translateY(-20px)";
    }, 100);

    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  }

  /**
   * Deselect the current item
   */
  deselectItem() {
    this.selectedItem = null;
    this.updateItemSelection();
    this.updateSelectionFeedback();
  }

  /**
   * Trigger fulfillment event for game to handle
   */
  triggerFulfillmentEvent(cat, needType) {
    const event = new CustomEvent("needFulfilled", {
      detail: {
        cat: cat,
        needType: needType,
        item: this.selectedItem,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Get selected item info
   */
  getSelectedItem() {
    return this.selectedItem;
  }

  /**
   * Get all available items
   */
  getAllItems() {
    return this.items;
  }

  /**
   * Get item by ID
   */
  getItem(itemId) {
    return this.items.find((item) => item.id === itemId);
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { INVENTORY_ITEMS, InventoryManager };
}
