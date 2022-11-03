import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from './angular-material.module';
import { environment } from 'src/environments/environment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  imports: [
    AngularMaterialModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: environment.defaultLanguage }
  ],
  exports: []
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {

    //this.logger.info('Core Module initialised');

    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

}
