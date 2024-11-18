import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowestReadingComponent } from './lowest-reading.component';

describe('LowestReadingComponent', () => {
  let component: LowestReadingComponent;
  let fixture: ComponentFixture<LowestReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LowestReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowestReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
