import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { InputGroup } from 'primeng/inputgroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { PokemonService } from '../../services/pokemon.service';
import { PokemonStateService } from '../../services/pokemon-state.service';
import { AppStateService } from '../../services/app-state.service';
import { FilterService } from '../../services/filter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [
    CommonModule,
    InputGroup,
    FloatLabelModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
  ],
})
export class SearchComponent implements OnInit {
  @Output() searchCompleted = new EventEmitter<void>();

  private pokemonSubscription!: Subscription;

  pokemonName: string = '';

  constructor(
    private pokemonService: PokemonService,
    private pokemonStateService: PokemonStateService,
    private appStateService: AppStateService,
    private filterService: FilterService,
    private router: Router
  ) {}

  ngOnInit() {}

  /**
   * Performs a search for a Pokémon by name and updates the application state accordingly.
   * If the Pokémon is found, it sets the Pokémon data, clears the error message, shows the details,
   * navigates to the Pokémon details page, emits a search completed event, and clears the search input.
   * If the Pokémon is not found, it sets the Pokémon data to null, sets an error message, and clears the search input.
   */
  searchPokemon() {
    if (!this.pokemonName.trim()) return;

    this.filterService.setSearchTerm(this.pokemonName);

    this.pokemonSubscription = this.pokemonService
      .getPokemon(this.pokemonName)
      .subscribe({
        next: (data) => {
          this.pokemonStateService.setPokemonData(data);
          this.appStateService.setErrorMessage('');
          this.appStateService.showList();
          this.searchCompleted.emit();
          this.router.navigate(['']);
          this.pokemonName = '';
        },
        error: () => {
          this.pokemonStateService.setPokemonData(null);
          this.appStateService.setErrorMessage('Pokémon not found');
          this.searchCompleted.emit();
          this.router.navigate(['']);
          this.pokemonName = '';
        },
      });
  }

  ngOnDestroy(): void {
    if (this.pokemonSubscription) {
      this.pokemonSubscription.unsubscribe();
    }
  }
}
