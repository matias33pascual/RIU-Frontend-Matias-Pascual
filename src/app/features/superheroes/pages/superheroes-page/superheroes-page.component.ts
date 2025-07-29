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
import { SweetAlertService } from '@core/services/sweet-alert.service';
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
  private readonly _sweetAlert = inject(SweetAlertService);

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
        this._sweetAlert.error(
          'Error al cargar superhéroes',
          'No se pudieron cargar los superhéroes.'
        );
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
    this._sweetAlert.confirmDelete($event.name).then((result) => {
      if (result.isConfirmed) {
        this._superheroesService.delete($event.id!).subscribe({
          next: () => {
            this._refreshAllLists();
            this._sweetAlert.success(`${$event.name} ya no está en la lista`);
          },
          error: (err) =>
            this._sweetAlert.error('Error al eliminar', err.message),
        });
      }
    });
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
      next: (createdSuperhero: Superhero) => {
        this._refreshAllLists();
        this._sweetAlert.success(`¡${createdSuperhero.name} ha sido creado!`);
      },
      error: (err) => {
        this._sweetAlert.error('Error al crear superhéroe', err.message);
      },
    });
  }

  private _editSuperhero(superhero: Superhero) {
    this._superheroesService.update(superhero).subscribe({
      next: (updatedSuperhero: Superhero) => {
        this._refreshAllLists();
        this._sweetAlert.success(
          `¡${updatedSuperhero.name} ha sido actualizado!`
        );
      },
      error: (err) => {
        this._sweetAlert.error('Error al actualizar superhéroe', err.message);
      },
    });
  }

  private _refreshAllLists(): void {
    this._refreshMainList();

    if (this._isSearching()) {
      this._refreshSearchResults();
    }
  }

  private _refreshMainList(): void {
    this._superheroesService.getAll().subscribe({
      next: (allSuperheroes) => {
        this._allSuperheroes.set(allSuperheroes);
      },
      error: (err) => {
        this._sweetAlert.error(
          'Error al cargar superhéroes',
          'No se pudieron cargar los superhéroes.'
        );
      },
    });
  }

  private _refreshSearchResults(): void {
    this._superheroesService.getByName(this.searchTerm()).subscribe({
      next: (results) => {
        this._searchResults.set(results);
      },
      error: (err) => {
        this._searchResults.set([]);
        this._sweetAlert.error(
          'Error en la búsqueda',
          'No se pudieron obtener los resultados.'
        );
      },
    });
  }
}
