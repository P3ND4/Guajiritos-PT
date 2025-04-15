import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { IUser, Role } from '../models/user';

export const adminGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService)
  const router = inject(Router)
  const user: IUser = authS.getCurrentUser(); // deberías tener algo así

  if (user && user.role == Role.Admin) {
    return true;
  }

  // Si no es admin, lo mandas pa otra ruta
  return router.parseUrl('tasks');
};
