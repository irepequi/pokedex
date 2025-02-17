import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';
import { Router, RouterModule } from '@angular/router';

import { PokemonService } from '../../services/pokemon.service';
import { SimpleCardComponent } from '../simple-card/simple-card.component';
import { Pokemon } from '../../interface/pokemon';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, PaginatorModule, SimpleCardComponent, RouterModule],
})
export class ListComponent implements OnInit {
  pokemonPage: Pokemon[] = [];
  totalPokemons = 0;
  pageSize = 20;
  currentPage = 0;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  /**
   * Loads the list of pokemons from the API based on the current page and page size.
   * Fetches the pokemon details for each pokemon in the list using the `getPokemon` method from the `PokemonService`.
   * Updates the `pokemonPage` and `totalPokemons` properties accordingly.
   *
   * @returns {void}
   */
  loadPokemons() {
    const offset = this.currentPage * this.pageSize;

    this.pokemonService.getPokemonList(this.pageSize, offset).subscribe({
      next: (data) => {
        this.totalPokemons = data.count;
        this.pokemonPage = [];

        const requests = data.results.map((pokemonListResult) =>
          this.pokemonService.getPokemon(pokemonListResult.name)
        );

        forkJoin(requests).subscribe((pokemons: Pokemon[]) => {
          this.pokemonPage = pokemons;
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Handles the pagination change event by updating the current page and loading the corresponding pokemon data.
   *
   * @param event - The pagination event object containing the new page number.
   * @returns {void}
   */
  onPageChange(event: any) {
    this.currentPage = event.page;
    this.loadPokemons();
  }

  /**
   * Handles the selection of a pokemon by navigating to the corresponding pokemon detail page.
   *
   * @param pokemon - The selected pokemon object.
   * @returns {void}
   */
  selectPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
