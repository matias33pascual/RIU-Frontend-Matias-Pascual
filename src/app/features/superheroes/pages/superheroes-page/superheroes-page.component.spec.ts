import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { SweetAlertService } from '@core/services/sweet-alert.service';
import { SuperheroSearchComponent } from '@superheroes/components/superhero-search/superhero-search.component';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';
import { asyncScheduler, scheduled, throwError } from 'rxjs';
import Swal from 'sweetalert2';
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
  let sweetAlertService: jasmine.SpyObj<SweetAlertService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('MockSuperheroesService', [
      'getAll',
      'getByName',
      'delete',
      'create',
      'update',
    ]);

    const sweetAlertSpy = jasmine.createSpyObj('SweetAlertService', [
      'error',
      'success',
      'confirmDelete',
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

    sweetAlertSpy.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: true })
    );

    await TestBed.configureTestingModule({
      imports: [SuperheroesPageComponent],
      providers: [
        { provide: MockSuperheroesService, useValue: serviceSpy },
        { provide: MatDialog, useValue: {} },
        { provide: SweetAlertService, useValue: sweetAlertSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroesPageComponent);

    component = fixture.componentInstance;

    service = TestBed.inject(
      MockSuperheroesService
    ) as jasmine.SpyObj<MockSuperheroesService>;

    sweetAlertService = TestBed.inject(
      SweetAlertService
    ) as jasmine.SpyObj<SweetAlertService>;

    fixture.detectChanges();
  });

  afterEach(() => {
    Swal.close();
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

  it('should call delete service when deleting a superhero', async () => {
    sweetAlertService.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await component.deleteSuperhero(MOCK_HEROES[0]);

    expect(service.delete).toHaveBeenCalledWith('1');
  });

  it('should handle error in create operation', () => {
    const newSuperhero = { ...MOCK_HEROES[0], id: undefined };

    service.create.and.returnValue(
      throwError(() => new Error('Error creating superhero'))
    );

    component.saveOrUpdateSuperhero(newSuperhero);

    expect(sweetAlertService.error).toHaveBeenCalledWith(
      'Error al crear superhéroe',
      'Error creating superhero'
    );
  });

  it('should handle error in update operation', () => {
    service.update.and.returnValue(
      throwError(() => new Error('Error updating superhero'))
    );

    component.saveOrUpdateSuperhero(MOCK_HEROES[0]);

    expect(sweetAlertService.error).toHaveBeenCalledWith(
      'Error al actualizar superhéroe',
      'Error updating superhero'
    );
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

  it('should handle delete operation error', async () => {
    sweetAlertService.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    service.delete.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    await component.deleteSuperhero(MOCK_HEROES[0]);

    expect(sweetAlertService.error).toHaveBeenCalledWith(
      'Error al eliminar',
      'Delete failed'
    );
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

  it('should show error alert when constructor fails to load heroes', () => {
    TestBed.resetTestingModule();

    const mockSweetAlertService = jasmine.createSpyObj('SweetAlertService', [
      'error',
      'success',
      'confirmDelete',
    ]);

    TestBed.configureTestingModule({
      imports: [SuperheroesPageComponent],
      providers: [
        {
          provide: MockSuperheroesService,
          useValue: {
            getAll: jasmine
              .createSpy('getAll')
              .and.returnValue(throwError(() => new Error('Network error'))),
            getByName: jasmine.createSpy('getByName'),
            create: jasmine.createSpy('create'),
            update: jasmine.createSpy('update'),
            delete: jasmine.createSpy('delete'),
          },
        },
        { provide: MatDialog, useValue: {} },
        { provide: SweetAlertService, useValue: mockSweetAlertService },
      ],
    });

    const errorFixture = TestBed.createComponent(SuperheroesPageComponent);

    expect(mockSweetAlertService.error).toHaveBeenCalledWith(
      'Error al cargar superhéroes',
      'No se pudieron cargar los superhéroes.'
    );
  });

  it('should handle delete confirmation rejection', () => {
    sweetAlertService.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: false } as any)
    );

    component.deleteSuperhero(MOCK_HEROES[0]);

    expect(service.delete).not.toHaveBeenCalled();
  });

  it('should show success message after successful delete', async () => {
    sweetAlertService.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    await component.deleteSuperhero(MOCK_HEROES[0]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(sweetAlertService.confirmDelete).toHaveBeenCalledWith(
      MOCK_HEROES[0].name
    );

    expect(sweetAlertService.success).toHaveBeenCalledWith(
      'Superman ya no está en la lista'
    );
  });

  it('should show error message when delete fails', async () => {
    sweetAlertService.confirmDelete.and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
    service.delete.and.returnValue(
      throwError(() => new Error('Delete failed'))
    );

    await component.deleteSuperhero(MOCK_HEROES[0]);

    expect(sweetAlertService.error).toHaveBeenCalledWith(
      'Error al eliminar',
      'Delete failed'
    );
  });

  it('should show error alert when update fails', () => {
    const updatedSuperhero = { ...MOCK_HEROES[0], name: 'Updated Superman' };

    service.update.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    component.saveOrUpdateSuperhero(updatedSuperhero);

    expect(sweetAlertService.error).toHaveBeenCalledWith(
      'Error al actualizar superhéroe',
      'Update failed'
    );
  });

  it('should handle searchByName when in search mode', () => {
    component['_isSearching'].set(true);
    component.searchTerm.set('super');

    component.searchByName('super');

    expect(service.getByName).toHaveBeenCalledWith('super');
  });

  it('should handle empty search term', () => {
    component['_isSearching'].set(true);

    component.searchByName('');

    expect(service.getByName).not.toHaveBeenCalled();
  });

  it('should handle search error', () => {
    component['_isSearching'].set(true);
    service.getByName.and.returnValue(
      throwError(() => new Error('Search failed'))
    );

    component.searchByName('super');

    expect(component['_searchResults']()).toEqual([]);
  });

  it('should call addSuperhero and open dialog with null data', () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.componentInstance = {
      saveOrUpdateSuperhero: jasmine.createSpyObj('EventEmitter', [
        'subscribe',
      ]),
      cancel: jasmine.createSpyObj('EventEmitter', ['subscribe']),
    };
    mockDialogRef.afterClosed.and.returnValue(
      jasmine.createSpyObj('Observable', ['subscribe'])
    );

    dialogSpy.open.and.returnValue(mockDialogRef);
    component['dialog'] = dialogSpy;

    component.addSuperhero();

    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should call editSuperhero and open dialog with superhero data', () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockDialogRef.componentInstance = {
      saveOrUpdateSuperhero: jasmine.createSpyObj('EventEmitter', [
        'subscribe',
      ]),
      cancel: jasmine.createSpyObj('EventEmitter', ['subscribe']),
    };
    mockDialogRef.afterClosed.and.returnValue(
      jasmine.createSpyObj('Observable', ['subscribe'])
    );

    dialogSpy.open.and.returnValue(mockDialogRef);
    component['dialog'] = dialogSpy;

    component.editSuperhero(MOCK_HEROES[0]);

    expect(dialogSpy.open).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.objectContaining({
        data: { superheroForUpdate: MOCK_HEROES[0] },
      })
    );
  });

  it('should update search results when creating superhero during search', () => {
    component['_isSearching'].set(true);
    component['_searchResults'].set([]);

    const newSuperhero = { ...MOCK_HEROES[0], id: undefined };
    const createdSuperhero = { ...MOCK_HEROES[0], id: '3' };

    service.create.and.returnValue(
      scheduled([createdSuperhero], asyncScheduler)
    );

    component.saveOrUpdateSuperhero(newSuperhero);

    fixture.detectChanges();

    expect(service.create).toHaveBeenCalledWith(newSuperhero);
  });

  it('should clear search term after successful superhero creation', () => {
    component.searchTerm.set('test search');
    const newSuperhero = { ...MOCK_HEROES[0], id: undefined };

    component.saveOrUpdateSuperhero(newSuperhero);

    fixture.detectChanges();

    expect(service.create).toHaveBeenCalledWith(newSuperhero);
  });
});
