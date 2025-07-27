import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuperheroSearchComponent } from '@superheroes/components/superhero-search/superhero-search.component';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';

@Component({
  selector: 'app-superheroes-page',
  imports: [SuperheroesListComponent, SuperheroSearchComponent],
  templateUrl: './superheroes-page.component.html',
  styleUrl: './superheroes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesPageComponent {
  private readonly _superheroesService: SuperheroesRepository = inject(
    MockSuperheroesService
  );

  private readonly _allSuperheroes = toSignal(
    this._superheroesService.getAll(),
    {
      initialValue: [],
    }
  );

  private readonly _searchResults = signal<Superhero[]>([]);
  private readonly _isSearching = signal<boolean>(false);

  readonly superheroesList = computed(() =>
    this._isSearching() ? this._searchResults() : this._allSuperheroes()
  );

  readonly searchTerm = signal('');

  searchByName(name: string) {
    if (name.trim() === '') {
      // Si el término está vacío, mostrar todos los superhéroes
      this._isSearching.set(false);
      this._searchResults.set([]);
    } else {
      // Buscar por nombre
      this._isSearching.set(true);
      this._superheroesService.getByName(name).subscribe({
        next: (results) => {
          this._searchResults.set(results);
        },
        error: (error) => {
          console.error('Error searching superheroes:', error);
          this._searchResults.set([]);
        },
      });
    }
  }

  clearSearch() {
    this._isSearching.set(false);
    this._searchResults.set([]);
    this.searchTerm.set('');
  }

  addSuperhero() {
    throw new Error('Method not implemented.');
  }

  editSuperhero($event: Superhero) {
    throw new Error('Method not implemented.');
  }

  deleteSuperhero($event: Superhero) {
    if (confirm(`Are you sure you want to delete ${$event.name}?`)) {
      this._superheroesService.delete($event.id!).subscribe({
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }
}
