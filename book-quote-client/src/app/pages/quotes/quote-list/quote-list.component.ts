import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Quote } from '../../../models/quote.model';
import { QuoteService } from '../../../services/quote.service';

@Component({
  selector: 'app-quote-list',
  imports: [ReactiveFormsModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.scss'
})
export class QuoteListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly quoteService = inject(QuoteService);

  protected readonly quotes = signal<Quote[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly editingId = signal<number | null>(null);
  protected readonly maxQuotes = 5;

  protected readonly form = this.fb.nonNullable.group({
    text: ['', Validators.required],
    source: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadQuotes();
  }

  startCreate(): void {
    this.editingId.set(null);
    this.form.reset({ text: '', source: '' });
  }

  startEdit(quote: Quote): void {
    this.editingId.set(quote.id);
    this.form.patchValue({ text: quote.text, source: quote.source });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ text: '', source: '' });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const editId = this.editingId();

    if (editId === null) {
      this.quoteService.create(payload).subscribe({
        next: () => {
          this.cancelEdit();
          this.loadQuotes();
        },
        error: (err: { error?: string }) => {
          const message = typeof err.error === 'string' ? err.error : 'Kunde inte spara citatet.';
          this.error.set(message);
        }
      });
      return;
    }

    this.quoteService.update(editId, payload).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadQuotes();
      },
      error: () => this.error.set('Kunde inte spara citatet.')
    });
  }

  deleteQuote(id: number): void {
    if (!confirm('Vill du radera citatet?')) {
      return;
    }

    this.quoteService.delete(id).subscribe({
      next: () => this.loadQuotes(),
      error: () => this.error.set('Kunde inte radera citatet.')
    });
  }

  private loadQuotes(): void {
    this.loading.set(true);
    this.quoteService.getMine().subscribe({
      next: (quotes) => {
        this.quotes.set(quotes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kunde inte hämta citat.');
        this.loading.set(false);
      }
    });
  }
}
