import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsDialogComponent } from './jobs-dialog.component';

describe('JobsDialogComponent', () => {
  let component: JobsDialogComponent;
  let fixture: ComponentFixture<JobsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
