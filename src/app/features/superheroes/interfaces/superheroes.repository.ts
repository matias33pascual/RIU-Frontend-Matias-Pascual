import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { Observable } from 'rxjs';

export interface SuperheroesRepository {
  create(superhero: Superhero): Observable<Superhero>;
  update(superhero: Superhero): Observable<Superhero>;
  delete(id: string): Observable<void>;
  getAll(): Observable<Superhero[]>;
  getById(id: string): Observable<Superhero | null>;
  getByName(name: string): Observable<Superhero[]>;
}
