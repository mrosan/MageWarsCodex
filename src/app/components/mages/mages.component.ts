import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mage } from 'src/app/interfaces/mage-item';
import { LoaderService } from 'src/app/services/loader.service';
import { EmitterService } from 'src/app/services/emitter.service';

@Component({
  selector: 'app-mages',
  templateUrl: './mages.component.html',
  styleUrls: ['./mages.component.scss'],
})
export class MagesComponent implements OnInit, OnDestroy {
  @Input() list: Mage[] | undefined;
  private listSub: Subscription | undefined;

  constructor(private loader: LoaderService, private emitter: EmitterService) {}

  ngOnInit() {
    this.listSub = this.loader.getMages().subscribe((mages) => {
      this.list = mages;
    });
    this.emitter.emitTab('mages');
  }

  ngOnDestroy(): void {
    this.listSub?.unsubscribe();
  }
}
