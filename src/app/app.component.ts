import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
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
  public selectedTab: string | undefined; // TODO enum
  public innerWidth: any;
  public windowScrolled: boolean = false;

  private wsSub: Subscription | undefined;
  private tabSub: Subscription | undefined;

  constructor(
    private router: Router,
    private emitter: EmitterService,
    private cdr: ChangeDetectorRef
  ) {}

  navigateTo(tab: string) {
    if (
      !(
        ['/deck', '/catalog'].includes(this.router.url) &&
        ['deck', 'catalog'].includes(tab)
      )
    ) {
      this.emitter.emitWideScreen(false);
    }
    this.router.navigate([tab]);
  }

  ngOnInit(): void {
    this.wsSub = this.emitter.onWideScreen.subscribe(
      (wide) => (this.wideScreen = wide)
    );
    this.tabSub = this.emitter.onTabChange.subscribe((tab) => {
      this.selectedTab = tab;
      this.cdr.detectChanges();
    });
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    this.tabSub?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      let currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
