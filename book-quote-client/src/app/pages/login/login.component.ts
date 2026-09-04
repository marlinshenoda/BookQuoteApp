import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const { userName, password } = this.form.getRawValue();

    this.auth.login(userName, password).subscribe({
      next: () => void this.router.navigate(['/books']),
      error: () => {
        this.error.set('Inloggningen misslyckades. Kontrollera användarnamn och lösenord.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
