import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import {
  CodexItem,
  CodexItemCategory,
  CodexItemCategoryFilter,
} from 'src/app/interfaces/codex-item';
import { LoaderService } from 'src/app/services/loader.service';
import { displayCategory } from 'src/app/utils/display';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
// TODO List and Catalog should inherit from the same Component
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  public searchValue: string = '';
  public showCategoryFilter: boolean = false;
  public catFilters: CodexItemCategoryFilter[] = [];
  public list$: Observable<CodexItem[]>;
  public list: CodexItem[] | undefined;
  searchFormControl: FormControl = new FormControl('');
  private sfcSub: Subscription | undefined;
  private listSub: Subscription | undefined;
  public innerWidth: any;

  constructor(private loader: LoaderService, private cdr: ChangeDetectorRef) {
    this.list$ = this.loader.getList();
    this.loadCategoryFilters();
  }

  ngOnInit(): void {
    this.listSub = this.list$.subscribe((val) => {
      this.list = val;
    });
    this.sfcSub = this.searchFormControl.valueChanges.subscribe((input) => {
      this.refreshList(input);
    });
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.sfcSub?.unsubscribe();
    this.listSub?.unsubscribe();
  }

  filterButtonToggle() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  refreshList(searchValue?: string) {
    const filter = this.catFilters.filter((f) => f.selected).map((f) => f.id);
    this.loader.filterList(searchValue ?? this.searchValue, filter);
  }

  private loadCategoryFilters() {
    for (let c in CodexItemCategory) {
      if (typeof CodexItemCategory[c] === 'number') {
        const displayName = displayCategory(+CodexItemCategory[c]);
        if (displayName) {
          const dn = {
            id: +CodexItemCategory[c],
            displayName: displayName,
            selected: false,
          };
          this.catFilters.push(dn);
        }
      }
    }
    this.catFilters.sort(
      (a: CodexItemCategoryFilter, b: CodexItemCategoryFilter) => {
        return a.displayName < b.displayName ? -1 : 1;
      }
    );
  }
}
