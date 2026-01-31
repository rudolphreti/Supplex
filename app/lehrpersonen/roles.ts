export const ROLE_OPTIONS = ["KV", "TL", "Springer"];

export const buildRoleOptions = (currentRole?: string) => {
  if (currentRole && !ROLE_OPTIONS.includes(currentRole)) {
    return [currentRole, ...ROLE_OPTIONS];
  }
  return ROLE_OPTIONS;
};
