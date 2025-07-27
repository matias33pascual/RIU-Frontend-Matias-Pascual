import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DELAY_MS } from '@constants';
import {
  NameAlreadyExistsException,
  SuperheroNotFoundException,
} from '@exceptions';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { asyncScheduler, delay, scheduled, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MockSuperheroesService implements SuperheroesRepository {
  private readonly _delay = DELAY_MS;

  private _superheroes: WritableSignal<Superhero[]> = signal<Superhero[]>([
    { id: 'a', name: 'Superman' },
    { id: 'b', name: 'Batman' },
    { id: 'c', name: 'Wonder Woman' },
    { id: 'd', name: 'Flash' },
    { id: 'e', name: 'Green Lantern' },
  ]);

  create(superhero: Superhero): Observable<Superhero> {
    if (this._isNameAlreadyUsed(superhero.name)) {
      return scheduled([undefined], asyncScheduler).pipe(
        delay(this._delay),
        switchMap(() => throwError(() => new NameAlreadyExistsException()))
      );
    }

    const newSuperheroe: Superhero = {
      ...superhero,
      id: Date.now().toString(),
    };

    this._superheroes.update((data) => [...data, newSuperheroe]);
    return scheduled([newSuperheroe], asyncScheduler).pipe(delay(this._delay));
  }

  update(superhero: Superhero): Observable<Superhero> {
    const existingSuperhero = this._findSuperheroById(superhero.id!);

    if (!existingSuperhero) {
      return scheduled([null], asyncScheduler).pipe(
        delay(this._delay),
        switchMap(() => throwError(() => new SuperheroNotFoundException()))
      );
    }

    const nameHasChanged =
      existingSuperhero.name.trim().toLowerCase() !==
      superhero.name.trim().toLowerCase();

    const nameAlreadyExists = this._isNameAlreadyUsed(superhero.name);

    if (nameHasChanged && nameAlreadyExists) {
      return scheduled([null], asyncScheduler).pipe(
        delay(this._delay),
        switchMap(() => throwError(() => new NameAlreadyExistsException()))
      );
    }

    this._superheroes.update((list) =>
      list.map((superheroItem) =>
        superheroItem.id === superhero.id ? superhero : superheroItem
      )
    );

    return scheduled([superhero], asyncScheduler).pipe(delay(this._delay));
  }

  delete(id: string): Observable<void> {
    const existingSuperhero = this._findSuperheroById(id);

    if (!existingSuperhero) {
      return scheduled([null], asyncScheduler).pipe(
        delay(this._delay),
        switchMap(() => throwError(() => new SuperheroNotFoundException()))
      );
    }

    this._superheroes.update((list) =>
      list.filter((superheroItem) => superheroItem.id !== id)
    );

    return scheduled([undefined], asyncScheduler).pipe(delay(this._delay));
  }

  getAll(): Observable<Superhero[]> {
    return toObservable(computed(() => this._superheroes())).pipe(
      delay(this._delay)
    );
  }

  getById(id: string): Observable<Superhero | null> {
    const existingSuperhero = this._findSuperheroById(id);

    if (!existingSuperhero) {
      return scheduled([null], asyncScheduler).pipe(
        delay(this._delay),
        switchMap(() => throwError(() => new SuperheroNotFoundException()))
      );
    }

    return scheduled([existingSuperhero], asyncScheduler).pipe(
      delay(this._delay)
    );
  }

  getByName(name: string): Observable<Superhero[]> {
    const superheroes = this._findSuperheroesByName(name);
    return scheduled([superheroes], asyncScheduler).pipe(delay(this._delay));
  }

  private _findSuperheroById(id: string): Superhero | undefined {
    return this._superheroes().find((s) => s.id === id);
  }

  private _findSuperheroesByName(name: string): Superhero[] {
    return this._superheroes().filter((s) =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  private _isNameAlreadyUsed(name: string): boolean {
    return this._superheroes().some(
      (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  }
}
