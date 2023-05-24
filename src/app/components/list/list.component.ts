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
import { ListLoaderService } from 'src/app/services/list-loader.service';
import { displayCategory } from 'src/app/utils/display';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  public searchValue: string = '';
  public showCategoryFilter: boolean = false;
  public catFilters: CodexItemCategoryFilter[] = [];
  public list$: Observable<CodexItem[]>;
  // TODO FormGroup
  searchFormControl: FormControl = new FormControl('');
  filterFormControl: FormControl = new FormControl('');
  private sfcSub: Subscription | undefined;
  private ffcSub: Subscription | undefined;

  constructor(
    private loader: ListLoaderService,
    private cdr: ChangeDetectorRef
  ) {
    this.list$ = this.loader.getList();
    this.loadCategoryFilters();
  }

  ngOnInit(): void {
    this.sfcSub = this.searchFormControl.valueChanges.subscribe((input) => {
      this.refreshList(input);
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.sfcSub?.unsubscribe();
    this.ffcSub?.unsubscribe();
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

/*
- show all by default
- search (input field filter)
- filter by category (checkboxes)
- option to hide icons in items
*/
