import { Superhero } from '@superheroes/interfaces/superheroe.interface';
import { Observable } from 'rxjs';

export interface SuperheroesRepository {
  create(superhero: Superhero): Observable<Superhero>;
  update(superhero: Superhero): Observable<Superhero>;
  delete(id: number): Observable<void>;
  getAll(): Observable<Superhero[]>;
  getById(id: number): Observable<Superhero | null>;
  getByName(name: string): Observable<Superhero[]>;
}
