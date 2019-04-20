import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitToFinishComponent } from './wait-to-finish.component';

describe('WaitToFinishComponent', () => {
  let component: WaitToFinishComponent;
  let fixture: ComponentFixture<WaitToFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitToFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitToFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
