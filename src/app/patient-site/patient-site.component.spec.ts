import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSiteComponent } from './patient-site.component';

describe('PatientSiteComponent', () => {
  let component: PatientSiteComponent;
  let fixture: ComponentFixture<PatientSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSiteComponent]
    });
    fixture = TestBed.createComponent(PatientSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
