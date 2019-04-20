import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitToJoinComponent } from './wait-to-join.component';

describe('WaitComponent', () => {
  let component: WaitToJoinComponent;
  let fixture: ComponentFixture<WaitToJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitToJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitToJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
