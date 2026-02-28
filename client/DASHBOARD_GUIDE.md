## Dashboard Component System - Usage Guide

This system provides a flexible, configuration-driven approach to manage student and trainer dashboards with conditional rendering.

---

## 📋 Architecture Overview

```
dashboardConfig.js (Configuration)
         ↓
    StudentHome.jsx (Main Page)
         ↓
    ├── Navbar.jsx
    ├── LeftSidebar.jsx
    ├── FeedSection.jsx
    └── RightSidebar.jsx
```

---

## 🚀 How to Use

### 1. **Using the Dashboard**

```jsx
// For Student Dashboard
import Dashboard from "./assets/pages/StudentHome";
import { USER_TYPES } from "./config/dashboardConfig";

<Dashboard userType={USER_TYPES.STUDENT} />

// For Trainer Dashboard
<Dashboard userType={USER_TYPES.TRAINER} />
```

### 2. **Using Individual Components**

```jsx
import Navbar from "./assets/components/StudentNavbar";
import { USER_TYPES } from "./config/dashboardConfig";

// You can pass userType to individual components too
<Navbar userType={USER_TYPES.TRAINER} />;
```

---

## 🔧 How to Add New Features

### **Example 1: Add a new navigation item for trainers**

Edit `src/config/dashboardConfig.js`:

```javascript
trainer: {
  navbar: {
    navItems: [
      // ... existing items
      { id: "certificates", label: "Certificates", icon: "Award" }, // ← Add this
    ];
  }
}
```

The navbar will automatically render this new item!

---

### **Example 2: Add a new sidebar menu item**

Edit `src/config/dashboardConfig.js`:

```javascript
student: {
  leftSidebar: {
    menuItems: [
      { id: "saved-courses", label: "Saved Courses", icon: "BookOpen" },
      { id: "new-feature", label: "New Feature", icon: "Zap" }, // ← Add this
    ];
  }
}
```

---

### **Example 3: Add a new information item in right sidebar**

Edit `src/config/dashboardConfig.js`:

```javascript
trainer: {
  rightSidebar: {
    title: "Trainer Insights",
    items: [
      // ... existing items
      "🎓 Certificate count: 15"  // ← Add this
    ]
  }
}
```

---

## ❌ How to Remove Features

### **Remove a navigation item**

```javascript
trainer: {
  navbar: {
    navItems: [
      { id: "my-courses", label: "My Courses", icon: "BookOpen" },
      // Remove this line:
      // { id: "earnings", label: "Earnings", icon: "DollarSign" }
    ];
  }
}
```

---

## 🎨 Available Icons

To use new icons, first import them in `StudentNavbar.jsx`:

```jsx
import {
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BookOpen,
  DollarSign,
  Star,
  BarChart3,
  Award,
  Zap,
  Calendar, // ← Add new icons here
} from "lucide-react";

const ICON_MAP = {
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  BookOpen,
  DollarSign,
  Star, // ← Add to map
  BarChart3, // ← Add to map
  Award, // ← Add to map
  Zap, // ← Add to map
  Calendar, // ← Add to map
};
```

Available icons from lucide-react:

- Users, Users2
- Briefcase, BookOpen, Book
- MessageSquare, Mail
- Bell, AlertCircle
- DollarSign, TrendingUp
- Star, Award
- BarChart3, BarChart2
- Zap, Flame
- Calendar, Clock
- Download, Upload
- And 400+ more from lucide-react!

---

## 🎯 Feature Flags

Enable/disable features globally in `dashboardConfig.js`:

```javascript
export const FEATURE_FLAGS = {
  enableAnalytics: false, // Disable analytics
  enableEarnings: true,
  enableCourseCreation: true,
  enableStudentTracking: false, // Disable tracking
  enableAdvancedFilters: true,
};
```

Then use in components:

```jsx
import { FEATURE_FLAGS } from "../../config/dashboardConfig";

{
  FEATURE_FLAGS.enableAnalytics && <div>Analytics Dashboard</div>;
}
```

---

## 📝 Adding a New User Type (e.g., Admin)

1. Add to `USER_TYPES` enum:

```javascript
export const USER_TYPES = {
  STUDENT: "student",
  TRAINER: "trainer",
  ADMIN: "admin", // ← Add this
};
```

2. Add configuration in `DASHBOARD_CONFIG`:

```javascript
export const DASHBOARD_CONFIG = {
  admin: {
    navbar: {
      navItems: [
        { id: "users", label: "Users", icon: "Users" },
        // ... more admin items
      ],
    },
    leftSidebar: {
      profile: {
        name: "Admin User",
        role: "Platform Administrator",
        avatar: "...",
      },
      menuItems: [
        // admin menu items
      ],
    },
    feedSection: {
      placeholder: "Admin notes...",
    },
    rightSidebar: {
      title: "Admin Panel",
      items: ["Admin analytics", "System status"],
    },
  },
};
```

3. Use in components:

```jsx
<Dashboard userType={USER_TYPES.ADMIN} />
```

---

## 🔄 Dynamic Content Example

The `FeedSection` component dynamically changes content based on user type:

```jsx
const getSamplePosts = () => {
  if (userType === USER_TYPES.TRAINER) {
    return [
      { title: "Course Released", description: "..." },
      // trainer-specific posts
    ];
  }
  return [
    { title: "Internship", description: "..." },
    // student-specific posts
  ];
};
```

---

## 📚 Component Customization

### **LeftSidebar** - Conditional Stats

```jsx
const getStatLabel = () => {
  if (userType === USER_TYPES.TRAINER) {
    return "Students";
  }
  return "Profile viewers";
};
```

### **Navbar** - Dynamic Menu Items

Automatically renders from config without hardcoding!

### **RightSidebar** - Sticky Implementation

```jsx
<div className="sticky top-24">  // Stays in view while scrolling
```

---

## ✨ Best Practices

1. **Keep config clean** - All content & labels in `dashboardConfig.js`
2. **Use consistent naming** - Use kebab-case for IDs: `saved-courses`
3. **Add icons properly** - Always add icons to `ICON_MAP` before using
4. **Test both types** - Always check `STUDENT` and `TRAINER` views
5. **Filter by feature flags** - Use `FEATURE_FLAGS` for optional features

---

## 🐛 Troubleshooting

**Icon not showing?**

- Check if icon is imported in `StudentNavbar.jsx`
- Verify icon name matches exactly in `ICON_MAP`
- Lucide icon names use PascalCase

**Config not updating?**

- Clear browser cache
- Restart development server
- Check for syntax errors in `dashboardConfig.js`

**Wrong content showing?**

- Verify `userType` prop is passed correctly
- Check `USER_TYPES` enum spelling
- Console log the `userType` to debug

---

## 💡 Example: Adding "Admin Approval" Feature for Trainers

**Step 1:** Add to config

```javascript
trainer: {
  leftSidebar: {
    menuItems: [
      {
        id: "pending-approval",
        label: "⏳ Pending Approval (3)",
        icon: "Clock",
      },
    ];
  }
}
```

**Step 2:** Add feature flag

```javascript
FEATURE_FLAGS = {
  enableAdminApproval: true,
};
```

**Step 3:** Use in component

```jsx
{
  FEATURE_FLAGS.enableAdminApproval && <ApprovalPanel />;
}
```

Done! No file duplication needed!

---
