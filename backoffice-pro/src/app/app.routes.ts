import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { Signup } from './auth/signup/signup';
import { NotFound } from './not-found/not-found';
import { authGuard } from './auth.guard';
import { Users } from './users/users';
import { Settings } from './settings/settings';
import { UserDetail } from './users/user-detail/user-detail';
import { userResolver } from './users/user-detail/user-detail.resolver';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      { path: 'users', component: Users },
      {
        path: 'users/:id',
        component: UserDetail,
        resolve: {
          user: userResolver,
        },
      },
      { path: 'users/new', component: UserDetail },
      {
        path: 'settings',
        component: Settings,
      },
    ],
  },
  { path: '**', component: NotFound },
];
