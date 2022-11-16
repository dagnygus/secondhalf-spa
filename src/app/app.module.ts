import { NgModule } from '@angular/core';
import { CoreModule } from './modules/core/core.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { appReducers, effects, } from './app.ngrx.utils';
import { AppComponent } from './modules/core/components/app/app.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
    AppRoutingModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(effects),
    CoreModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
