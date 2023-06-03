import { Injectable } from '@angular/core';
import { CodexItem, CodexItemCategory } from 'src/app/interfaces/codex-item';
import {
  CatalogItem,
  SpellType,
  SchoolWithLevel,
  EquipmentSlot,
} from 'src/app/interfaces/catalog-item';
import { Mage, Affinity } from '../interfaces/mage-item';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  list: BehaviorSubject<CodexItem[]>;
  catalog: BehaviorSubject<CatalogItem[]>;
  mages: BehaviorSubject<Mage[]>;
  private fullList: CodexItem[] = [];
  private fullCatalog: CatalogItem[] = [];
  private mageList: Mage[] = [];

  constructor(private http: HttpClient) {
    this.list = new BehaviorSubject<CodexItem[]>([]);
    this.catalog = new BehaviorSubject<CatalogItem[]>([]);
    this.mages = new BehaviorSubject<Mage[]>([]);

    // Try loading rules from database, if that fails use the local version
    this.http.get('not-yet-implemented/catch-error-instead.json').subscribe({
      next: (data) => {
        console.log('This somehow arrived! ', data);
      },
      error: (_) => {
        import('../data/codex.json').then(
          (rules) => {
            this.fullList = this.#parseJson<CodexItem>(
              rules,
              this.#createCodexItem.bind(this)
            ).sort((a, b) => (a.name < b.name ? -1 : 1));
            this.list.next(this.fullList);
          },
          (err) => console.log(err)
        );
      },
    });
    this.http.get('also-not-implemented/catch-error-instead.json').subscribe({
      next: (data) => {
        console.log('This somehow works? ', data);
      },
      error: (_) => {
        import('../data/catalog.json').then(
          (rules) => {
            this.fullCatalog = this.#parseJson<CatalogItem>(
              rules,
              this.#createCatalogItem.bind(this)
            ).sort((a, b) => {
              if (a.subTypes.includes('Wall') && !b.subTypes.includes('Wall'))
                return 1;
              if (!a.subTypes.includes('Wall') && b.subTypes.includes('Wall'))
                return -1;
              return a.name < b.name ? -1 : 1;
            });
            this.catalog.next(this.fullCatalog);
          },
          (err) => console.log(err)
        );
      },
    });
    this.http.get('not-implemented-either/catch-error-instead.json').subscribe({
      next: (data) => {
        console.log('But... how? ', data);
      },
      error: (_) => {
        import('../data/mages.json').then(
          (mage) => {
            this.mageList = this.#parseJson<Mage>(
              mage,
              this.#createMageItem.bind(this)
            ).sort((a, b) => (a.name < b.name ? -1 : 1));
            this.mages.next(this.mageList);
          },
          (err) => console.log(err)
        );
      },
    });
  }

  getList() {
    return this.list;
  }

  getCatalog() {
    return this.catalog;
  }

  getMages() {
    return this.mages;
  }

  getAllSubTypes() {
    return [
      ...new Set(
        this.fullCatalog
          .map((c) => c.subTypes)
          .flat()
          .sort()
      ),
    ];
  }

  getAllOnly(): string[] {
    return [
      ...new Set(
        this.fullCatalog
          .map((c) => (c?.only ? c.only : ''))
          .filter((c) => c)
          .sort()
      ),
    ];
  }

  getAllSets(): string[] {
    return [
      ...new Set(
        this.fullCatalog
          .map((c) => c.set)
          .filter((c) => c)
          .sort()
      ),
    ];
  }

  filterList(searchFilter: string, categoryFilter: CodexItemCategory[]) {
    let filteredList = this.fullList;
    if (categoryFilter.length > 0) {
      filteredList = filteredList.filter((item) =>
        categoryFilter.includes(item.category)
      );
    }
    filteredList = this.#filterName(filteredList, searchFilter);
    this.list.next(filteredList);
  }

  // TODO any
  filterCatalog(filter: any) {
    let filteredList = this.fullCatalog;
    if (filter.name) {
      filteredList = this.#filterName(filteredList, filter.name);
    }
    filteredList = filteredList.filter((item) => {
      let valid = true;
      if (filter.novice) valid = valid && (item?.novice ?? false);
      if (valid && filter.types?.length)
        valid = valid && filter.types.includes(item.type);
      if (valid && filter.subTypes?.length) {
        if (filter.strict) {
          for (let st of filter.subTypes) {
            valid = valid && item.subTypes.includes(st);
          }
        } else {
          valid =
            valid &&
            filter.subTypes.filter((st: any) => item.subTypes.includes(st))
              .length > 0;
        }
      }
      if (valid && filter.schools?.length) {
        if (filter.strict) {
          for (let s of filter.schools) {
            valid = valid && item.schools.map((swl) => swl.school).includes(s);
          }
        } else {
          valid =
            valid &&
            filter.schools.filter((s: any) =>
              item.schools.map((swl: SchoolWithLevel) => swl.school).includes(s)
            ).length > 0;
        }
      }
      if (valid && filter.levels?.length) {
        valid =
          valid &&
          filter.levels.includes(
            item.schools.reduce((acc, curr) => +acc + +curr.level, 0)
          );
      }
      if (valid && filter.only?.length) {
        valid =
          valid &&
          (item.only ?? false) &&
          filter.only.filter((o: string) =>
            this.#isExclusiveMatch(o, item.only ?? '')
          ).length;
      }
      if (
        valid &&
        filter.types?.includes('Equipment') &&
        filter.slots?.length
      ) {
        if (item.slot) {
          valid = valid && filter.slots.includes(item.slot);
        }
      }
      if (valid && filter.sets?.length) {
        valid = valid && filter.sets.includes(item.set);
      }
      return valid;
    });
    this.catalog.next(filteredList);
  }

  #filterName(filteredList: any, searchFilter: string) {
    if (searchFilter.includes(' ')) {
      return filteredList.filter((item: any) =>
        item.name.toLowerCase().startsWith(searchFilter.toLowerCase())
      );
    }
    return filteredList.filter((item: any) =>
      item.name
        .toLowerCase()
        .split(' ')
        .reduce(
          (acc: boolean, curr: string) =>
            acc || curr.startsWith(searchFilter.toLowerCase()),
          false
        )
    );
  }

  // TODO any
  #parseJson<T>(list: any[], createItem: (id: string, item: any) => T) {
    let result: T[] = [];
    // TODO some validation / error handling
    for (let key in list) {
      if (key == 'length' || key == 'default') continue; // what a hack...
      if (!list[key].name) continue;
      result.push(createItem(key, list[key]));
    }
    return result;
  }

  #createCodexItem(id: string, item: any) {
    return {
      id: id,
      name: item.name,
      image: item.image ? 'assets/icons/' + item.image : '',
      description: item.description,
      category:
        CodexItemCategory[item.category as keyof typeof CodexItemCategory],
    };
  }

  #createCatalogItem(id: string, item: any) {
    const slot = Object.keys(EquipmentSlot).find((x) => {
      return item.slot && x === item.slot;
    });
    const schools = item.schools.map((x: any) => {
      return { school: x.school, level: x.level } as SchoolWithLevel;
    });
    return {
      id,
      name: item.name,
      image: item.image ? 'assets/cards/' + item.image + '.jpg' : '',
      type: SpellType[item.type as keyof typeof SpellType],
      subTypes: item.subtypes,
      schools: schools,
      novice: Boolean(item?.novice),
      only: item?.only ?? '',
      slot: slot
        ? EquipmentSlot[slot as keyof typeof EquipmentSlot]
        : undefined,
      set: item?.set ? item.set : 'Arena Core Set',
      sumLevel: schools.reduce(
        (sum: number, cur: SchoolWithLevel) => +sum + +cur.level,
        0
      ),
    };
  }

  #createMageItem(id: string, item: any): Mage {
    return {
      id,
      name: item.name,
      affinities: [],
      cardFront: 'assets/mages/' + item.images.front + '.jpg',
      cardBack: 'assets/mages/' + item.images.back + '.jpg',
    };
  }

  #isExclusiveMatch(filter: string, itemOnly: string): boolean {
    switch (filter) {
      case itemOnly:
        return true;
      case 'Dark Mage':
        return ['Necromancer', 'Warlock'].includes(itemOnly);
      case 'Holy Mage':
        return ['Priestess', 'Paladin'].includes(itemOnly);
      case 'War Mage':
        return ['Warlord', 'Paladin'].includes(itemOnly);
      case 'Mind Mage':
        return ['Forcemaster', 'Monk'].includes(itemOnly);
      case 'Nature Mage':
        return ['Beastmaster', 'Druid'].includes(itemOnly);
      case 'Arcane Mage':
        return ['Wizard'].includes(itemOnly);
      default:
        return false;
    }
  }
}
