import { Injectable } from '@angular/core';
import { CodexItem, CodexItemCategory } from 'src/app/interfaces/codex-item';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ListLoaderService {
  list: Subject<CodexItem[]>;
  private fullList: CodexItem[] = [];

  constructor(private http: HttpClient) {
    this.list = new Subject<CodexItem[]>();
    // Try loading rules from database, if that fails use the local version
    this.http.get('not-yet-implemented/catch-error-instead.json').subscribe(
      (data) => {
        console.log('This somehow arrived! ', data);
      },
      (_) => {
        import('../data/codex.json').then(
          (rules) => this.#parseRules(rules),
          (err) => console.log(err)
        );
      }
    );
  }

  getList() {
    return this.list;
  }

  filterList(searchFilter: string, categoryFilter: CodexItemCategory[]) {
    let filteredList = this.fullList;
    if (categoryFilter.length > 0) {
      filteredList = filteredList.filter((item) =>
        categoryFilter.includes(item.category)
      );
    }
    filteredList = filteredList.filter((item) =>
      item.name.toLocaleLowerCase().includes(searchFilter.toLocaleLowerCase())
    );
    this.list.next(filteredList);
  }

  #parseRules(rules: any[]) {
    this.fullList = [];
    // TODO some validation / error handling
    for (let key in rules) {
      if (key == 'length' || key == 'default') continue; // what a hack...
      if (!rules[key].name) continue;
      this.fullList.push({
        id: key,
        name: rules[key].name,
        image: rules[key].image ? 'assets/icons/' + rules[key].image : '',
        description: rules[key].description,
        category:
          CodexItemCategory[
            rules[key].category as keyof typeof CodexItemCategory
          ],
      });
    }
    this.fullList.sort((a: CodexItem, b: CodexItem) => {
      return a.name < b.name ? -1 : 1;
    });
    this.list.next(this.fullList);
  }
}
