import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DELAY_MS } from '@constants';
import {
  DEFAULT_NAME_ALREADY_EXISTS_MESSAGE,
  DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE,
  NameAlreadyExistsException,
  SuperheroNotFoundException,
} from '@exceptions';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';

describe('MockSuperheroesService', () => {
  let service: MockSuperheroesService;
  let httpTestingController: HttpTestingController;
  const delayTime = DELAY_MS;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockSuperheroesService,
      ],
    });
    service = TestBed.inject(MockSuperheroesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create method', () => {
    it('should create a new superhero', fakeAsync(() => {
      const newSuperhero: Superhero = {
        name: 'Nightwing',
        realName: 'Dick Grayson',
        superpower: 'Acrobacias, artes marciales, liderazgo',
      };

      let result: Superhero | undefined;

      service.create(newSuperhero).subscribe((res: Superhero) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.name).toBe('Nightwing');
      expect(result?.id).toBeDefined();
    }));

    it('should throw NameAlreadyExistsException if superhero name already exists', fakeAsync(() => {
      const existingSuperhero: Superhero = {
        name: 'Superman',
        realName: 'Clark Kent',
        superpower: 'Súper fuerza, vuelo, visión de calor',
      };

      let error: any;

      service.create(existingSuperhero).subscribe({
        next: () => fail('Expected an error, but got a result'),
        error: (err: any) => {
          error = err;
        },
      });

      tick(delayTime);

      expect(error).toBeInstanceOf(NameAlreadyExistsException);
      expect(error.message).toBe(DEFAULT_NAME_ALREADY_EXISTS_MESSAGE);
    }));

    it('should be case insensitive when checking for existing names', fakeAsync(() => {
      const existingSuperhero: Superhero = {
        name: 'SUPERMAN',
        realName: 'Clark Kent',
        superpower: 'Súper fuerza, vuelo, visión de calor',
      };

      let error: any;

      service.create(existingSuperhero).subscribe({
        next: () => fail('Expected an error, but got a result'),
        error: (err: any) => {
          error = err;
        },
      });

      tick(delayTime);

      expect(error).toBeInstanceOf(NameAlreadyExistsException);
    }));
  });

  describe('update method', () => {
    it('should update an existing superhero', fakeAsync(() => {
      const superheroToUpdate: Superhero = {
        id: '1738041600000001',
        name: 'Superman Prime',
        realName: 'Clark Kent',
        superpower: 'Súper fuerza, vuelo, visión de calor y más',
      };

      let result: Superhero | undefined;

      service.update(superheroToUpdate).subscribe((res: Superhero) => {
        result = res;
      });

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      expect(result).toEqual(superheroToUpdate);
    }));

    it('should throw SuperheroNotFoundException if superhero does not exist', fakeAsync(() => {
      const superheroToUpdate: Superhero = {
        id: 'nonexistent123',
        name: 'Non Existent',
        realName: 'Non Existent',
        superpower: 'Non Existent',
      };

      let error: any;

      service.update(superheroToUpdate).subscribe({
        next: () => fail('should have failed with SuperheroNotFoundException'),
        error: (err: any) => (error = err),
      });

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      expect(error).toBeInstanceOf(SuperheroNotFoundException);
      expect(error.message).toBe(DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE);
    }));

    it('should throw NameAlreadyExistsException if new name is already taken by another superhero', fakeAsync(() => {
      const superheroToUpdate: Superhero = {
        id: '1738041600000001',
        name: 'Batman',
        realName: 'Bruce Wayne',
        superpower: 'Intelecto, artes marciales, tecnología',
      };

      let error: any;

      service.update(superheroToUpdate).subscribe({
        next: () => fail('should have failed with NameAlreadyExistsException'),
        error: (err: any) => (error = err),
      });

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      expect(error).toBeInstanceOf(NameAlreadyExistsException);
      expect(error.message).toBe(DEFAULT_NAME_ALREADY_EXISTS_MESSAGE);
    }));

    it('should not throw NameAlreadyExistsException if name is unchanged', fakeAsync(() => {
      const superheroToUpdate: Superhero = {
        id: '1738041600000001',
        name: 'Superman',
        realName: 'Clark Kent',
        superpower: 'Súper fuerza, vuelo, visión de calor',
      };

      let result: Superhero | undefined;

      service
        .update(superheroToUpdate)
        .subscribe((res: Superhero) => (result = res));

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      expect(result).toEqual(superheroToUpdate);
    }));

    it('should be case insensitive when updating superhero names', fakeAsync(() => {
      const superheroToUpdate: Superhero = {
        id: '1738041600000001',
        name: 'superman',
        realName: 'Clark Kent',
        superpower: 'Súper fuerza, vuelo, visión de calor',
      };

      let result: Superhero | undefined;

      service
        .update(superheroToUpdate)
        .subscribe((res: Superhero) => (result = res));

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      expect(result).toEqual(superheroToUpdate);
    }));
  });

  describe('delete method', () => {
    it('should delete a superhero', fakeAsync(() => {
      const idToDelete = '1738041600000001';

      let superheroes: Superhero[] = [];

      service.delete(idToDelete).subscribe();

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );

      expect(req.request.method).toBe('GET');

      req.flush({});

      tick(delayTime);

      service.getAll().subscribe((res: Superhero[]) => (superheroes = res));

      tick(delayTime);

      expect(superheroes.find((s) => s.id === idToDelete)).toBeUndefined();
      expect(superheroes.length).toBe(34);
    }));

    it('should throw SuperheroNotFoundException if superhero does not exist', fakeAsync(() => {
      const idToDelete = 'nonexistent123';

      let error: any;

      service.delete(idToDelete).subscribe({
        next: () => fail('should have failed with SuperheroNotFoundException'),
        error: (err: any) => (error = err),
      });

      const req = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );
      expect(req.request.method).toBe('GET');
      req.flush({});

      tick(delayTime);

      expect(error).toBeInstanceOf(SuperheroNotFoundException);
      expect(error.message).toBe(DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE);
    }));
  });

  describe('getAll method', () => {
    it('should return all superheroes', fakeAsync(() => {
      let result: Superhero[] | undefined;

      service.getAll().subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.length).toBe(35);
      expect(result).toContain(jasmine.objectContaining({ name: 'Superman' }));
      expect(result).toContain(jasmine.objectContaining({ name: 'Batman' }));
    }));

    it('should return the same array reference from signal', fakeAsync(() => {
      let result1: Superhero[] | undefined;
      let result2: Superhero[] | undefined;

      service.getAll().subscribe((res: Superhero[]) => {
        result1 = res;
      });

      tick(delayTime);

      service.getAll().subscribe((res: Superhero[]) => {
        result2 = res;
      });

      tick(delayTime);

      expect(result1).toBe(result2);
      expect(result1).toEqual(result2);
    }));
  });

  describe('getById method', () => {
    it('should return a superhero if found', fakeAsync(() => {
      const idToFind = '1738041600000001';
      let result: Superhero | null | undefined;

      service.getById(idToFind).subscribe((res: Superhero | null) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.id).toBe(idToFind);
      expect(result?.name).toBe('Superman');
    }));

    it('should throw SuperheroNotFoundException if superhero is not found', fakeAsync(() => {
      const idToFind = 'nonexistent123';
      let error: any;

      service.getById(idToFind).subscribe({
        next: () => fail('should have failed with SuperheroNotFoundException'),
        error: (err: any) => (error = err),
      });

      tick(delayTime);

      expect(error).toBeInstanceOf(SuperheroNotFoundException);
      expect(error.message).toBe(DEFAULT_SUPERHERO_NOT_FOUND_MESSAGE);
    }));
  });

  describe('getByName method', () => {
    it('should return superheroes matching the name', fakeAsync(() => {
      const nameToFind = 'man';
      let result: Superhero[] | undefined;

      service.getByName(nameToFind).subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.length).toBe(8);
      expect(result?.map((s) => s.name)).toContain('Superman');
      expect(result?.map((s) => s.name)).toContain('Batman');
      expect(result?.map((s) => s.name)).toContain('Wonder Woman');
    }));

    it('should return an empty array if no superhero matches the name', fakeAsync(() => {
      const nameToFind = 'zod';
      let result: Superhero[] | undefined;

      service.getByName(nameToFind).subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.length).toBe(0);
    }));

    it('should be case insensitive when searching by name', fakeAsync(() => {
      const nameToFind = 'MAN';
      let result: Superhero[] | undefined;

      service.getByName(nameToFind).subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.length).toBe(8);
    }));

    it('should find partial matches', fakeAsync(() => {
      const nameToFind = 'super';
      let result: Superhero[] | undefined;

      service.getByName(nameToFind).subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result?.length).toBe(1);
      expect(result?.[0].name).toBe('Superman');
    }));
  });

  describe('integration tests', () => {
    it('should create, update, and delete a superhero successfully', fakeAsync(() => {
      const newSuperhero: Superhero = {
        name: 'Red Hood',
        realName: 'Jason Todd',
        superpower: 'Combate, armas de fuego, táctica',
      };
      let createdSuperhero: Superhero | undefined;

      service.create(newSuperhero).subscribe((res: Superhero) => {
        createdSuperhero = res;
      });

      tick(delayTime);

      expect(createdSuperhero).toBeDefined();
      expect(createdSuperhero?.name).toBe('Red Hood');

      const updatedSuperhero: Superhero = {
        id: createdSuperhero!.id,
        name: 'Red Hood Updated',
        realName: 'Jason Todd',
        superpower: 'Combate avanzado, armas especializadas',
      };

      let updateResult: Superhero | undefined;

      service.update(updatedSuperhero).subscribe((res: Superhero) => {
        updateResult = res;
      });

      const updateReq = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );
      expect(updateReq.request.method).toBe('GET');
      updateReq.flush({});

      tick(delayTime);

      expect(updateResult?.name).toBe('Red Hood Updated');

      let deleteCompleted = false;

      service.delete(createdSuperhero!.id!).subscribe(() => {
        deleteCompleted = true;
      });

      const deleteReq = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts/1'
      );
      expect(deleteReq.request.method).toBe('GET');
      deleteReq.flush({});

      tick(delayTime);

      expect(deleteCompleted).toBe(true);

      let finalList: Superhero[] | undefined;

      service.getAll().subscribe((res: Superhero[]) => {
        finalList = res;
      });

      tick(delayTime);

      expect(
        finalList?.find((s) => s.id === createdSuperhero!.id)
      ).toBeUndefined();
    }));
  });

  describe('basic service functionality', () => {
    it('should handle observable responses correctly', fakeAsync(() => {
      let result: Superhero[] | undefined;

      service.getAll().subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result!.length).toBeGreaterThan(0);
    }));

    it('should filter superheroes correctly', fakeAsync(() => {
      let result: Superhero[] | undefined;

      service.getAll().subscribe((res: Superhero[]) => {
        result = res;
      });

      tick(delayTime);

      expect(result).toBeDefined();
      expect(result!.length).toBeGreaterThan(0);

      expect(result!.some((hero) => hero.name.includes('Superman'))).toBe(true);
    }));
  });
});
