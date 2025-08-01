import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHodExpansionComponent } from './add-hod-expansion.component';

describe('AddHodExpansionComponent', () => {
  let component: AddHodExpansionComponent;
  let fixture: ComponentFixture<AddHodExpansionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHodExpansionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddHodExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
