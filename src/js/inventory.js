/**
 * Inventory System - Kitty Shelter Game
 * Manages items, selection, and need fulfillment with drag and drop
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
    this.inventoryElement = null;
    this.items = Object.values(INVENTORY_ITEMS);

    this.createInventoryUI();
    this.setupEventListeners();

    console.log("🎒 Inventory system initialized with drag and drop");
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
        <p class="inventory-hint">Drag items to cats to help them!</p>
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
      <div class="inventory-item" data-item-id="${item.id}" draggable="true">
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
    // Drag and drop for inventory items
    this.inventoryElement.addEventListener("dragstart", (event) => {
      const itemElement = event.target.closest(".inventory-item");
      if (itemElement) {
        const itemId = itemElement.dataset.itemId;
        const item = this.items.find((i) => i.id === itemId);

        // Store item data for drop
        event.dataTransfer.setData("application/json", JSON.stringify(item));
        event.dataTransfer.effectAllowed = "copy";

        // Add visual feedback
        itemElement.classList.add("dragging");
        console.log(`🎒 Dragging ${item.name} - drop on a cat to help!`);

        // Update hint
        this.showDragHint(item);
      }
    });

    this.inventoryElement.addEventListener("dragend", (event) => {
      const itemElement = event.target.closest(".inventory-item");
      if (itemElement) {
        itemElement.classList.remove("dragging");
        this.hideDragHint();
      }
    });

    // Legacy click support (for backup/debugging)
    this.inventoryElement.addEventListener("click", (event) => {
      const itemElement = event.target.closest(".inventory-item");
      if (itemElement) {
        const itemId = itemElement.dataset.itemId;
        console.log(
          `💡 Tip: Try dragging ${this.getItem(itemId).name} to a cat instead!`
        );
      }
    });
  }

  /**
   * Show drag hint in inventory
   */
  showDragHint(item) {
    const hintElement = this.inventoryElement.querySelector(".inventory-hint");
    hintElement.textContent = `Dragging ${item.icon} ${item.name} - drop on a cat with ${item.fulfills}!`;
    hintElement.className = "inventory-hint dragging";
  }

  /**
   * Hide drag hint
   */
  hideDragHint() {
    const hintElement = this.inventoryElement.querySelector(".inventory-hint");
    hintElement.textContent = "Drag items to cats to help them!";
    hintElement.className = "inventory-hint";
  }

  /**
   * Handle item drop on cat (called from cat drop handler)
   */
  handleItemDrop(cat, itemData) {
    if (!itemData) {
      console.log("❌ No item data in drop");
      return false;
    }

    const needType = itemData.fulfills;

    // Check if cat has this need
    if (!cat.needs.includes(needType)) {
      console.log(`❌ ${cat.name} doesn't need ${itemData.name}`);
      this.showFulfillmentFeedback(
        cat,
        false,
        `${cat.name} doesn't need ${itemData.name}`
      );
      return false;
    }

    // Fulfill the need
    const success = cat.fulfillNeed(needType);

    if (success) {
      console.log(
        `✅ ${cat.name}'s ${needType} fulfilled with ${itemData.name}!`
      );
      this.showFulfillmentFeedback(cat, true, `${cat.name} feels better!`);

      // Trigger game event
      this.triggerFulfillmentEvent(cat, needType, itemData);

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
   * Trigger fulfillment event for game to handle
   */
  triggerFulfillmentEvent(cat, needType, itemData) {
    const event = new CustomEvent("needFulfilled", {
      detail: {
        cat: cat,
        needType: needType,
        item: itemData,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Get selected item info (returns null for drag and drop)
   */
  getSelectedItem() {
    return null;
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
