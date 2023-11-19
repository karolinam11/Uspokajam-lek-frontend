import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDoctorComponent } from './account-doctor.component';

describe('AccountDoctorComponent', () => {
  let component: AccountDoctorComponent;
  let fixture: ComponentFixture<AccountDoctorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDoctorComponent]
    });
    fixture = TestBed.createComponent(AccountDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
