import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';

@Component({
  selector: 'app-superheroes-page',
  imports: [SuperheroesListComponent],
  templateUrl: './superheroes-page.component.html',
  styleUrl: './superheroes-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperheroesPageComponent {
  private readonly _superheroesService: SuperheroesRepository = inject(
    MockSuperheroesService
  );

  readonly superheroesList = toSignal(this._superheroesService.getAll(), {
    initialValue: [],
  });

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
