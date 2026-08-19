export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
  MANAGER: 'manager',
});

export const ALL_ROLES = Object.values(ROLES);
export const ADMIN_ROLES = [ROLES.ADMIN, ROLES.MANAGER];
