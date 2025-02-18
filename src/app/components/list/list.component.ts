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
          this.filterService.extractPokemonTypes(pokemons);
          this.applyFilter(this.filterService.getCurrentFilter());
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Applies the selected types filter to the list of all pokemons.
   * Resets the current page to 0 and updates the displayed pokemon list.
   *
   * @param selectedTypes - An array of strings representing the selected pokemon types.
   */
  applyFilter(selectedTypes: string[]): void {
    this.filteredPokemons = this.filterService.filterPokemons(
      this.allPokemons,
      selectedTypes
    );

    this.currentPage = 0;
    this.updatePagination();
  }

  /**
   * Updates the displayed pokemon list based on the current page and page size.
   * Calculates the offset for the slice operation and updates the `pokemonPage` array.
   * Also updates the `totalPokemons` property with the length of the `filteredPokemons` array.
   */
  updatePagination() {
    this.totalPokemons = this.filteredPokemons.length;

    const offset = this.currentPage * this.pageSize;

    this.pokemonPage = this.filteredPokemons.slice(
      offset,
      offset + this.pageSize
    );
  }

  /**
   * Handles the pagination change event triggered by the user interacting with the pagination component.
   * Updates the current page and triggers the update of the displayed pokemon list.
   *
   * @param event - The pagination event object containing the new page number.
   */
  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updatePagination();
  }

  /**
   * Handles the selection of a pokemon by navigating to the corresponding pokemon detail page.
   *
   * @param pokemon - The selected pokemon object.
   */
  selectPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
