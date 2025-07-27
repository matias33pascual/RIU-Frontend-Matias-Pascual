import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuperheroFormComponent } from '@superheroes/components/superhero-form/superhero-form.component';
import { SuperheroSearchComponent } from '@superheroes/components/superhero-search/superhero-search.component';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';

@Component({
  selector: 'app-superheroes-page',
  imports: [
    SuperheroesListComponent,
    SuperheroSearchComponent,
    SuperheroFormComponent,
  ],
  templateUrl: './superheroes-page.component.html',
  styleUrl: './superheroes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesPageComponent {
  selectedSuperhero = signal<Superhero | null>(null);

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
      this._isSearching.set(false);
      this._searchResults.set([]);
    } else {
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

  addSuperhero() {}

  saveOrUpdateSuperhero($event: Superhero) {
    if ($event.id !== null) {
      this._editSuperhero($event);
    } else {
      this._createNewSuperhero($event);
    }
  }

  private _createNewSuperhero(superhero: Superhero) {
    this._superheroesService.create(superhero).subscribe({
      next: () => {
        this.selectedSuperhero.set(null);
        this.searchTerm.set('');
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }

  private _editSuperhero(superhero: Superhero) {
    this._superheroesService.update(superhero).subscribe({
      next: () => {
        this._isSearching.set(false);
        this._searchResults.set([]);
        this.searchTerm.set('');
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }

  editSuperhero($event: Superhero) {
    this.selectedSuperhero.set($event);
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
