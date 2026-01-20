# Work Order Schedule Timeline

An interactive timeline application for visualizing and managing work orders across multiple work centers. Built with Angular 20.

## How to Run the Application

### Prerequisites
- Node.js (v20 or newer recommended)
- Angular CLI (`npm install -g @angular/cli`)

### Setup Steps
1.  **Clone the repository**:
    ```bash
    git clone git@github.com:andmaltes/work-orders.git
    cd naologic-work-orders
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the application**:
    ```bash
    ng serve
    ```
4.  **Access the app**:
    Open your browser and navigate to `http://localhost:4200`.

## Approach

### Component Architecture (Smart/Dumb)
The application follows the **Smart/Dumb component pattern** (also known as Container/Presentational) to separate concerns and improve maintainability:
- **Smart Components (Pages)**: (e.g., `WorkOrdersTablePage`) These components are connected to the `TimelineStateService`. They handle data fetching, state selection, and pass data down to child components via observables and the `async` pipe.
- **Dumb Components (Presentational)**: (e.g., `WorkOrdersTable`, `WorkOrdersDurationRow`) These components focus purely on UI rendering and interaction. They receive data through `@Input()` and communicate events back to parents via `@Output()`. This makes them highly reusable and easy to test.

### State Management
I implemented a centralized state management pattern using a `TimelineStateService`. This service uses a `BehaviorSubject` to hold the application state (work centers, work orders, timescale, and intervals), mimicking an NgRx-like store without the boilerplate. This ensures a single source of truth and reactive updates across the application.

### Data Persistence (LocalStorage)
To ensure work orders survive page refreshes, I implemented a `TimelinePersistanceService`. 
- **Automatic Sync**: Every time the application state changes, the service automatically serializes and stores the current `TimelineState` in `localStorage`.
- **Hydration**: On application load, the service checks for existing data in `localStorage` and initializes the state with it, ensuring a seamless user experience.

### Timeline Rendering
The timeline is built using Flexbox for the headers and rows. 
- **Intervals**: The timeline generates dynamic "intervals" (Days, Weeks, or Months) based on the selected zoom level.
- **Positioning**: Work order bars are positioned using absolute positioning.
- **Responsive Bar Content**: 
    - When a work order bar has enough width (calculated based on `INTERVAL_WIDTH`), it displays the name, status badge, and action menu.
    - If the bar is too narrow, these details are hidden to avoid UI clutter, but they remain fully accessible via a **detailed tooltip** when hovering over the bar.
    - An "overflow" logic allows labels to expand into adjacent empty spaces if no collision is detected, maximizing visibility.
- **Scrolling**: The timeline supports horizontal scrolling with a fixed left column for work center names, achieved using CSS `position: sticky`.

### Infinite Scrolling
The application implements a bi-directional infinite scroll to allow users to explore past and future dates seamlessly:
- **Sentinels & IntersectionObserver**: Two invisible sentinel elements are placed at the far left and right of the scrollable track. An `IntersectionObserver` detects when these sentinels enter the viewport.
- **Dynamic State Expansion**: When a sentinel is triggered, the `TimelineStateService` increases the `visibleIntervalsPast` or `visibleIntervalsFuture` counters, triggering a recalculation of the intervals and work order positions.
- **Scroll Anchoring**: When prepending past dates, the component captures the `scrollWidth` before the update and adjusts the `scrollLeft` position immediately after rendering. This prevents the "jump" effect and keeps the user's current view stationary while new content is added to the left.

### Date Calculations
`Moment.js` is used for all date manipulations. The calculation logic is split into several key steps:
1.  **Interval Mapping**: Dates are mapped to unique `intervalId` (timestamps of the start of the day/week/month) to determine which grid cell they belong to.
2.  **Visible Range Intersection**: The system calculates the intersection between a work order's duration and the currently visible timeline window. This ensures bars are rendered correctly even if they start or end outside the current view.
3.  **Percentage-Based Positioning**:
    - **Width**: Calculated by multiplying the number of intervals covered by the `INTERVAL_WIDTH`, then adjusting for "partial" intervals at the start and end (e.g., an order starting halfway through a month in Month view).
    - **Left Offset**: Calculated based on the percentage of the first interval that the order *does not* cover, ensuring precise alignment within the grid cell.

### Collision Detection
Before creating or updating a work order, the system checks for overlaps on the same work center by comparing the start and end dates against existing orders.

## Libraries Used

- **Moment.js**: Chosen for its robust API for date arithmetic, comparison, and formatting, which was crucial for the timeline's complex date-to-pixel calculations.

## Trade-offs

During development, several technical decisions were made, balancing time constraints, simplicity, and functionality:

- **State Management (BehaviorSubject vs. NgRx)**: I opted for a `BehaviorSubject`-based state management in `TimelineStateService` instead of a full NgRx implementation. For a project of this scale, NgRx would have introduced unnecessary boilerplate, while this approach still provides a single source of truth and reactivity.
- **Moment.js vs. Modern Date Libraries**: Although `Moment.js` is considered a legacy project, I chose it for this test because of its extensive and familiar API for complex date calculations (like `diff` with units and `startOf`/`endOf` logic), which were central to the timeline's positioning logic. In a long-term production project, I would consider `date-fns` or `Luxon` for better tree-shaking and immutability.
- **Flexbox & Absolute Positioning**: The timeline uses Flexbox for the layout (header and rows) and absolute positioning for the work order bars. This is simpler and more performant for this specific use case than using a `<canvas>` element or a heavy third-party timeline library, while still allowing for high precision.
- **LocalStorage for Persistence**: I used `localStorage` as a simple way to demonstrate data persistence without the need for a backend API. This allows for a better user experience during testing (saving state across refreshes) while keeping the project self-contained.
- **Manual Scroll Anchoring**: Instead of using a virtual scrolling library, I implemented manual scroll anchoring for the infinite scroll. This keeps the bundle size small and provides a custom-tailored experience for the horizontal timeline, though it requires more careful DOM manipulation.
- **Fixed Column Size**: The timeline currently uses a fixed column width for all intervals (e.g., 113px). This was a deliberate choice for simplicity and to ensure a consistent grid layout. However, the system is designed such that dynamic column sizing (e.g., wider columns for days, narrower for months) could be implemented in the future.


