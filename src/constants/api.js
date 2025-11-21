export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    AVATAR: "/auth/avatar",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  ADMIN: {
    STATS: "/admin/dashboard/stats",
    RECENT: "/admin/dashboard/recent",
    ANALYTICS: "/admin/dashboard/analytics",
    USERS: "/admin/users",
    USER_STATUS: (id) => `/admin/users/${id}/status`,
    REPORTED_REVIEWS: "/admin/reviews/reported",
    REVIEW_STATUS: (id) => `/admin/reviews/${id}/status`,
    REVIEW: (id) => `/admin/reviews/${id}`,
  },
  MOVIES: {
    LIST: "/movies",
    DETAILS: (slug) => `/movies/${slug}`,
    ADMIN_LIST: "/movies/admin",
    ADMIN_DETAILS: (id) => `/movies/admin/${id}`,
  },
};
