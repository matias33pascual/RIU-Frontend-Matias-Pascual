import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import {
  NameAlreadyExistsException,
  SuperheroNotFoundException,
} from '@exceptions';
import { INITIAL_SUPERHEROES } from '@superheroes/data/superheroes.data';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesRepository } from '@superheroes/interfaces/superheroes.repository';
import { asyncScheduler, scheduled, switchMap, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MockSuperheroesService implements SuperheroesRepository {
  private readonly http = inject(HttpClient);

  private _superheroes: WritableSignal<Superhero[]> = signal<Superhero[]>([
    ...INITIAL_SUPERHEROES,
  ]);

  create(superhero: Superhero): Observable<Superhero> {
    if (this._isNameAlreadyUsed(superhero.name)) {
      return scheduled([undefined], asyncScheduler).pipe(
        switchMap(() => throwError(() => new NameAlreadyExistsException()))
      );
    }

    const newSuperheroe: Superhero = {
      ...superhero,
      id: this._generateId(),
    };

    this._superheroes.update((data) => [...data, newSuperheroe]);
    return scheduled([newSuperheroe], asyncScheduler);
  }

  update(superhero: Superhero): Observable<Superhero> {
    return this._fakeHttpRequest().pipe(
      switchMap(() => {
        const existingSuperhero = this._findSuperheroById(superhero.id!);

        if (!existingSuperhero) {
          return scheduled([null], asyncScheduler).pipe(
            switchMap(() => throwError(() => new SuperheroNotFoundException()))
          );
        }

        const nameHasChanged =
          existingSuperhero.name.trim().toLowerCase() !==
          superhero.name.trim().toLowerCase();

        const nameAlreadyExists = this._isNameAlreadyUsed(superhero.name);

        if (nameHasChanged && nameAlreadyExists) {
          return scheduled([null], asyncScheduler).pipe(
            switchMap(() => throwError(() => new NameAlreadyExistsException()))
          );
        }

        this._superheroes.update((list) =>
          list.map((superheroItem) =>
            superheroItem.id === superhero.id ? superhero : superheroItem
          )
        );

        return scheduled([superhero], asyncScheduler);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this._fakeHttpRequest().pipe(
      switchMap(() => {
        const existingSuperhero = this._findSuperheroById(id);

        if (!existingSuperhero) {
          return scheduled([null], asyncScheduler).pipe(
            switchMap(() => throwError(() => new SuperheroNotFoundException()))
          );
        }

        this._superheroes.update((list) =>
          list.filter((superheroItem) => superheroItem.id !== id)
        );

        return scheduled([undefined], asyncScheduler);
      })
    );
  }

  getAll(): Observable<Superhero[]> {
    return scheduled([this._superheroes()], asyncScheduler);
  }

  getById(id: string): Observable<Superhero | null> {
    const existingSuperhero = this._findSuperheroById(id);

    if (!existingSuperhero) {
      return scheduled([null], asyncScheduler).pipe(
        switchMap(() => throwError(() => new SuperheroNotFoundException()))
      );
    }

    return scheduled([existingSuperhero], asyncScheduler);
  }

  getByName(name: string): Observable<Superhero[]> {
    const superheroes = this._findSuperheroesByName(name);
    return scheduled([superheroes], asyncScheduler);
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

  private _generateId(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 999999) + 1;
    return `${timestamp}${randomSuffix.toString().padStart(6, '0')}`;
  }

  private _fakeHttpRequest(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/posts/1');
  }
}
