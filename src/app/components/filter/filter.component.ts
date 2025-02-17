import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class FilterComponent implements OnInit {
  selectedType: string = 'All';
  pokemonTypes: string[] = [
    'All',
    'Grass',
    'Poison',
    'Fire',
    'Water',
    'Bug',
    'Normal',
    'Flying',
  ];

  constructor(private filterService: FilterService) {}

  ngOnInit(): void {}

  onFilterChange() {
    this.filterService.setFilter(this.selectedType);
  }
}
