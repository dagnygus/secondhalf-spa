import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DynamicBackgroundComponent } from './components/header/dynamic-background/dynamic-background.component';
import { BackgroundCarouselComponent } from './components/header/background-carousel/background-carousel.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenIntercenptor } from 'src/app/modules/core/interceptors/token.interceptor';
import { HomeComponent } from './components/home/home.component';
import { NotificationsModule } from '../notifications/notifications.module';
import { HeaderSignInFormComponent } from './components/header/header-sign-in-form/header-sign-in-form.component';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { initializeApp } from '@angular/fire/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { environment } from 'src/environments/environment';
import { NotFoundComponent } from './components/404/not-found.component';
import { RouterLoadingIndicatorComponent } from './components/router-loading-indicator/router-loading-indicator.component';
import { BannerComponent } from './components/header/banner/banner.component';

@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    DynamicBackgroundComponent,
    BackgroundCarouselComponent,
    NavbarComponent,
    HeaderSignInFormComponent,
    NotFoundComponent,
    RouterLoadingIndicatorComponent,
    BannerComponent,
  ],
  imports: [
    SharedModule,
    NotificationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.funcrtionsEmulator) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (environment.funcrtionsEmulator) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.funcrtionsEmulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    HttpClientModule,
    NotificationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenIntercenptor, multi: true }
  ],
  exports: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    DynamicBackgroundComponent,
    BackgroundCarouselComponent,
    NavbarComponent,
    HttpClientModule,
    RouterLoadingIndicatorComponent,
  ]
})
export class CoreModule { }
