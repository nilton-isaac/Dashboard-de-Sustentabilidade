import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobNews } from './job-news';

describe('JobNews', () => {
  let component: JobNews;
  let fixture: ComponentFixture<JobNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
