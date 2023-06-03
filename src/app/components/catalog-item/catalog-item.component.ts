import { Component, Input } from '@angular/core';
import { CatalogItem } from 'src/app/interfaces/catalog-item';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent {
  @Input() item: CatalogItem | undefined;
  @Input() selected: boolean = false;
  @Input() addOverlay: boolean = true;
}
