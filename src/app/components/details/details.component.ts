import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';

import { typeColors } from '../../styles/type-colors';

import { Pokemon } from '../../interface/pokemon';

import { PokemonService } from '../../services/pokemon.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ChipModule,
  ],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private routeSubscription!: Subscription;
  private errorSubscription!: Subscription;
  private evolutionSubscription!: Subscription;

  pokemonData: Pokemon | null = null;
  evolutionData: any[] = [];
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private appStateService: AppStateService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.loadPokemonDetails(id);
    });

    this.errorSubscription = this.appStateService
      .getErrorMessage()
      .subscribe((message) => {
        this.errorMessage = message;
      });

    this.appStateService.showDetails();
  }

  /**
   * Retrieves the details of a Pokémon by its ID and updates the component's state.
   *
   * @param id - The unique identifier of the Pokémon.
   *
   * @returns {void}
   */
  loadPokemonDetails(id: number) {
    this.pokemonService.getPokemon(id.toString()).subscribe({
      next: (data) => {
        this.pokemonData = data;
      },
      error: () => {
        this.pokemonData = null;
        this.appStateService.setErrorMessage('Pokémon no encontrado');
      },
    });
  }

  /**
   * Retrieves the Pokémon types and their corresponding colors.
   *
   * @returns An array of objects, each containing the name of a Pokémon type and its associated background and text colors.
   */
  getPokemonTypes() {
    return (
      this.pokemonData?.types.map((type) => {
        const colors = typeColors[type.type.name] || {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          textColor: 'black',
        };
        return {
          name: type.type.name,
          backgroundColor: colors.backgroundColor,
          textColor: colors.textColor,
        };
      }) || []
    );
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.evolutionSubscription) {
      this.evolutionSubscription.unsubscribe();
    }
  }
}
