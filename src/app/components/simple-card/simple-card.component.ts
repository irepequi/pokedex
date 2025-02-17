import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';

import { typeColors } from '../../styles/type-colors';

import { Pokemon } from '../../interface/pokemon';
import { PokemonStateService } from '../../services/pokemon-state.service';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss'],
  imports: [CommonModule, CardModule, ChipModule, TagModule],
})
export class SimpleCardComponent implements OnInit {
  @Input() pokemon!: Pokemon;
  @Output() pokemonSelected = new EventEmitter<Pokemon>();

  constructor(private pokemonStateService: PokemonStateService) {}

  ngOnInit() {}

  /**
   * Generates an array of type objects with their corresponding background and text colors.
   *
   * @remarks
   * This function iterates through the pokemon's types and retrieves their corresponding background
   * and text colors from the `typeColors` object. If a type does not have a defined color in the object,
   * it assigns a default color.
   *
   * @returns {Array<{name: string, backgroundColor: string, textColor: string}>}
   * An array of type objects with their background and text colors.
   */
  showTypes() {
    return this.pokemon.types.map((type) => {
      const colors = typeColors[type.type.name] || {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        textColor: 'black',
      };
      return {
        name: type.type.name,
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
      };
    });
  }

  /**
   * Emits the selected pokemon data and updates the pokemon state service.
   *
   * @remarks
   * This function is called when a user selects a pokemon card. It emits the selected pokemon
   * data to any subscribed components and updates the pokemon state service with the selected pokemon's data.
   *
   * @param pokemon - The selected pokemon object.
   * @returns {void}
   */
  selectPokemon() {
    this.pokemonStateService.setPokemonData(this.pokemon);
    this.pokemonSelected.emit(this.pokemon);
  }
}
