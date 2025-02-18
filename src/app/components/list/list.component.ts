import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { PaginatorModule } from 'primeng/paginator';

import { SimpleCardComponent } from '../simple-card/simple-card.component';

import { Pokemon } from '../../interface/pokemon';

import { PokemonService } from '../../services/pokemon.service';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, PaginatorModule, SimpleCardComponent, RouterModule],
})
export class ListComponent implements OnInit {
  pokemonPage: Pokemon[] = [];
  filteredPokemons: Pokemon[] = [];
  allPokemons: Pokemon[] = [];
  totalPokemons = 0;
  pageSize = 20;
  currentPage = 0;

  constructor(
    private router: Router,
    private pokemonService: PokemonService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.loadPokemons();

    this.filterService.getFilter().subscribe((selectedTypes) => {
      this.applyFilter(selectedTypes);
    });
  }

  /**
   * Fetches the list of pokemons from the API and populates the necessary data structures.
   *
   * @returns {void} - This function does not return any value.
   */
  loadPokemons() {
    this.pokemonService.getPokemonList(1000, 0).subscribe({
      next: (data) => {
        this.totalPokemons = data.count;
        const requests = data.results.map((pokemonListResult) =>
          this.pokemonService.getPokemon(pokemonListResult.name)
        );

        forkJoin(requests).subscribe((pokemons: Pokemon[]) => {
          this.allPokemons = pokemons;
          this.applyFilter(this.filterService.getCurrentFilter());
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Applies a filter to the list of pokemons based on the selected types.
   * If no types are selected, all pokemons are displayed.
   * Otherwise, only the pokemons with at least one type matching the selected types are displayed.
   *
   * @param {string[]} selectedTypes - The array of selected types.
   * @returns {void} - This function does not return any value.
   */
  applyFilter(selectedTypes: string[]) {
    if (selectedTypes.length === 0) {
      this.filteredPokemons = this.allPokemons;
    } else {
      this.filteredPokemons = this.allPokemons.filter((pokemon) =>
        selectedTypes.every((type) =>
          pokemon.types.some(
            (pokemonType) =>
              pokemonType.type.name.toLowerCase() === type.toLowerCase()
          )
        )
      );
    }

    this.currentPage = 0;
    this.updatePagination();
  }

  /**
   * Updates the pagination based on the current page and page size.
   * Calculates the offset and slices the filtered pokemons array to get the current page's pokemons.
   *
   * @returns {void} - This function does not return any value.
   */
  updatePagination() {
    this.totalPokemons = this.filteredPokemons.length;

    const offset = this.currentPage * this.pageSize;

    /**
     * Slices the filtered pokemons array to get the current page's pokemons.
     *
     * @type {Pokemon[]} - The current page's pokemons.
     */
    this.pokemonPage = this.filteredPokemons.slice(
      offset,
      offset + this.pageSize
    );
  }

  /**
   * Handles the pagination change event triggered by the user.
   * Updates the current page and triggers the pagination update.
   *
   * @param {any} event - The pagination event object.
   * @param {number} event.page - The new page index.
   * @returns {void} - This function does not return any value.
   */
  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updatePagination();
  }

  /**
   * Handles the selection of a pokemon by navigating to the corresponding pokemon detail page.
   *
   * @param {Pokemon} pokemon - The selected pokemon object.
   * @returns {void} - This function does not return any value.
   */
  selectPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
