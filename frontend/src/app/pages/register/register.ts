import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  confirm = '';
  loading = false;
  error = '';

  submit() {
    this.error = '';
    if (this.password !== this.confirm) {
      this.error = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigateByUrl('/'),
        error: (err: HttpErrorResponse) => {
          this.error = err.error?.message ?? 'Registration failed';
          this.loading = false;
        },
      });
  }
}
