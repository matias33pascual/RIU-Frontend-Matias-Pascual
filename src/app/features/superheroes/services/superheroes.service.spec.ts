import { TestBed } from '@angular/core/testing';
import {
  DEFAULT_NAME_ALREADY_EXISTS_MESSAGE,
  NameAlreadyExistsException,
} from '@exceptions';

import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';

describe('MockSuperheroesService', () => {
  let service: MockSuperheroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockSuperheroesService);
  });

  it('service should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create method', () => {
    it('should create a new superhero', (done) => {
      const newSuperhero: Superhero = {
        name: 'Aquaman',
      };

      service.create(newSuperhero).subscribe((result) => {
        expect(result).toBeDefined();
        expect(result.name).toBe('Aquaman');
        expect(result.id).toBeDefined();
        done();
      });
    });

    it('should throw NameAlreadyExistsException if superhero name already exists', (done) => {
      const existingSuperhero: Superhero = {
        name: 'Superman',
      };

      service.create(existingSuperhero).subscribe({
        next: () => fail('Expected an error, but got a result'),
        error: (error) => {
          expect(error).toBeInstanceOf(NameAlreadyExistsException);
          expect(error.message).toBe(DEFAULT_NAME_ALREADY_EXISTS_MESSAGE);
          done();
        },
      });
    });
  });
});
