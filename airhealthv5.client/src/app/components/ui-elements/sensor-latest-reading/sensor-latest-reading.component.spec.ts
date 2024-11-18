import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorLatestReadingComponent } from './sensor-latest-reading.component';

describe('SensorLatestReadingComponent', () => {
  let component: SensorLatestReadingComponent;
  let fixture: ComponentFixture<SensorLatestReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SensorLatestReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SensorLatestReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
