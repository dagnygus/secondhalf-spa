import { filter, map } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-router-loading-indicator',
  templateUrl: './router-loading-indicator.component.html',
  styleUrls: ['./router-loading-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouterLoadingIndicatorComponent {

}
