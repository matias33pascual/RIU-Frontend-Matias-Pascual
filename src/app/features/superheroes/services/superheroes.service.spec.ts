import { TestBed } from '@angular/core/testing';
import { Superhero } from '@superheroes/interfaces/superheroe.interface';
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
  });
});
