import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { SuperheroFormComponent } from '@superheroes/components/superhero-form/superhero-form.component';
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

  constructor(private dialog: MatDialog) {}

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
    if (confirm(`Are you sure you want to delete ${$event.name}?`)) {
      this._superheroesService.delete($event.id!).subscribe({
        error: (err) => {
          alert(err.message);
        },
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
        this._isSearching.set(false);
        this._searchResults.set([]);
        this.searchTerm.set('');
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }
}
