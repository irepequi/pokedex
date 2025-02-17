import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Pokemon } from '../../interface/pokemon';

import { PokemonStateService } from '../../services/pokemon-state.service';

@Component({
  selector: 'app-simple-card-evolution',
  templateUrl: './simple-card-evolution.component.html',
  styleUrls: ['./simple-card-evolution.component.scss'],
  imports: [CommonModule],
})
export class SimpleCardEvolutionComponent implements OnInit {
  @Input() pokemon!: Pokemon;

  constructor(private pokemonStateService: PokemonStateService) {}

  ngOnInit() {}

  /**
   * Opens the detailed view of the current pokemon.
   *
   * This function is called when the user clicks on the pokemon card.
   * It sets the selected pokemon data in the `PokemonStateService` to
   * trigger the display of the detailed view.
   *
   * @param {void} - This function does not take any parameters.
   * @returns {void} - This function does not return any value.
   */
  openDetails() {
    this.pokemonStateService.setPokemonData(this.pokemon);
  }
}
