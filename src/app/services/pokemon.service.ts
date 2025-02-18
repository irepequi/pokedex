import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Pokemon, PokemonList } from '../interface/pokemon';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private typesUrl = 'https://pokeapi.co/api/v2/type';

  totalPokemons = 0;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves a paginated list of Pokémon from the PokéAPI.
   *
   * @param limit - The maximum number of Pokémon to retrieve per page. Default is 20.
   * @param offset - The number of Pokémon to skip before starting to retrieve. Default is 0.
   *
   * @returns An Observable of type `PokemonList` containing the retrieved Pokémon data.
   */
  getPokemonList(
    limit: number = 20,
    offset: number = 0
  ): Observable<PokemonList> {
    return this.http.get<PokemonList>(
      `${this.apiUrl}?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Retrieves detailed information about a specific Pokémon from the PokéAPI.
   *
   * @param pokemonName - The name of the Pokémon to retrieve. The name should be in lowercase.
   *
   * @returns An Observable of type `Pokemon` containing the detailed Pokémon data.
   */
  getPokemon(pokemonName: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(
      `${this.apiUrl}/${pokemonName.toLowerCase()}`
    );
  }

  /**
   * Retrieves a list of Pokémon types from the PokéAPI.
   *
   * @returns An Observable of type `string[]` containing the names of the Pokémon types.
   */
  getPokemonTypes(): Observable<string[]> {
    return this.http.get<any>(this.typesUrl).pipe(
      map((response) => {
        if (!response.results) return [];
        return response.results.map((type: any) => type.name);
      })
    );
  }

  // loadPokemons() {
  //   this.getPokemonList(1000, 0).subscribe({
  //     next: (data) => {
  //       this.totalPokemons = data.count;
  //       const requests = data.results.map((pokemonListResult) =>
  //         this.getPokemon(pokemonListResult.name)
  //       );

  //       forkJoin(requests).subscribe((pokemons: Pokemon[]) => {
  //         this.allPokemons = pokemons;
  //         this.filterService.extractPokemonTypes(pokemons);
  //         this.applyFilter(
  //           this.filterService.getCurrentFilter(),
  //           this.filterService.getCurrentSearchTerm()
  //         );
  //       });
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
}
