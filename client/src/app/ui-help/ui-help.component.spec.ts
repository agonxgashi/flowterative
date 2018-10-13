import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHelpComponent } from './ui-help.component';

describe('UiHelpComponent', () => {
  let component: UiHelpComponent;
  let fixture: ComponentFixture<UiHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
