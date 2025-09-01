import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerMindmap } from './career-mindmap';

describe('CareerMindmap', () => {
  let component: CareerMindmap;
  let fixture: ComponentFixture<CareerMindmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CareerMindmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CareerMindmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
