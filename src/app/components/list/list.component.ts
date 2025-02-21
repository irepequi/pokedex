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
      this.applyFilter(
        selectedTypes,
        this.filterService.getCurrentSearchTerm()
      );
    });

    this.filterService.getSearchTerm().subscribe((searchTerm) => {
      this.applyFilter(this.filterService.getCurrentFilter(), searchTerm);
    });
  }

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
          this.applyFilter(
            this.filterService.getCurrentFilter(),

            this.filterService.getCurrentSearchTerm()
          );
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  /**
   * Applies filters to the list of Pokémon based on selected types and search term.
   * Updates the filtered Pokémon list, resets the current page, and triggers pagination update.
   *
   * @param selectedTypes - An array of selected Pokémon types to filter by.
   * @param searchTerm - A search term to filter Pokémon names by.
   * @returns {void}
   */
  applyFilter(selectedTypes: string[], searchTerm: string): void {
    this.filteredPokemons = this.filterService.filterPokemons(
      this.allPokemons,
      selectedTypes,
      searchTerm
    );

    this.currentPage = 0;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPokemons = this.filteredPokemons.length;

    const offset = this.currentPage * this.pageSize;

    this.pokemonPage = this.filteredPokemons.slice(
      offset,
      offset + this.pageSize
    );
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.updatePagination();
  }

  selectPokemon(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.id]);
  }
}
