import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Superhero } from '@superheroes/interfaces/superhero.interface';
import { SuperheroesListComponent } from './superheroes-list.component';

describe('SuperheroesListComponent', () => {
  let component: SuperheroesListComponent;
  let fixture: ComponentFixture<SuperheroesListComponent>;

  const mockSuperheroes: Superhero[] = [
    {
      id: '1',
      name: 'Superman',
      realName: 'Clark Kent',
      superpower: 'Súper fuerza',
    },
    {
      id: '2',
      name: 'Batman',
      realName: 'Bruce Wayne',
      superpower: 'Intelecto',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SuperheroesListComponent,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroesListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('superheroesList', mockSuperheroes);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display superheroes in table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('[mat-row]');
    expect(rows.length).toBe(2);
  });

  it('should display correct column headers', () => {
    const compiled = fixture.nativeElement;
    const headers = compiled.querySelectorAll('[mat-header-cell]');

    expect(headers[0].textContent).toContain('Nombre');
    expect(headers[1].textContent).toContain('Nombre Real');
    expect(headers[2].textContent).toContain('Superpoder');
  });

  it('should emit addEvent when add button is clicked', () => {
    spyOn(component.addEvent, 'emit');

    component.addSuperhero();

    expect(component.addEvent.emit).toHaveBeenCalled();
  });

  it('should emit editEvent when edit button is clicked', () => {
    spyOn(component.editEvent, 'emit');

    component.editSuperhero(mockSuperheroes[0]);

    expect(component.editEvent.emit).toHaveBeenCalledWith(mockSuperheroes[0]);
  });

  it('should emit deleteEvent when delete button is clicked', () => {
    spyOn(component.deleteEvent, 'emit');

    component.deleteSuperhero(mockSuperheroes[0]);

    expect(component.deleteEvent.emit).toHaveBeenCalledWith(mockSuperheroes[0]);
  });

  it('should have add button', () => {
    const compiled = fixture.nativeElement;
    const addButton = compiled.querySelector('button[mat-stroked-button]');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toContain('Añadir');
  });

  it('should have edit and delete buttons for each superhero', () => {
    const compiled = fixture.nativeElement;
    const editButtons = compiled.querySelectorAll('button[color="accent"]');
    const deleteButtons = compiled.querySelectorAll('button[color="warn"]');

    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it('should update data source when superheroesList changes', () => {
    const newSuperheroes: Superhero[] = [
      {
        id: '3',
        name: 'Wonder Woman',
        realName: 'Diana Prince',
        superpower: 'Súper fuerza, vuelo',
      },
    ];

    fixture.componentRef.setInput('superheroesList', newSuperheroes);
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(newSuperheroes);
  });

  it('should show "No se encontraron resultados" when list is empty', () => {
    fixture.componentRef.setInput('superheroesList', []);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const noDataRow = compiled.querySelector('.no-data');
    expect(noDataRow?.textContent).toContain('No se encontraron resultados');
  });
});
