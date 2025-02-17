import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pokemon } from '../interface/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonStateService {
  private pokemonSubject = new BehaviorSubject<Pokemon | null>(null);

  /**
   * Retrieves the current Pokemon data as an Observable.
   *
   * @returns An Observable of type `Pokemon | null`. The Observable emits the current Pokemon data whenever it changes. If no Pokemon data is available, it emits `null`.
   */
  getPokemonData(): Observable<Pokemon | null> {
    return this.pokemonSubject.asObservable();
  }

  /**
   * Sets the current Pokemon data.
   *
   * This function updates the internal state of the service with the provided Pokemon data.
   * It emits the updated data through the Observable returned by `getPokemonData()`.
   *
   * @param pokemon - The new Pokemon data to set. If `null`, it indicates that no Pokemon data is available.
   *
   * @returns {void}
   */
  setPokemonData(pokemon: Pokemon | null) {
    this.pokemonSubject.next(pokemon);
  }
}
