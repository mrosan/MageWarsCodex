import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { arenaSets } from 'src/app/data/sets';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
// TODO Catalog and List should inherit from the same Component
export class CatalogComponent implements OnInit, OnDestroy {
  public list$: Observable<CatalogItem[]>;
  public list: CatalogItem[] | undefined;
  private listSub: Subscription | undefined;

  public filterView: CatalogFilterForm | undefined;
  public filterGroup: FormGroup;
  private fgSub: Subscription | undefined;
  private allSubTypes: string[] | undefined;
  public wideScreen: boolean = false;
  public innerWidth: any;
  public selectedCard: CatalogItem | undefined;

  constructor(
    private loader: LoaderService,
    private fb: FormBuilder,
    private emitter: EmitterService,
    private builder: BuilderService
  ) {
    this.list$ = this.loader.getCatalog();
    this.filterGroup = this.fb.group({
      name: [''],
      types: [[]],
      subTypes: [[]],
      schools: [[]],
      levels: [[]],
      novice: [false],
      only: [''],
      slots: [[]],
      strict: [false],
      sets: [arenaSets],
    }); // TODO type
  }

  ngOnInit(): void {
    this.#checkEquipmentSelectForm();
    this.listSub = this.list$.subscribe((val) => {
      this.list = val;
      if (!this.filterView && val.length) {
        //Beware of infinite loops!
        //this.#setSets();
        this.allSubTypes = this.loader.getAllSubTypes();
        this.filterView = {
          types: Object.values(SpellType),
          subTypes: this.allSubTypes,
          schools: Object.values(School),
          slots: Object.values(EquipmentSlot),
          levels: [1, 2, 3, 4, 5, 6, 7, 8],
          onlies: this.loader.getAllOnly(),
          sets: this.loader.getAllSets(),
        };
        this.loader.filterCatalog(this.filterGroup.value);
      }
    });
    this.fgSub = this.filterGroup.valueChanges.subscribe((val) => {
      this.#checkEquipmentSelectForm();
      this.loader.filterCatalog(val);
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
      this.filterView.subTypes = this.allSubTypes!.filter((st) =>
        st.toLowerCase().startsWith(val.toLowerCase())
      );
  }

  onWideScreenToggle() {
    this.wideScreen = !this.wideScreen;
    this.emitter.emitWideScreen(this.wideScreen);
  }

  resetForm() {
    this.filterGroup.reset();
    this.loader.filterCatalog(this.filterGroup.value);
    this.#setSets();
  }

  cardClicked(card: CatalogItem) {
    if (this.selectedCard) return;
    setTimeout(() => {
      this.selectedCard = undefined;
    }, 300);
    this.selectedCard = card;
    this.builder.addCard(card);
  }

  #checkEquipmentSelectForm() {
    if (this.filterGroup.controls['types'].value?.includes('Equipment')) {
      this.filterGroup.controls['slots'].enable({ emitEvent: false });
    } else {
      this.filterGroup.controls['slots'].disable({ emitEvent: false });
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
}
