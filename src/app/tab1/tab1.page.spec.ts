import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  // Falešná služba: zajímá nás jen, jestli stránka zavolá add()
  const counterServiceMock = {
    add: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    counterServiceMock.add.mockClear();

    TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [{ provide: CounterService, useValue: counterServiceMock }],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass the saved counter to CounterService', async () => {
    const counter: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-09-17T08:00:00.000Z',
    };

    await component.onSaved(counter);

    expect(counterServiceMock.add).toHaveBeenCalledWith(counter);
  });
});