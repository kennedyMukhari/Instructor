import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprofilePage } from './viewprofile.page';

describe('ViewprofilePage', () => {
  let component: ViewprofilePage;
  let fixture: ComponentFixture<ViewprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewprofilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
