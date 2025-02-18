import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Pokemon } from '../interface/pokemon';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterSubject = new BehaviorSubject<string[]>([]);
  filter$ = this.filterSubject.asObservable();

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
}
