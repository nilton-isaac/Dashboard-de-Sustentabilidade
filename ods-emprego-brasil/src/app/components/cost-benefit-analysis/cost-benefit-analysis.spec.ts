import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostBenefitAnalysis } from './cost-benefit-analysis';

describe('CostBenefitAnalysis', () => {
  let component: CostBenefitAnalysis;
  let fixture: ComponentFixture<CostBenefitAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostBenefitAnalysis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostBenefitAnalysis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
