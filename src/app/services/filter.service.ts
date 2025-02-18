import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Pokemon } from '../interface/pokemon';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSubject = new BehaviorSubject<string[]>([]);
  filter$ = this.filterSubject.asObservable();

  private pokemonTypesSubject = new BehaviorSubject<string[]>([]);
  pokemonTypes$ = this.pokemonTypesSubject.asObservable();

  /**
   * Sets the filter settings for Pokémon types.
   *
   * @param selectedTypes - An array of strings representing the selected types for filtering.
   * @returns {void}
   */
  setFilter(selectedTypes: string[]): void {
    this.filterSubject.next(selectedTypes);
  }

  /**
   * Retrieves an observable stream of the current filter settings.
   *
   * @returns An observable of an array of strings representing the selected types for filtering.
   */
  getFilter(): Observable<string[]> {
    return this.filter$;
  }

  /**
   * Retrieves the current filter settings.
   *
   * @returns An array of strings representing the selected types for filtering.
   */
  getCurrentFilter(): string[] {
    return this.filterSubject.getValue();
  }

  /**
   * Filters an array of Pokémon based on selected types.
   *
   * @param pokemons - The array of Pokémon to be filtered.
   * @param selectedTypes - The array of types selected for filtering.
   * @returns An array of Pokémon that match the selected types.
   */
  filterPokemons(pokemons: Pokemon[], selectedTypes: string[]): Pokemon[] {
    if (selectedTypes.length === 0) {
      return pokemons;
    } else {
      return pokemons.filter((pokemon) =>
        selectedTypes.every((type) =>
          pokemon.types.some(
            (pokemonType) =>
              pokemonType.type.name.toLowerCase() === type.toLowerCase()
          )
        )
      );
    }
  }

  /**
   * Extracts unique Pokémon types from an array of Pokémon and updates the internal state.
   *
   * @param pokemons - The array of Pokémon from which to extract types.
   * @returns {void}
   */
  extractPokemonTypes(pokemons: Pokemon[]): void {
    const typeSet = new Set<string>();
    pokemons.forEach((pokemon) => {
      pokemon.types.forEach((typeInfo) => {
        typeSet.add(typeInfo.type.name);
      });
    });
    this.pokemonTypesSubject.next(Array.from(typeSet));
  }

  /**
   * Retrieves an observable stream of unique Pokémon types.
   *
   * @returns An observable of an array of strings representing unique Pokémon types.
   */
  getPokemonTypes(): Observable<string[]> {
    return this.pokemonTypes$;
  }
}
