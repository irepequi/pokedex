import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { FilterService } from '../../services/filter.service';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule],
})
export class FilterComponent implements OnInit {
  selectedTypes: string[] = [];
  pokemonTypes: string[] = [];

  constructor(
    private filterService: FilterService,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.loadPokemonTypes();
  }

  /**
   * Retrieves the list of available Pokémon types from the PokemonService and updates the component's pokemonTypes` property.
   *
   * @returns - None
   */
  loadPokemonTypes() {
    this.pokemonService.getPokemonTypes().subscribe({
      next: (types) => {
        this.pokemonTypes = types;
      },
      error: (error) => {
        console.log('Error al obtener los tipos de Pokémon:', error);
      },
    });
  }

  /**
   * Deselects all the selected types and triggers the checkbox change event.
   *
   * @param - None
   * @returns - None
   */
  toggleDeselectAll() {
    this.selectedTypes = [];
    this.onCheckboxChange();
  }

  /**
   * Handles the checkbox change event and updates the filter service with the selected types.
   *
   * @param - None
   * @returns - None
   */
  onCheckboxChange() {
    this.filterService.setFilter(this.selectedTypes);
  }
}
