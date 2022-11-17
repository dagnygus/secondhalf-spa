import { NgModule } from '@angular/core';
import { CoreModule } from './modules/core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducers, effects, } from './app.ngrx.utils';
import { AppComponent } from './modules/core/components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  imports: [
    AppRoutingModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(effects),
    CoreModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'second-half-server-id-1234' }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
