import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnemploymentStats } from './unemployment-stats';

describe('UnemploymentStats', () => {
  let component: UnemploymentStats;
  let fixture: ComponentFixture<UnemploymentStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnemploymentStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnemploymentStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
