import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DrawerModule } from 'primeng/drawer';

import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [DrawerModule, FilterComponent],
})
export class MenuComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filterChanged = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  closeDrawer() {
    this.visibleChange.emit(false);
  }

  onFilterChange(type: string) {
    this.filterChanged.emit(type);
  }
}
