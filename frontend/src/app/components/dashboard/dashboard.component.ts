import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService, User } from '../../services/auth.service';
import { QRCodeComponent } from '../qr-code/qr-code.component';
import { QRCodeService } from '../../services/qr-code.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    QRCodeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  qrCodeId: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private qrCodeService: QRCodeService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    } else {
      this.loadQRCodeId();
    }
  }

  loadQRCodeId(): void {
    this.qrCodeService.getQRCodeData().subscribe({
      next: (response) => {
        if (response.success && response.qrCodeId) {
          this.qrCodeId = response.qrCodeId;
        }
      },
      error: (error) => {
        console.error('Error loading QR code ID:', error);
      }
    });
  }

  viewRecommendations(): void {
    if (this.qrCodeId) {
      this.router.navigate(['/recommendations', this.qrCodeId]);
    } else {
      this.snackBar.open('QR Code not available', 'Close', { duration: 3000 });
    }
  }

  logout(): void {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  }
} 