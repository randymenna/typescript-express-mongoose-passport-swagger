export const ROLES = ['admin', 'user'] as const;
export type RoleType = typeof ROLES[number];
