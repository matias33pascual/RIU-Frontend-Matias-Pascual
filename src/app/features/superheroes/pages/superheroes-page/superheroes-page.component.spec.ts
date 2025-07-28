import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { SuperheroSearchComponent } from '@superheroes/components/superhero-search/superhero-search.component';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';
import { asyncScheduler, scheduled, throwError } from 'rxjs';
import { SuperheroesPageComponent } from './superheroes-page.component';

const MOCK_HEROES: Superhero[] = [
  {
    id: '1',
    name: 'Superman',
    realName: 'Clark Kent',
    superpower: 'Súper fuerza',
  },
  { id: '2', name: 'Batman', realName: 'Bruce Wayne', superpower: 'Intelecto' },
];

describe('SuperheroesPageComponent', () => {
  let component: SuperheroesPageComponent;
  let fixture: ComponentFixture<SuperheroesPageComponent>;
  let service: jasmine.SpyObj<MockSuperheroesService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MockSuperheroesService', [
      'getAll',
      'getByName',
      'delete',
      'create',
      'update',
    ]);

    serviceSpy.getAll.and.returnValue(scheduled([MOCK_HEROES], asyncScheduler));
    serviceSpy.getByName.and.callFake((name: string) => {
      const filtered = MOCK_HEROES.filter((h) =>
        h.name.toLowerCase().includes(name.toLowerCase())
      );
      return scheduled([filtered], asyncScheduler);
    });

    serviceSpy.delete.and.returnValue(scheduled([undefined], asyncScheduler));
    serviceSpy.create.and.returnValue(
      scheduled([{ ...MOCK_HEROES[0], id: '3' }], asyncScheduler)
    );
    serviceSpy.update.and.returnValue(
      scheduled([{ ...MOCK_HEROES[0] }], asyncScheduler)
    );

    await TestBed.configureTestingModule({
      imports: [SuperheroesPageComponent],
      providers: [
        { provide: MockSuperheroesService, useValue: serviceSpy },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroesPageComponent);

    component = fixture.componentInstance;

    service = TestBed.inject(
      MockSuperheroesService
    ) as jasmine.SpyObj<MockSuperheroesService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the search and list components', async () => {
    const search = fixture.debugElement.query(
      By.directive(SuperheroSearchComponent)
    );

    expect(search).toBeTruthy();

    fixture.detectChanges();
    await fixture.whenStable();

    const list = fixture.debugElement.query(
      By.directive(SuperheroesListComponent)
    );

    expect(list).toBeTruthy();
  });

  it('should filter the list when searching', () => {
    const filteredHeroes = [MOCK_HEROES[1]];

    service.getByName.and.returnValue(
      scheduled([filteredHeroes], asyncScheduler)
    );

    component.searchByName('bat');

    expect(service.getByName).toHaveBeenCalledWith('bat');
  });

  it('should call delete service when deleting a superhero', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteSuperhero(MOCK_HEROES[0]);

    expect(service.delete).toHaveBeenCalledWith('1');
  });

  it('should handle error in create operation', () => {
    spyOn(window, 'alert');
    const newSuperhero = { ...MOCK_HEROES[0], id: undefined };

    service.create.and.returnValue(
      throwError(() => new Error('Error creating superhero'))
    );

    component.saveOrUpdateSuperhero(newSuperhero);

    expect(window.alert).toHaveBeenCalledWith('Error creating superhero');
  });

  it('should handle error in update operation', () => {
    spyOn(window, 'alert');

    service.update.and.returnValue(
      throwError(() => new Error('Error updating superhero'))
    );

    component.saveOrUpdateSuperhero(MOCK_HEROES[0]);

    expect(window.alert).toHaveBeenCalledWith('Error updating superhero');
  });

  it('should clear search when clearSearch is called', () => {
    component.clearSearch();

    expect(component['_isSearching']()).toBe(false);
  });

  it('should test confirm dialog rejection for delete', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteSuperhero(MOCK_HEROES[0]);

    expect(service.delete).not.toHaveBeenCalled();
  });

  it('should handle delete operation error', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');

    service.delete.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    component.deleteSuperhero(MOCK_HEROES[0]);

    expect(window.alert).toHaveBeenCalledWith('Delete failed');
  });

  it('should handle successful create with list refresh', () => {
    const newSuperhero = { ...MOCK_HEROES[0], id: undefined };

    component.saveOrUpdateSuperhero(newSuperhero);

    expect(service.create).toHaveBeenCalledWith(newSuperhero);
    expect(component.searchTerm()).toBe('');
  });

  it('should handle successful update in search mode', () => {
    component['_isSearching'].set(true);

    component.saveOrUpdateSuperhero(MOCK_HEROES[0]);

    expect(service.update).toHaveBeenCalledWith(MOCK_HEROES[0]);
  });

  it('should handle successful update in normal mode', () => {
    component['_isSearching'].set(false);

    component.saveOrUpdateSuperhero(MOCK_HEROES[0]);

    expect(service.update).toHaveBeenCalledWith(MOCK_HEROES[0]);
  });
});
