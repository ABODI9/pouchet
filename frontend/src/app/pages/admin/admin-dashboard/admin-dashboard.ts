import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [RouterModule],
  template: `
  <h2>Admin Dashboard</h2>
  <nav class="nav">
    <a routerLink="products">Products</a>
    <a routerLink="orders">Orders</a>
    <a routerLink="users">Users</a>
  </nav>
  <router-outlet />
  `,
  styles:[`.nav a{margin-right:1rem}`]
})
export class AdminDashboard {
  // يمكن إضافة منطق إضافي هنا إذا لزم الأمر
}
