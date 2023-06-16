import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Observable, Subscription } from 'rxjs';
import {
  CatalogItem,
  CatalogFilterForm,
  SpellType,
  School,
  EquipmentSlot,
} from 'src/app/interfaces/catalog-item';
import { LoaderService } from 'src/app/services/loader.service';
import { EmitterService } from 'src/app/services/emitter.service';
import { BuilderService } from 'src/app/services/builder.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
// TODO Catalog and List should inherit from the same Component
export class CatalogComponent implements OnInit, OnDestroy {
  public list: CatalogItem[] | undefined;
  public fullList: CatalogItem[] | undefined;
  private listSub: Subscription | undefined;
  private fgSub: Subscription | undefined;

  public filterView: CatalogFilterForm | undefined;
  public filterGroup: FormGroup;
  public allSubTypes: [string[], Map<string, number>] = [[], new Map()];
  public wideScreen: boolean = false;
  public innerWidth: any;
  public selectedCard: CatalogItem | undefined;
  public pageIndex: number = 0;
  public pageSize: number = 25;

  constructor(
    private loader: LoaderService,
    private filter: FilterService,
    private emitter: EmitterService,
    private builder: BuilderService
  ) {
    this.filterGroup = this.filter.getFormGroup();
  }

  ngOnInit(): void {
    this.#checkEquipmentSelectForm();
    this.listSub = this.loader.getCatalog().subscribe((val) => {
      this.fullList = val;
      this.pageIndex = 0;
      this.list = this.fullList.slice(
        this.pageIndex * this.pageSize,
        this.pageSize
      );
      if (!this.filterView && val.length) {
        this.allSubTypes = this.loader.getAllSubTypes();
        this.filterView = {
          types: Object.values(SpellType),
          subTypes: this.allSubTypes[0],
          schools: Object.values(School),
          slots: Object.values(EquipmentSlot),
          levels: [1, 2, 3, 4, 5, 6, 7, 8],
          onlies: this.loader.getAllOnly(),
          sets: this.loader.getAllSets(),
          traits: this.loader.getAllTraits(),
        };
        this.loader.filterCatalog(
          this.filterGroup.value,
          this.builder.getMage()
        );
      }
    });
    this.fgSub = this.filterGroup.valueChanges.subscribe((val) => {
      this.#checkEquipmentSelectForm();
      this.#checkSubtypesSelectForm();
      this.loader.filterCatalog(val, this.builder.getMage());
    });
    this.emitter.emitTab('catalog');
    this.innerWidth = window.innerWidth;
  }

  ngOnDestroy(): void {
    this.listSub?.unsubscribe();
    this.fgSub?.unsubscribe();
  }

  onSubtypeFilterChange(event: Event) {
    event.stopPropagation();
    let val = (<HTMLTextAreaElement>event.target).value;
    if (this.filterView)
      this.filterView.subTypes = this.allSubTypes[0].filter((st) =>
        st.toLowerCase().startsWith(val.toLowerCase())
      );
  }

  onWideScreenToggle() {
    this.wideScreen = !this.wideScreen;
    this.emitter.emitWideScreen(this.wideScreen);
  }

  resetForm() {
    this.filterGroup.reset();
    this.loader.filterCatalog(this.filterGroup.value, this.builder.getMage());
    this.#setSets();
    this.pageIndex = 0;
  }

  cardClicked(card: CatalogItem) {
    if (this.selectedCard) return;
    setTimeout(() => {
      this.selectedCard = undefined;
    }, 300);
    this.selectedCard = card;
    this.builder.addCard(card);
  }

  handlePageEvent(event: PageEvent) {
    if (!this.fullList) return;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    const start = this.pageIndex * this.pageSize;
    this.list = this.fullList.slice(start, start + this.pageSize);
  }

  #checkEquipmentSelectForm() {
    if (this.filterGroup.controls['types'].value?.includes('Equipment')) {
      this.filterGroup.controls['slots'].enable({ emitEvent: false });
    } else {
      this.filterGroup.controls['slots'].disable({ emitEvent: false });
    }
  }

  #checkSubtypesSelectForm() {
    if (!this.filterView) return;
    if (this.filterGroup.controls['commonSubtypes'].value) {
      const limit = 5;
      this.filterView.subTypes = this.allSubTypes[0].filter((type) => {
        if (!this.allSubTypes[1].get(type)) return true;
        return this.allSubTypes[1].get(type)! > limit;
      });
    } else {
      this.filterView.subTypes = this.allSubTypes[0];
    }
  }

  #setSets() {
    const almostAllSets = this.loader
      .getAllSets()
      .filter((s) => s !== 'Forcemaster - Academy');
    this.filterGroup.controls['sets'].setValue(almostAllSets, {
      emitEVent: false,
    });
  }

  // TODO add subtypes filter input clear button
  // TODO delegate some of the operations here to FilterService
}
