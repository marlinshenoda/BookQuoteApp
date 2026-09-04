import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { BookListComponent } from './pages/books/book-list/book-list.component';
import { BookFormComponent } from './pages/books/book-form/book-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { QuoteListComponent } from './pages/quotes/quote-list/quote-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'books', component: BookListComponent, canActivate: [authGuard] },
  { path: 'books/new', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'books/:id/edit', component: BookFormComponent, canActivate: [authGuard] },
  { path: 'quotes', component: QuoteListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'books' }
];
