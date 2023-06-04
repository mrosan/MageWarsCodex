import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Affinity, Mage } from '../interfaces/mage-item';
import { CatalogItem, SchoolWithLevel } from '../interfaces/catalog-item';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum Outcome {
  SUCCESS = 'Operation was successful.',
  DECK_LIMIT = 'Your spellbook is already full.',
  SPELL_LIMIT = "You can't add any more of this spell to your spellbook.",
  EPIC_LIMIT = 'You already have this Epic spell in your spellbook.',
}

export enum Validity {
  VALID = 'The spellbook is valid.',
  NO_MAGE = 'No mage.',
  OVERFLOW = 'Too many spells.',
  INCOMPATIBILITY = 'Incompatible spells.',
  DUPLICATION = 'Too many duplicates.',
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
    if (card.epic && duplicates > 1) {
      this.snackBar.open(Outcome.EPIC_LIMIT, '', {
        duration: 2000,
      });
      return Outcome.EPIC_LIMIT;
    }
    const level = card.schools.reduce((sum, cur) => +sum + +cur.level, 0);
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

  countPoints(): number {
    let sum = 0;
    this.spellBook.forEach((val) => {
      const card = val[0];
      const amount = val[1];
      if (card.novice) {
        sum += 1;
      } else if (card.name !== 'Talos') {
        if (this.selectedMage) {
          const specialMatchMultiplier = this.#checkSpecialMatch(
            card,
            this.selectedMage.affinities
          );
          let orMultiplier = {
            minSearchNeeded: false,
            minVal: 2,
            orLevel: 0,
          };
          if (card.schools.map((swl) => +swl.level).includes(0)) {
            orMultiplier.minSearchNeeded = true;
            orMultiplier.orLevel = card.schools.filter(
              (swl) => swl.level !== 0
            )[0].level;
          }
          for (let schoolWithLevel of card.schools) {
            let multiplier = specialMatchMultiplier ?? 2;
            if (!specialMatchMultiplier) {
              for (let a of this.selectedMage.affinities) {
                if (this.#matchAffinity(schoolWithLevel, a)) {
                  if (orMultiplier.minSearchNeeded) {
                    orMultiplier.minVal = Math.min(
                      orMultiplier.minVal,
                      a.multiplier
                    );
                  } else {
                    multiplier = a.multiplier;
                    break;
                  }
                }
              }
            }
            if (!orMultiplier.minSearchNeeded) {
              sum += amount * schoolWithLevel.level * multiplier;
            }
          }
          if (orMultiplier.minSearchNeeded) {
            sum += amount * orMultiplier.orLevel * orMultiplier.minVal;
          }
        }
      }
    });
    return sum;
  }

  validateBook(sumPoints: number, maxPoints: number): Validity[] {
    let res = [];
    if (!this.selectedMage) {
      res.push(Validity.NO_MAGE);
    } else {
      for (let val of this.spellBook.values()) {
        if (val[0].only && !this.selectedMage.only.includes(val[0].only)) {
          res.push(Validity.INCOMPATIBILITY);
          break;
        }
      }
    }
    if (sumPoints > maxPoints) {
      res.push(Validity.OVERFLOW);
    }
    return res;
  }

  #matchAffinity(swl: SchoolWithLevel, aff: Affinity): boolean {
    if (aff.school && aff.school === swl.school) {
      return aff.level ? swl.level <= aff.level : true;
    }
    return false;
  }

  // Siren, Forcemaster, OR cards
  #checkSpecialMatch(
    card: CatalogItem,
    affinities: Affinity[]
  ): number | undefined {
    for (let a of affinities) {
      // Siren
      if (a.subtype && card.subTypes.includes(a.subtype)) {
        return a.multiplier;
      }
      // Forcemaster, assuming there are no mixed-mind-school creatures
      if (a.type && a.school && a.excludeSchool) {
        if (
          a.type == card.type &&
          !card.schools.map((swl) => swl.school).includes(a.school)
        ) {
          return a.multiplier;
        }
      }
    }
    return undefined;
  }
}
