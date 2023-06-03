import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BuilderService } from 'src/app/services/builder.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Mage } from 'src/app/interfaces/mage-item';
import { CatalogItem } from 'src/app/interfaces/catalog-item';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit, OnDestroy {
  mage: Mage | undefined;
  spells$!: BehaviorSubject<Map<string, [CatalogItem, number]>>;
  spells!: Map<string, [CatalogItem, number]>;
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
  public innerWidth: any;

  constructor(private builder: BuilderService, private loader: LoaderService) {}

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
        this.spells = val;
        this.levelStats[v[0].sumLevel - 1] += v[1];
        this.typeStats[v[0].type] += v[1];
      });
    });
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
}
