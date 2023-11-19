import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignExerciseComponent } from './assign-exercise.component';

describe('AssignExerciseComponent', () => {
  let component: AssignExerciseComponent;
  let fixture: ComponentFixture<AssignExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignExerciseComponent]
    });
    fixture = TestBed.createComponent(AssignExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
