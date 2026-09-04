import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    userName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const { userName, email, password } = this.form.getRawValue();

    this.auth.register(userName, email, password).subscribe({
      next: () => void this.router.navigate(['/books']),
      error: (err: { error?: string | string[] }) => {
        const message = Array.isArray(err.error) ? err.error.join(' ') : 'Registreringen misslyckades.';
        this.error.set(message);
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
