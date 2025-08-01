import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QRCodeService, QRCodeResponse } from '../../services/qr-code.service';

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
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQRCode();
  }

  loadQRCode(): void {
    this.loading = true;
    this.qrCodeService.getQRCodeImage().subscribe({
      next: (response: QRCodeResponse) => {
        if (response.success && response.qrCodeImage) {
          this.qrCodeImage = response.qrCodeImage;
          this.qrCodeData = response.qrCodeData || null;
          this.qrCodeId = response.qrCodeId || null;
          this.generatedAt = response.generatedAt || null;
        } else {
          this.snackBar.open('Failed to load QR code', 'Close', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading QR code:', error);
        this.snackBar.open('Error loading QR code', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  generateNewQRCode(): void {
    this.generating = true;
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
      },
      error: (error) => {
        console.error('Error generating QR code:', error);
        this.snackBar.open('Error generating QR code', 'Close', { duration: 3000 });
        this.generating = false;
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

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
} 