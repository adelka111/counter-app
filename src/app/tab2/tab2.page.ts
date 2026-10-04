import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

type SortBy = 'date' | 'name' | 'value';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  readonly searchTerm = signal('');
  readonly sortBy = signal<SortBy>('date');
  readonly isClearAlertOpen = signal(false);
  readonly toastMessage = signal('');

  // Bonus 1: součet hodnot všech uložených počítadel
  readonly total = computed(() =>
    this.counterService
      .counters()
      .reduce((sum, counter) => sum + counter.value, 0),
  );

  // Bonus 2 + 3: vyhledávání a řazení (původní data se nemění)
  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    const filtered = this.counterService
      .counters()
      .filter((counter) => counter.name.toLowerCase().includes(term));

    switch (this.sortBy()) {
      case 'name':
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
      case 'value':
        return [...filtered].sort((a, b) => b.value - a.value);
      default:
        return filtered; // služba je drží od nejnovějšího
    }
  });

  // Bonus 4: tlačítka potvrzovacího dialogu
  readonly clearAlertButtons = [
    { text: 'Zrušit', role: 'cancel' },
    {
      text: 'Vymazat',
      role: 'destructive',
      handler: () => {
        void this.clear();
      },
    },
  ];

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  onSearch(value: string | null | undefined): void {
    this.searchTerm.set(value ?? '');
  }

  onSortChange(value: unknown): void {
    this.sortBy.set(value as SortBy);
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    this.toastMessage.set('Záznam byl odstraněn.'); // Bonus 5
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    this.toastMessage.set('Historie byla vymazána.'); // Bonus 5
  }
}