import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceApiKeysComponent } from './device-api-keys.component';

describe('DeviceApiKeysComponent', () => {
  let component: DeviceApiKeysComponent;
  let fixture: ComponentFixture<DeviceApiKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviceApiKeysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceApiKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
