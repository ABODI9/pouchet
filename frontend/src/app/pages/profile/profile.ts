import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private auth = inject(AuthService);

  user$ = this.auth.user$; // من التوكن (email/role/exp)
  me$ = this.auth.me();    // من الـAPI /api/auth/me (id/email/role)

  ngOnInit() {
    // ممكن لاحقًا تجيب بيانات إضافية من API (لو وسّعت الموديل)
  }
}