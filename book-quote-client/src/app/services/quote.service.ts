import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Quote, QuotePayload } from '../models/quote.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private readonly baseUrl = `${environment.apiUrl}/quotes`;

  constructor(private readonly http: HttpClient) {}

  getMine() {
    return this.http.get<Quote[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<Quote>(`${this.baseUrl}/${id}`);
  }

  create(payload: QuotePayload) {
    return this.http.post<Quote>(this.baseUrl, payload);
  }

  update(id: number, payload: QuotePayload) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
