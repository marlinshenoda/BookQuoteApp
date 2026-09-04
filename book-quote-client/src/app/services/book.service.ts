import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book, CreateBookPayload } from '../models/book.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = `${environment.apiUrl}/books`;

  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Book[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Book>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateBookPayload) {
    return this.http.post<Book>(this.baseUrl, payload);
  }

  update(id: number, payload: CreateBookPayload) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
