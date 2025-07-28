import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { SuperheroSearchComponent } from '@superheroes/components/superhero-search/superhero-search.component';
import { SuperheroesListComponent } from '@superheroes/components/superheroes-list/superheroes-list.component';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { MockSuperheroesService } from '@superheroes/services/mock-superheroes.service';
import { asyncScheduler, scheduled } from 'rxjs';
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

  it('should render the search and list components', () => {
    const search = fixture.debugElement.query(
      By.directive(SuperheroSearchComponent)
    );

    const list = fixture.debugElement.query(
      By.directive(SuperheroesListComponent)
    );

    expect(search).toBeTruthy();
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
});
