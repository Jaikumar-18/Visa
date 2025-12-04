# Professional Theme Guide - HR Portal

## Color Palette

### Primary Colors (Use ONLY for Critical Actions)
- **Red (Primary)**: `#DC2626` - Critical actions, primary CTAs
- **Green (Success)**: `#16A34A` - Success states, completed items only

### Base Colors (Use 90% of the time)
- **White**: `#FFFFFF` - Card backgrounds
- **Light Grey**: `bg-grey` - Page background
- **Grey Scale** (neutral):
  - `neutral-100` - Section headers, hover states
  - `neutral-200` - Dividers, subtle backgrounds
  - `neutral-300` - Borders (primary border color)
  - `neutral-400` - Status badges (pending)
  - `neutral-500` - Secondary text
  - `neutral-600` - Status badges (in-progress)
  - `neutral-700` - Icons
  - `neutral-800` - Primary text
  - `neutral-900` - Headers

## Layout Structure

### Page Container
```jsx
<div className="min-h-screen bg-grey">
  <div className="max-w-[1400px] mx-auto p-4">
    {/* Content */}
  </div>
</div>
```

### Page Header
```jsx
<div className="flex items-center justify-between mb-3 bg-white border border-neutral-300 rounded p-3">
  <div>
    <h1 className="text-base font-semibold text-neutral-800">Title</h1>
    <p className="text-xs text-neutral-500">Description</p>
  </div>
</div>
```

### Content Cards
```jsx
<div className="bg-white border border-neutral-300 rounded overflow-hidden">
  {/* Content */}
</div>
```

## Typography

### Headers
- Page Title: `text-base font-semibold text-neutral-800`
- Subtitle: `text-xs text-neutral-500`
- Section Title: `text-sm font-semibold text-neutral-800`

### Body Text
- Primary: `text-sm text-neutral-800`
- Secondary: `text-xs text-neutral-600`
- Muted: `text-xs text-neutral-500`

### Table Headers
- `text-xs font-semibold text-neutral-600 uppercase tracking-wide`

## Components

### Tables
- Header: `bg-neutral-100 border-b border-neutral-300`
- Rows: `divide-y divide-neutral-200`
- Hover: `hover:bg-neutral-50`
- Cell padding: `px-3 py-2.5`

### Status Badges
```jsx
// Completed
<span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-success-600 text-white">
  COMPLETED
</span>

// In Progress
<span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-600 text-white">
  IN COUNTRY
</span>

// Pending
<span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-400 text-white">
  PRE ARRIVAL
</span>
```

### Buttons (from Button.jsx)
- Primary: Red background for main actions
- Secondary: Grey background for common actions
- Outline: Border style for tertiary actions
- Size: `px-3 py-1.5 text-xs`

### Employee Avatar
```jsx
<div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center">
  <span className="text-xs font-bold text-white">AB</span>
</div>
```

## Updated Pages

✅ **HRDashboard.jsx**
- Compact stats grid
- Professional employee table with columns
- Grey background with white cards

✅ **EmployeeList.jsx**
- Full-width table layout
- Compact action buttons
- Search functionality

✅ **HRNotifications.jsx**
- List-based layout
- Color-coded notifications
- Unread indicator

✅ **CreateEmployee.jsx**
- Compact header
- Form layout maintained

## Design Principles

1. **Compact & Efficient**: Maximize information density
2. **Consistent Spacing**: Use p-2, p-3, p-4 consistently
3. **Clear Hierarchy**: Headers, cards, and content clearly separated
4. **Minimal Colors**: White, grey, with red/green accents only
5. **Professional**: Clean borders, no heavy shadows
6. **Readable**: Small but legible text sizes
