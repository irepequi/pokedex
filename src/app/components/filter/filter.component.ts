import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule],
})
export class FilterComponent implements OnInit {
  selectedTypes: string[] = [];
  pokemonTypes: string[] = [];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {
    this.filterService.getPokemonTypes().subscribe((types) => {
      this.pokemonTypes = types;
    });
  }

  /**
   * Deselects all the types in the filter component.
   */
  toggleDeselectAll() {
    this.selectedTypes = [];
    this.onCheckboxChange();
  }

  /**
   * Handles the checkbox change event and updates the filter service with the selected types.
   */
  onCheckboxChange() {
    this.filterService.setFilter(this.selectedTypes);
  }
}
