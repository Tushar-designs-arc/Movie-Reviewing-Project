export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const TOAST_DURATION = 3600;

export const SIDEBAR_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    iconName: "LayoutDashboard",
  },
  {
    id: "movies",
    label: "Movies & Media",
    path: "/movies",
    iconName: "Film",
    disabled: false,
  },
  {
    id: "users",
    label: "Users Management",
    path: "/users",
    iconName: "Users",
    disabled: false,
  },
  {
    id: "reviews",
    label: "Reviews Moderation",
    path: "/reviews",
    iconName: "MessageSquare",
    disabled: false,
  },
  {
    id: "reports",
    label: "Flagged Reports",
    path: "/reports",
    iconName: "ShieldAlert",
    disabled: false,
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    iconName: "BarChart3",
    disabled: false,
  },
  {
    id: "settings",
    label: "System Settings",
    path: "/settings",
    iconName: "Settings",
    disabled: false,
  },
];
