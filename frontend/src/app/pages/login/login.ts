import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule],
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode: 'login' | 'register' = 'login';

  // login
  email = '';
  password = '';

  // register
  rname = '';
  remail = '';
  rpassword = '';
  confirm = '';

  loading = false;
  error = '';

  ngOnInit() {
    const m = this.route.snapshot.queryParamMap.get('mode');
    if (m === 'register') this.mode = 'register';
  }

  switchMode(next: 'login' | 'register') {
    this.mode = next;
    this.error = '';
  }

  submitLogin(form: NgForm) {
    if (this.loading || form.invalid) return;
    this.loading = true; this.error = '';

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        const dest = this.route.snapshot.queryParamMap.get('returnUrl');
        const fallback = this.auth.role === 'admin' ? '/admin' : '/profile';
        this.loading = false;
        this.router.navigateByUrl(dest || fallback);
      },
      error: (err: HttpErrorResponse) => {
        this.error =
          err.error?.message ||
          (err.status === 401 ? 'Invalid email or password' : 'Unexpected error');
        this.loading = false;
      },
    });
  }

  submitRegister(form: NgForm) {
    if (this.loading || form.invalid) return;
    this.error = '';

    if (this.rpassword !== this.confirm) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.register({ name: this.rname.trim(), email: this.remail.trim(), password: this.rpassword })
      .subscribe({
        next: () => {
          this.loading = false;
          // لو كان فيه returnUrl (مثلاً كان مطلوب صفحة قبل التسجيل)
          const dest = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(dest || '/profile');
        },
        error: (err: HttpErrorResponse) => {
          // يُتوقع 409 مع message: "Email is already registered"
          this.error = err.error?.message ?? 'Registration failed';
          this.loading = false;
        },
      });
  }
}
