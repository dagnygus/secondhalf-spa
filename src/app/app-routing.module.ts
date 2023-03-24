import { NotificationsComponent } from './modules/notifications/components/notifications/notifications.component';
import { SingleMemberGuard } from 'src/app/guards/single-member.guard';
import { SignInGuard } from 'src/app/guards/sign-in.guard';
import { UnauthGourd } from './guards/unauth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './modules/core/components/home/home.component';
import { NotFoundComponent } from './modules/core/components/404/not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  { path: 'account',
    loadChildren: () => import('./modules/account/account.module').then((m) => m.AccountModule),
    canLoad: [ AuthGuard ]
  },
  { path: 'about',
    loadChildren: () => import('./modules/about/about.module').then((m) => m.AboutModule),
  },
  { path: 'community-guidelines',
    loadChildren: () => import('./modules/community-guidelines/community-guidelines.module').then((m) => m.CommunityGuidelinesModule),
  },
  { path: 'cookie-policy',
    loadChildren: () => import('./modules/cookie-policy/cookie-policy.module').then((m) => m.CookiePolicyModule),
  },
  { path: 'intellectual-property',
    loadChildren: () => import('./modules/intellectual-property/intellectual-property.module').then((m) => m.IntellectualPropertyModule),
  },
  { path: 'members',
    loadChildren: () => import('./modules/members/members.module').then((m) => m.MembersModule),
  },
  { path: 'notifications',
    component: NotificationsComponent,
    canActivate: [ AuthGuard ]
  },
  { path: 'opinions',
    loadChildren: () => import('./modules/opinions/opinions.module').then((m) => m.OpinionsModule)
  },
  { path: 'privacy',
    loadChildren: () => import('./modules/privacy/privacy.module').then((m) => m.PrivacyModule),
  },
  { path: 'products',
    loadChildren: () => import('./modules/products/products.module').then((m) => m.ProductsModule),
  },
  { path: 'safety-and-policy',
    loadChildren: () => import('./modules/safety-and-policy/safety-and-policy.module').then((m) => m.SafetyAndPolicyModule),
  },
  { path: 'safety-tips',
    loadChildren: () => import('./modules/safety-tips/safety-tips.module').then((m) => m.SafetyTipsModule),
  },
  { path: 'signin',
    loadChildren: () => import('./modules/sign-in/sign-in.module').then((m) => m.SignInModule),
    canLoad: [ UnauthGourd, SignInGuard ]
  },
  { path: 'signup',
    loadChildren: () => import('./modules/sign-up/sign-up.module').then((m) => m.SignUpModule),
    canLoad: [ UnauthGourd ]
  },
  { path: 'member/:id',
    loadChildren: () => import('./modules/single-member/single-member.module').then((m) => m.SingleMemberModule),
    canLoad: [ SingleMemberGuard ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

