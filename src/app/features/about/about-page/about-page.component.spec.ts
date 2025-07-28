import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AboutPageComponent,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render project title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('.about-title');
    expect(title.textContent).toContain('Acerca del Proyecto');
  });

  it('should render project description', () => {
    const compiled = fixture.nativeElement;
    const description = compiled.querySelector('.project-description p');
    expect(description.textContent).toContain(
      'Aplicación web desarrollada con'
    );
  });

  it('should render technology chips', () => {
    const compiled = fixture.nativeElement;
    const chips = compiled.querySelectorAll('mat-chip');
    expect(chips.length).toBeGreaterThan(0);

    const chipTexts = Array.from(chips).map((chip: any) =>
      chip.textContent.trim()
    );
    expect(chipTexts).toContain('Angular 19');
    expect(chipTexts).toContain('TypeScript');
    expect(chipTexts).toContain('Angular Material');
  });

  it('should render author information', () => {
    const compiled = fixture.nativeElement;
    const authorSection = compiled.querySelector('.author-info');
    expect(authorSection).toBeTruthy();
    expect(authorSection.textContent).toContain('Matías Pascual');
  });
});
