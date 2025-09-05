import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // TODO: check auth state
  return true;
};
