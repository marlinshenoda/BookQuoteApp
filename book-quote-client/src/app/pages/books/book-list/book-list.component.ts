import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';

@Component({
  selector: 'app-book-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BookService);

  protected readonly books = signal<Book[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.loadBooks();
  }

  deleteBook(id: number): void {
    if (!confirm('Vill du radera boken?')) {
      return;
    }

    this.bookService.delete(id).subscribe({
      next: () => this.loadBooks(),
      error: () => this.error.set('Kunde inte radera boken.')
    });
  }

  private loadBooks(): void {
    this.loading.set(true);
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Kunde inte hämta böcker.');
        this.loading.set(false);
      }
    });
  }
}
