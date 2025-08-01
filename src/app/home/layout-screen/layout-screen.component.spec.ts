import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutScreenComponent } from './layout-screen.component';

describe('LayoutScreenComponent', () => {
  let component: LayoutScreenComponent;
  let fixture: ComponentFixture<LayoutScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayoutScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
