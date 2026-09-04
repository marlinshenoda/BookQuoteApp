import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss'
})
export class BookFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEdit = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  private bookId = 0;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    publishedDate: ['', Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit.set(true);
      this.bookId = Number(idParam);
      this.bookService.getById(this.bookId).subscribe({
        next: (book) =>
          this.form.patchValue({
            title: book.title,
            author: book.author,
            publishedDate: book.publishedDate
          }),
        error: () => this.error.set('Kunde inte hämta boken.')
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const payload = this.form.getRawValue();

    if (this.isEdit()) {
      this.bookService.update(this.bookId, payload).subscribe({
        next: () => void this.router.navigate(['/books']),
        error: () => {
          this.error.set('Kunde inte spara boken.');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false)
      });
      return;
    }

    this.bookService.create(payload).subscribe({
      next: () => void this.router.navigate(['/books']),
      error: () => {
        this.error.set('Kunde inte spara boken.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
