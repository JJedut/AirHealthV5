import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThresholdSettingsComponent } from './threshold-settings.component';

describe('ThresholdSettingsComponent', () => {
  let component: ThresholdSettingsComponent;
  let fixture: ComponentFixture<ThresholdSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThresholdSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThresholdSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
