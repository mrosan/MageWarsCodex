import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { EmitterService } from './services/emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public wideScreen: boolean = false;
  public selectedTab: string = 'codex'; // TODO enum

  private wsSub: Subscription | undefined;
  private tabSub: Subscription | undefined;

  constructor(private router: Router, private emitter: EmitterService) {}

  navigateTo(tab: string) {
    this.emitter.emitWideScreen(false);
    this.router.navigate([tab]);
  }

  ngOnInit(): void {
    this.wsSub = this.emitter.onWideScreen.subscribe(
      (wide) => (this.wideScreen = wide)
    );
    this.tabSub = this.emitter.onTabChange.subscribe(
      (tab) => (this.selectedTab = tab)
    );
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
  }
}
