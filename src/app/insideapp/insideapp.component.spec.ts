import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideappComponent } from './insideapp.component';

describe('InsideappComponent', () => {
  let component: InsideappComponent;
  let fixture: ComponentFixture<InsideappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsideappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsideappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
