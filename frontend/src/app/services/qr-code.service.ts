import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QRCodeResponse {
  success: boolean;
  qrCodeImage?: string;
  qrCodeData?: string;
  qrCodeId?: string;
  generatedAt?: string;
  message?: string;
}

export interface DecodedQRData {
  userId: string;
  qrCodeId: string;
  name: string;
  email: string;
  timestamp: string;
  type: string;
}

export interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {
  private readonly API_URL = 'http://localhost:5001/api/qrcode';

  constructor(private http: HttpClient) {}

  /**
   * Generate QR code for the current user
   */
  generateQRCode(): Observable<QRCodeResponse> {
    return this.http.post<QRCodeResponse>(`${this.API_URL}/generate`, {});
  }

  /**
   * Get QR code image for the current user
   */
  getQRCodeImage(): Observable<QRCodeResponse> {
    return this.http.get<QRCodeResponse>(`${this.API_URL}/image`);
  }

  /**
   * Get QR code data for the current user
   */
  getQRCodeData(): Observable<QRCodeResponse> {
    return this.http.get<QRCodeResponse>(`${this.API_URL}/data`);
  }

  /**
   * Decode QR code data
   */
  decodeQRCode(qrData: string): Observable<{ success: boolean; decodedData?: DecodedQRData; message?: string }> {
    return this.http.post<{ success: boolean; decodedData?: DecodedQRData; message?: string }>(
      `${this.API_URL}/decode`,
      { qrData }
    );
  }

  /**
   * Get user info by QR code ID for recommendation form
   */
  getUserInfoByQRCode(qrCodeId: string): Observable<{ success: boolean; user?: UserProfile; message?: string }> {
    return this.http.get<{ success: boolean; user?: UserProfile; message?: string }>(
      `${this.API_URL}/user/${qrCodeId}`
    );
  }

  /**
   * Generate recommendation form URL for a QR code
   */
  generateRecommendationUrl(qrCodeId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/recommend/${qrCodeId}`;
  }

  /**
   * Download QR code as image
   */
  downloadQRCode(qrCodeImage: string, filename: string = 'qr-code.png'): void {
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Share QR code via Web Share API (if available)
   */
  async shareQRCode(qrCodeImage: string, title: string = 'My QR Code'): Promise<void> {
    if (navigator.share) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });

        await navigator.share({
          title,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
      }
    } else {
      // Fallback: copy to clipboard or download
      this.downloadQRCode(qrCodeImage);
    }
  }
} 