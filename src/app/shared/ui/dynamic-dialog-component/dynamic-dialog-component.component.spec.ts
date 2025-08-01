import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDialogComponentComponent } from './dynamic-dialog-component.component';

describe('DynamicDialogComponentComponent', () => {
  let component: DynamicDialogComponentComponent;
  let fixture: ComponentFixture<DynamicDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
