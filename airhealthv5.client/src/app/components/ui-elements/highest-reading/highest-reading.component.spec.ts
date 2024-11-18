import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestReadingComponent } from './highest-reading.component';

describe('HighestReadingComponent', () => {
  let component: HighestReadingComponent;
  let fixture: ComponentFixture<HighestReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighestReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighestReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
