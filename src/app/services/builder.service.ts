import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mage } from '../interfaces/mage-item';
import { CatalogItem } from '../interfaces/catalog-item';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum Outcome {
  SUCCESS = 'Operation was successful.',
  DECK_LIMIT = 'Your spellbook is already full.',
  SPELL_LIMIT = "You can't add any more of this spell to your spellbook.",
  EPIC_LIMIT = "You can't have more than one of this Epic spell.",
}

@Injectable({
  providedIn: 'root',
})
export class BuilderService {
  private selectedMage: Mage | undefined;
  private spellBook: Map<string, [CatalogItem, number]> = new Map();
  public spellBook$: BehaviorSubject<Map<string, [CatalogItem, number]>>;

  constructor(private snackBar: MatSnackBar) {
    this.spellBook$ = new BehaviorSubject<Map<string, [CatalogItem, number]>>(
      new Map()
    );
  }

  selectMage(mage: Mage) {
    this.selectedMage = this.selectedMage?.id !== mage.id ? mage : undefined;
    return this.selectedMage;
  }

  getMage(): Mage | undefined {
    return this.selectedMage;
  }

  getSpellBook(): BehaviorSubject<Map<string, [CatalogItem, number]>> {
    return this.spellBook$;
  }

  addCard(card: CatalogItem): Outcome {
    if (this.spellBook.size > 121) {
      this.snackBar.open(Outcome.DECK_LIMIT, '', {
        duration: 2000,
      });
      return Outcome.DECK_LIMIT;
    }
    let duplicates = 1;
    if (this.spellBook.has(card.id)) {
      duplicates += this.spellBook.get(card.id)![1];
    }
    const level = card.schools.reduce((sum, cur) => +sum + +cur.level, 0);
    // TODO epic cards!
    if (!((level === 1 && duplicates <= 6) || duplicates <= 4)) {
      this.snackBar.open(Outcome.SPELL_LIMIT, '', {
        duration: 2000,
      });
      return Outcome.SPELL_LIMIT;
    }

    this.spellBook.set(card.id, [card, duplicates]);
    this.spellBook$.next(this.spellBook);
    return Outcome.SUCCESS;
  }

  removeCard(card: CatalogItem) {
    if (this.spellBook.has(card.id)) {
      const duplicates = this.spellBook.get(card.id)![1];
      if (duplicates > 1) {
        this.spellBook.set(card.id, [card, duplicates - 1]);
      } else {
        this.spellBook.delete(card.id);
      }
      this.spellBook$.next(this.spellBook);
    }
  }

  validateBook(): boolean {
    return true;
  }
}
