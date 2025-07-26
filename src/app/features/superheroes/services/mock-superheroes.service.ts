import { Injectable, signal, WritableSignal } from '@angular/core';
import { Superhero } from '@superheroes/interfaces/superheroe.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { asyncScheduler, of, scheduled } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MockSuperheroesService {
  private _data: WritableSignal<Superhero[]> = signal<Superhero[]>([
    { id: 'a', name: 'Superman' },
    { id: 'b', name: 'Batman' },
    { id: 'c', name: 'Wonder Woman' },
    { id: 'd', name: 'Flash' },
    { id: 'e', name: 'Green Lantern' },
  ]);

  create(superhero: Superhero): Observable<Superhero> {
    const newSuperheroe: Superhero = {
      ...superhero,
      id: Date.now().toString(),
    };

    this._data.update((data) => [...data, newSuperheroe]);

    return scheduled([newSuperheroe], asyncScheduler);
  }
}
