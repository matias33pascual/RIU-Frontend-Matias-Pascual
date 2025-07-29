import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './superheroes-page.component.html',
  styleUrl: './superheroes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesPageComponent {
  private readonly _superheroesService: SuperheroesRepository = inject(
    MockSuperheroesService
  );

  private readonly _allSuperheroes = signal<Superhero[]>([]);
  private readonly _searchResults = signal<Superhero[]>([]);
  private readonly _isSearching = signal<boolean>(false);

  readonly searchTerm = signal('');
  readonly superheroesList = signal<Superhero[]>([]);

  private readonly _syncSuperheroesListEffect = effect(() => {
    const isSearching = this._isSearching();

    this.superheroesList.set(
      isSearching ? this._searchResults() : this._allSuperheroes()
    );
  });

  constructor(private dialog: MatDialog) {
    this._superheroesService.getAll().subscribe({
      next: (results) => {
        this._allSuperheroes.set(results);
      },
      error: (error) => {
        console.error('Error fetching superheroes:', error);
      },
    });
  }

  searchByName(name: string) {
    this.searchTerm.set(name.trim());

    if (this.searchTerm() === '') {
      this._isSearching.set(false);
      this._searchResults.set([]);
    } else {
      this._isSearching.set(true);

      this._superheroesService.getByName(name).subscribe({
        next: (results) => {
          this._searchResults.set(results);
        },
        error: (error) => {
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
    this._openSuperheroForm(null);
  }

  editSuperhero($event: Superhero) {
    this._openSuperheroForm($event);
  }

  saveOrUpdateSuperhero($event: Superhero) {
    if ($event.id) {
      this._editSuperhero($event);
    } else {
      this._createNewSuperhero($event);
    }
  }

  deleteSuperhero($event: Superhero) {
    if (confirm(`¿Seguro que querés borrar a ${$event.name}?`)) {
      this._superheroesService.delete($event.id!).subscribe({
        next: () => {
          this._searchResults.update((list) =>
            list.filter((item) => item.id !== $event.id)
          );
          this._allSuperheroes.update((list) =>
            list.filter((item) => item.id !== $event.id)
          );
        },
        error: (err) => alert(err.message),
      });
    }
  }

  private _openSuperheroForm(superhero: Superhero | null = null) {
    const dialogRef = this.dialog.open(SuperheroFormComponent, {
      data: { superheroForUpdate: superhero },
      width: '600px',
      disableClose: true,
    });

    const saveSub = dialogRef.componentInstance.saveOrUpdateSuperhero.subscribe(
      (result: Superhero) => {
        this.saveOrUpdateSuperhero(result);
        dialogRef.close();
      }
    );

    const cancelSub = dialogRef.componentInstance.cancel.subscribe(() => {
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(() => {
      saveSub.unsubscribe();
      cancelSub.unsubscribe();
    });
  }

  private _createNewSuperhero(superhero: Superhero) {
    this._superheroesService.create(superhero).subscribe({
      next: () => {
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
        if (this._isSearching()) {
          this._searchResults.update((list) =>
            list.map((item) => (item.id === superhero.id ? superhero : item))
          );
        } else {
          this._allSuperheroes.update((list) =>
            list.map((item) => (item.id === superhero.id ? superhero : item))
          );
        }
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }
}
