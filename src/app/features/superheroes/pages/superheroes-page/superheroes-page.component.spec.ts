import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperheroesPageComponent } from './superheroes-page.component';

describe('SuperheroesPageComponent', () => {
  let component: SuperheroesPageComponent;
  let fixture: ComponentFixture<SuperheroesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperheroesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
