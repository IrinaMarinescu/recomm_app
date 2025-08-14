import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeService, QRCodeResponse } from '../../services/qr-code.service';
import { HealthService } from '../../services/health.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QRCodeComponent implements OnInit {
  qrCodeImage: string | null = null;
  qrCodeData: string | null = null;
  qrCodeId: string | null = null;
  generatedAt: string | null = null;
  loading = false;
  generating = false;

  constructor(
    private qrCodeService: QRCodeService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private healthService: HealthService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simple initialization - just try to load QR code
    this.loadQRCode();
  }

  checkBackendHealth(): void {
    // Check if services are available
    if (!this.authService || !this.healthService) {
      console.error('Services not available');
      this.snackBar.open('Services not available', 'Close', { duration: 5000 });
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    // Check if user is authenticated first
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please login first to access QR code features', 'Close', { duration: 5000 });
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.healthService.checkHealth().subscribe({
      next: () => {
        this.loadQRCode();
      },
      error: (error) => {
        console.error('Backend server is not running:', error);
        this.snackBar.open('Backend server is not running. Please start the server first.', 'Close', { duration: 10000 });
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadQRCode(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Check if authService is available
    if (!this.authService) {
      console.error('AuthService not available');
      this.snackBar.open('Authentication service not available', 'Close', { duration: 5000 });
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    
    // Check if user is authenticated
    const token = this.authService.getToken();
    if (!token) {
      this.snackBar.open('Please login first to access QR code features', 'Close', { duration: 5000 });
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }
    
    console.log('Loading QR code with token:', token ? 'Present' : 'Missing');
    
    this.qrCodeService.getQRCodeImage().subscribe({
      next: (response: QRCodeResponse) => {
        console.log('QR code response:', response);
        if (response.success && response.qrCodeImage) {
          this.qrCodeImage = response.qrCodeImage;
          this.qrCodeData = response.qrCodeData || null;
          this.qrCodeId = response.qrCodeId || null;
          this.generatedAt = response.generatedAt || null;
        } else {
          this.snackBar.open('Failed to load QR code', 'Close', { duration: 3000 });
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading QR code:', error);
        if (error.status === 401 || error.status === 403) {
          this.snackBar.open('Authentication required. Please login first.', 'Close', { duration: 5000 });
        } else {
          this.snackBar.open('Error loading QR code. Please make sure the backend server is running.', 'Close', { duration: 5000 });
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  generateNewQRCode(): void {
    // Check if authService is available
    if (!this.authService) {
      console.error('AuthService not available');
      this.snackBar.open('Authentication service not available', 'Close', { duration: 5000 });
      return;
    }

    // Check if user is authenticated first
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please login first to access QR code features', 'Close', { duration: 5000 });
      return;
    }

    this.generating = true;
    this.cdr.detectChanges();
    
    this.qrCodeService.generateQRCode().subscribe({
      next: (response: QRCodeResponse) => {
        if (response.success && response.qrCodeImage) {
          this.qrCodeImage = response.qrCodeImage;
          this.qrCodeData = response.qrCodeData || null;
          this.qrCodeId = response.qrCodeId || null;
          this.generatedAt = response.generatedAt || null;
          this.snackBar.open('QR code generated successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open('Failed to generate QR code', 'Close', { duration: 3000 });
        }
        this.generating = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error generating QR code:', error);
        if (error.status === 401 || error.status === 403) {
          this.snackBar.open('Authentication required. Please login first.', 'Close', { duration: 5000 });
        } else {
          this.snackBar.open('Error generating QR code. Please make sure the backend server is running.', 'Close', { duration: 5000 });
        }
        this.generating = false;
        this.cdr.detectChanges();
      }
    });
  }

  downloadQRCode(): void {
    if (this.qrCodeImage) {
      this.qrCodeService.downloadQRCode(this.qrCodeImage, `qr-code-${this.qrCodeId}.png`);
      this.snackBar.open('QR code downloaded!', 'Close', { duration: 2000 });
    }
  }

  shareQRCode(): void {
    if (this.qrCodeImage) {
      this.qrCodeService.shareQRCode(this.qrCodeImage, 'My Personal QR Code');
    }
  }

  copyQRCodeId(): void {
    if (this.qrCodeId) {
      navigator.clipboard.writeText(this.qrCodeId).then(() => {
        this.snackBar.open('QR Code ID copied to clipboard!', 'Close', { duration: 2000 });
      }).catch(() => {
        this.snackBar.open('Failed to copy QR Code ID', 'Close', { duration: 3000 });
      });
    }
  }

  copyRecommendationUrl(): void {
    if (this.qrCodeId) {
      const recommendationUrl = this.qrCodeService.generateRecommendationUrl(this.qrCodeId);
      navigator.clipboard.writeText(recommendationUrl).then(() => {
        this.snackBar.open('Recommendation URL copied to clipboard!', 'Close', { duration: 2000 });
      }).catch(() => {
        this.snackBar.open('Failed to copy recommendation URL', 'Close', { duration: 3000 });
      });
    }
  }

  getRecommendationUrl(): string {
    if (this.qrCodeId) {
      return this.qrCodeService.generateRecommendationUrl(this.qrCodeId);
    }
    return '';
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
} 