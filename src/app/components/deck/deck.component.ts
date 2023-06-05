import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BuilderService, Validity } from 'src/app/services/builder.service';
import { LoaderService } from 'src/app/services/loader.service';
import { EmitterService } from 'src/app/services/emitter.service';
import { Mage } from 'src/app/interfaces/mage-item';
import { SpellType } from 'src/app/interfaces/catalog-item';
import { CatalogItem } from 'src/app/interfaces/catalog-item';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit, OnDestroy {
  mage: Mage | undefined;
  spells$!: BehaviorSubject<Map<string, [CatalogItem, number]>>;
  spells: [CatalogItem, number][] = [];
  spellSub: Subscription | undefined;
  levelStats: number[] = [0, 0, 0, 0, 0, 0, 0];
  typeStats = {
    'Attack spell': 0,
    Creature: 0,
    Conjuration: 0,
    Enchantment: 0,
    Equipment: 0,
    Incantation: 0,
  }; // TODO do this programatically
  innerWidth: any;
  spentPoints: number = 0;
  bookErrors: Validity[] = [];
  maxPoints = 120;

  constructor(
    private builder: BuilderService,
    private loader: LoaderService,
    private emitter: EmitterService
  ) {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.mage = this.builder.getMage();
    this.spells$ = this.builder.getSpellBook();
    this.spellSub = this.spells$.subscribe((val) => {
      this.levelStats = [0, 0, 0, 0, 0, 0, 0];
      this.typeStats = {
        'Attack spell': 0,
        Creature: 0,
        Conjuration: 0,
        Enchantment: 0,
        Equipment: 0,
        Incantation: 0,
      };
      val.forEach((v) => {
        this.levelStats[v[0].sumLevel - 1] += v[1];
        this.typeStats[v[0].type] += v[1];
        this.spells.push(v);
      });
      this.sortSpells();
      this.spentPoints = this.builder.countPoints();
      this.bookErrors = this.builder.validateBook(
        this.spentPoints,
        this.maxPoints
      );
    });
    this.emitter.emitTab('deck');
  }

  ngOnDestroy(): void {
    this.spellSub?.unsubscribe();
  }

  add(card: CatalogItem) {
    this.builder.addCard(card);
  }

  remove(card: CatalogItem) {
    this.builder.removeCard(card);
  }

  reset() {
    this.builder.resetBook();
    this.mage = undefined;
  }

  async import(event: Event) {
    let result = await this.loader.importBook(event);
    this.reset();
    this.builder.parseImport(result);
    this.mage = result[0];
  }

  export() {
    this.loader.exportBook(this.mage, this.spells$.getValue());
  }

  sortSpells() {
    const sortOrder = [
      SpellType.CREATURE,
      SpellType.ENCHANTMENT,
      SpellType.INCANTATION,
      SpellType.CONJURATION,
      SpellType.EQUIPMENT,
      SpellType.ATTACK,
    ];
    this.spells.sort((a, b) => {
      if (a[0].type === b[0].type) {
        return a[0].name < b[0].name ? -1 : 1;
      } else {
        return sortOrder.indexOf(a[0].type) - sortOrder.indexOf(b[0].type);
      }
    });
  }

  // TODO filter options
  // TODO back to top
}
