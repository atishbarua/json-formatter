# Design Guidelines: JSON Formatter & Viewer

## Design Approach

**Selected Approach:** Design System (Material Design 3) with influences from developer-focused tools like VS Code and JSONFormatter.org

**Rationale:** This is a utility-focused developer tool where clarity, efficiency, and readability are paramount. Users need to quickly format, validate, and view JSON without visual distractions.

---

## Core Design Elements

### Typography
- **Primary Font:** Inter or Roboto (via Google Fonts CDN)
- **Monospace Font:** JetBrains Mono or Fira Code for JSON display
- **Hierarchy:**
  - Page titles: 2xl, semi-bold
  - Section headers: xl, medium
  - Body text: base, regular
  - JSON content: sm monospace for readability
  - Button labels: sm, medium

### Layout System
**Spacing Units:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 to p-6
- Section margins: mb-6 to mb-8
- Button spacing: px-6 py-2
- Container gaps: gap-4

**Grid Structure:**
- Main tool page: Single column focus on desktop (max-w-6xl), full viewport usage
- Admin dashboard: Two-column layout for metrics cards, single column for charts

---

## Page-Specific Layouts

### Page 1: JSON Formatter/Viewer

**Layout Structure:**
1. **Header Bar** (sticky top)
   - Tool title/logo (left)
   - Quick action buttons: "Clear", "New" (right)
   - Ad banner zone placeholder below header (728x90)

2. **Main Workspace** (full height)
   - Two-panel layout (side-by-side on desktop, stacked on mobile)
   - **Left Panel:** Input area
     - Label: "Input JSON"
     - Textarea with monospace font, min-height: 400px
     - Action buttons row: "Format", "Minify", "Validate", "Copy"
   - **Right Panel:** Output/Viewer area
     - Collapsible tree view for formatted JSON
     - Syntax highlighting zones (different text treatments for keys, strings, numbers, booleans, null)
     - Copy button (top-right corner)

3. **Ad Zones:**
   - Top banner: horizontal rectangle (below header)
   - Sidebar vertical: 160x600 (right side on desktop only)
   - Bottom banner: before footer

4. **Footer** (minimal)
   - "Admin" link (discrete, bottom-right)
   - Privacy/Terms links

### Page 2: Admin Dashboard

**Layout Structure:**
1. **Header**
   - "Admin Dashboard" title
   - Logout button (top-right)

2. **Metrics Cards Row** (3-4 columns on desktop, stack on mobile)
   - Total Visitors card
   - Daily Visitors card
   - Ad Clicks card
   - Active Sessions card (if applicable)
   - Each card: large number display, label below, icon accent

3. **Charts Section**
   - Visitor trend chart (line graph, full-width)
   - Ad performance chart (bar graph)
   - Charts use Chart.js with clean, minimal styling

4. **Data Table** (if showing recent activity)
   - Striped rows for readability
   - Timestamp, action, details columns

---

## Component Library

### Buttons
- **Primary Action:** Filled background, medium weight text
- **Secondary Action:** Outlined style
- **Icon Buttons:** Square format for "Copy", "Clear"
- **States:** Clear hover/active treatments (system handles this)

### Input Areas
- **Textarea:** Full-width, rounded corners (rounded-lg), border treatment
- **Monospace styling** for JSON input
- **Focus state:** Prominent border change

### JSON Tree Viewer
- **Collapsible nodes:** Chevron icons (use Heroicons)
- **Indentation:** Consistent 4-space equivalent (ml-4 per level)
- **Syntax colors** (applied via text classes, NOT specific color values):
  - Keys: One treatment
  - Strings: Different treatment  
  - Numbers/Booleans: Another treatment
  - Null: Distinct treatment

### Cards (Admin Dashboard)
- Elevated appearance (shadow)
- Padding: p-6
- Rounded corners: rounded-xl

### Modal/Popup
- **Ad Popup:** Centered overlay, backdrop blur
- **Login Modal:** Centered, max-w-md, shadow-2xl

---

## Icons
**Library:** Heroicons (via CDN)
- Chevron-down/right for tree expansion
- Document-duplicate for copy
- Trash for clear
- Chart-bar for analytics
- Lock for admin login

---

## Responsive Behavior

**Breakpoints:**
- Mobile (< 768px): Single column, stacked panels, hide sidebar ads
- Tablet (768px - 1024px): Maintain two-panel layout, reduce ad zones
- Desktop (> 1024px): Full two-panel workspace, all ad zones visible

**Mobile Optimizations:**
- Input/Output panels stack vertically
- Action buttons: Full-width or icon-only mode
- Charts: Simplified legends, touch-friendly

---

## Accessibility
- All buttons have clear labels
- Form inputs have associated labels
- Adequate contrast for JSON syntax highlighting
- Keyboard navigation for tree view (arrow keys)
- Focus indicators on all interactive elements

---

## Images
**No hero images required** - this is a functional tool, not a marketing page. Focus remains on the workspace and usability.

---

## Animation
**Minimal use:**
- Collapsible tree expansion: Smooth height transition
- Button click: Subtle scale feedback
- Chart animations: Brief entrance (Chart.js default)
- **No** page transitions or decorative animations