import { Component, Input } from '@angular/core';
import { CodexItemCategory } from 'src/app/interfaces/codex-item';
import { displayCategory } from 'src/app/utils/display';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() item: any;

  displayCategory(category: CodexItemCategory) {
    return displayCategory(category);
  }
}
