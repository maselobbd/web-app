import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLayoutResolverComponent } from './navbar-layout-resolver.component';

describe('NavbarLayoutResolverComponent', () => {
  let component: NavbarLayoutResolverComponent;
  let fixture: ComponentFixture<NavbarLayoutResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarLayoutResolverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarLayoutResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
