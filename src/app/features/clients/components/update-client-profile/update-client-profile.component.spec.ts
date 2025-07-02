import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClientProfileComponent } from './update-client-profile.component';

describe('UpdateClientProfileComponent', () => {
  let component: UpdateClientProfileComponent;
  let fixture: ComponentFixture<UpdateClientProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateClientProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClientProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
