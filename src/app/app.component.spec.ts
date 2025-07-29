import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideRouter } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MatToolbarModule,
        MatButtonModule,
        LoadingComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "RIU-Frontend-Matias-Pascual"', () => {
    expect(component.title).toEqual('RIU-Frontend-Matias-Pascual');
  });

  it('should render toolbar with app title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-toolbar span').textContent).toContain(
      'Superhéroes App'
    );
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('nav a');
    expect(links.length).toBe(2);
    expect(links[0].textContent).toContain('Superhéroes');
    expect(links[1].textContent).toContain('Acerca de');
  });
});
