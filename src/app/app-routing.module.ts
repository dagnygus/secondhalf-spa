import { ProductsComponent } from './components/products/products.component';
import { SafetyAndPolicyComponent } from './components/safety-and-policy/safety-and-policy.component';
import { SafetyTipsComponent } from './components/safety-tips/safety-tips.component';
import { CommunityGuidelinesComponent } from './components/community-guidelines/community-guidelines.component';
import { IntellectualPropertyComponent } from './components/intelectual-property/intellectual-property.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { OpinionsComponent } from './components/opinions/opinions.component';
import { AboutComponent } from './components/about/about.component';
import { SignInGuard } from './guards/sign-in.guard';
import { SingleMemberComponent } from './components/single-member/single-member.component';
import { PhotosComponent } from './components/auth-user/photos/photos.component';
import { NewPasswordComponent } from './components/auth-user/new-password/new-password.component';
import { AuthUserDetailsComponent } from './components/auth-user/auth-user-details/auth-user-details.component';
import { AuthUserComponent } from './components/auth-user/auth-user.component';
import { UnauthGourd } from './guards/unauth.guard';
import { AuthGuard } from './guards/auth.guard';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembersComponent } from './components/members/members.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SingleMemberGuard } from './guards/single-member.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, },
  { path: 'signup', component: AuthFormComponent, canActivate: [UnauthGourd] },
  { path: 'signin', component: SignInFormComponent, canActivate: [UnauthGourd, SignInGuard] },
  { path: 'members', component: MembersComponent, },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  {
    path: 'account',
    component: AuthUserComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'details', component: AuthUserDetailsComponent },
      { path: 'newpassword', component: NewPasswordComponent },
      { path: 'photos', component: PhotosComponent }
    ]
  },
  { path: 'member/:id', component: SingleMemberComponent, canActivate: [SingleMemberGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'opinions', component: OpinionsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'intellectual-property', component: IntellectualPropertyComponent },
  { path: 'community-guidelines', component: CommunityGuidelinesComponent },
  { path: 'safety-tips', component: SafetyTipsComponent },
  { path: 'safety-and-policy', component: SafetyAndPolicyComponent },
  { path: 'products', component: ProductsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
