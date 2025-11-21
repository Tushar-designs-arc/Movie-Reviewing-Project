export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const isAdminUser = (user) => {
  return Boolean(user && user.role === ROLES.ADMIN);
};
