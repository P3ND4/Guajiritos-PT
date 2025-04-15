import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authS = inject(AuthService)
  const router: Router = inject(Router)
  
  if(authS.isLoggedIn()) return true
  else return router.parseUrl('login')
};
