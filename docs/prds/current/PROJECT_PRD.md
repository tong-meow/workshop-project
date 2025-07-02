# **PRD: Kitty Shelter Game Web App Prototype**

## **1. Problem Statement**

### **Elevator Pitch**

A relaxing and engaging web game where players run a cat shelter, fulfilling the needs of incoming kitties and matching them with adopters. Players must respond to the cats’ needs within a time limit, while managing an inventory of items and handling adoption requests. The game gradually increases in difficulty, challenging the player to keep all kitties happy.

### **Problem Description**

In a fast-paced, yet casual game, players must manage the care of incoming cats in their shelter. As more cats arrive and adoption preferences change, players must respond to needs like hunger, thirst, or illness, using a variety of items in their inventory. Players must balance these needs under time pressure, with the goal of keeping the shelter in operation without letting the cats suffer.

### **User Story**

- **As a player**, I want to manage a cat shelter, feeding and caring for cats under time pressure, while fulfilling adopters' preferences and avoiding game failure due to neglect.

---

## **2. Features and Requirements**

### **2.1 Core Game Mechanics**

#### **2.1.1 Cat Arrival**

- **User Story**: As a player, I want cats to arrive randomly, so I can begin fulfilling their needs.
  - **Requirement**: Cats arrive randomly every 10-30 seconds. Each cat has a simple need (hunger, thirst, illness, etc.) indicated by an icon above their head.
  - **Priority**: High
  - **Acceptance Criteria**: Cats appear with a visual icon indicating their immediate needs (food, water, etc.).

#### **2.1.2 Inventory System**

- **User Story**: As a player, I want to have an unlimited inventory, so I don't have to worry about running out of resources.
  - **Requirement**: The inventory is unlimited and contains items such as food, water, medicine, cushions, and toys.
  - **Priority**: High
  - **Acceptance Criteria**: Inventory bar contains items. No limit on the number of items.

#### **2.1.3 Cat Needs**

- **User Story**: As a player, I want to fulfill the cats’ needs quickly to keep them happy.
  - **Requirement**: Each cat has one or more needs indicated by icons. Needs include hunger, thirst, illness, and sadness.
  - **Priority**: High
  - **Acceptance Criteria**: Icons above the cat's head should clearly represent the current need (e.g., food, medicine).

#### **2.1.4 Time Pressure**

- **User Story**: As a player, I want to be under time pressure to complete tasks, so the game stays engaging.
  - **Requirement**: A bar should decrease as the player responds to the cats' needs. The player must manage each cat’s need before the bar reaches zero.
  - **Priority**: High
  - **Acceptance Criteria**: A visual bar should be displayed above each cat indicating the urgency of fulfilling their needs.

#### **2.1.5 Happiness System**

- **User Story**: As a player, I want to keep the cats happy by fulfilling their needs on time.
  - **Requirement**: Each cat has 3 hearts, representing their happiness. If a cat’s needs are not met on time, one heart is lost. If all hearts are lost, the cat will be taken away.
  - **Priority**: Medium
  - **Acceptance Criteria**: Hearts displayed below each kitty. Hearts decrease when a need isn’t met.

#### **2.1.6 Adoption Matching**

- **User Story**: As a player, I want to match cats with adopters based on their preferences.
  - **Requirement**: A bell rings when an adopter arrives. When clicked, a small window shows the adopter’s preferences (icon of the desired cat type).
  - **Priority**: Medium
  - **Acceptance Criteria**: A bell icon appears when an adopter is waiting. The adopter’s preferences should be displayed clearly in a modal window.

---

### **2.2 Game Over Conditions**

#### **2.2.1 Warnings and Game Over**

- **User Story**: As a player, I want to be warned if I fail to care for too many cats, and I want a clear end to the game if I fail.
  - **Requirement**: The player receives a warning after losing 3 cats (i.e., when a cat loses all 3 hearts). After 3 warnings, the game ends.
  - **Priority**: High
  - **Acceptance Criteria**: A "game over" screen appears after the player receives 3 warnings. The player can restart the game from this screen.

---

### **2.3 UI Elements**

#### **2.3.1 Time Bar**

- **User Story**: As a player, I want to see how much time I have to complete tasks for each cat.
  - **Requirement**: A time bar appears above each cat, showing the urgency of fulfilling their needs.
  - **Priority**: High
  - **Acceptance Criteria**: A decreasing time bar appears over each cat that shows how much time the player has to react.

#### **2.3.2 Bell Icon for Adopters**

- **User Story**: As a player, I want a clear indication of when an adopter is waiting for a cat.
  - **Requirement**: A bell icon appears when an adopter is waiting. When clicked, a window displays the adopter’s preferences.
  - **Priority**: High
  - **Acceptance Criteria**: Bell icon appears on the screen when an adopter is available. The adopter’s preferences must be shown clearly in a modal window.

---

## **3. Milestones and Deliverables**

### **Milestone 1: Core Game Loop and Basic UI**

- **Deliverables**:
  - Basic gameplay where cats arrive and display needs.
  - Inventory system with unlimited capacity.
  - Time bar for urgency and heart system for cat happiness.
- **Acceptance Criteria**:
  - Cats arrive randomly with needs.
  - Inventory system functions as expected.
  - Time bar and heart system are correctly implemented.

### **Milestone 2: Adopter Matching and Game Over System**

- **Deliverables**:
  - Adoption bell system and matching process.
  - Game over screen with 3-warning condition.
- **Acceptance Criteria**:
  - Adoption preferences are displayed correctly.
  - The game ends after 3 warnings with a restart button.

### **Milestone 3: Final Testing and Polishing**

- **Deliverables**:
  - Full integration of all systems.
  - UI polish, with clear feedback for player actions.
- **Acceptance Criteria**:
  - All mechanics work together seamlessly.
  - Final QA testing with no major bugs.

---

## **4. Technical Specifications**

- **Web-only**: The game will be designed for the web platform.
- **No audio**: No sound effects or background music will be included in the initial version.
- **Browser Support**: The game should be compatible with modern browsers (Chrome, Firefox, Edge).

---

## **5. Image Generation for Cats and Adopters**

### **5.1 Kitty Colors and Image Generation**

- **User Story**: As a player, I want the kitties to have random appearances and colors, so each experience feels fresh and engaging.
  - **Requirement**: Use an image generator UI to create the cats' images. The colors should include but not be limited to:
    - Orange
    - Calico
    - White
    - Black
    - Tabby
    - Sesame
  - **Priority**: Medium
  - **Acceptance Criteria**: Cats will appear with random colors (from the list above) and random appearances generated through the image generator UI.

### **5.2 Adoption Matching - Adopter and Cat Image Generation**

- **User Story**: As a player, I want adopters to have unique images and preferences, so each adoption feels distinct.
  - **Requirement**: Use an image generator UI to create adopter images. Each adopter will have preferences for specific cat colors, represented by an icon.
  - **Priority**: Medium
  - **Acceptance Criteria**: Adopters will have an image created through the image generator UI, and their preferences will be represented with an icon for a specific cat color.
