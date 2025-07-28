import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '@core/services/loading.service';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let loadingSignal: WritableSignal<boolean>;

  beforeEach(async () => {
    loadingSignal = signal(false);
    const loadingServiceSpy = jasmine.createSpyObj(
      'LoadingService',
      ['setLoading'],
      {
        isLoading: loadingSignal,
      }
    );

    await TestBed.configureTestingModule({
      imports: [LoadingComponent, MatProgressSpinnerModule],
      providers: [{ provide: LoadingService, useValue: loadingServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(
      LoadingService
    ) as jasmine.SpyObj<LoadingService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isLoading signal', () => {
    expect(component.isLoading).toBeDefined();
    expect(component.isLoading()).toBe(false);
  });

  it('should have correct template structure', () => {
    const compiled = fixture.nativeElement;

    expect(compiled).toBeTruthy();

    expect(component.isLoading()).toBe(false);
  });

  it('should not show spinner when loading is false', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const spinner = compiled.querySelector('mat-spinner');
    expect(spinner).toBeFalsy();
  });

  it('should show spinner when loading is true', () => {
    loadingSignal.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const spinnerContainer = compiled.querySelector('.loading-overlay');
    expect(spinnerContainer).toBeTruthy();
  });

  it('should access loading service correctly', () => {
    expect(component.isLoading).toBe(loadingService.isLoading);
  });
});
