import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RecommendationFormData {
  recommenderName: string;
  name: string;
  link: string;
  description?: string;
  qrCodeId: string;
}

export interface RecommendationResponse {
  success: boolean;
  message?: string;
  recommendation?: any;
  errors?: any[];
}

export interface UserInfoResponse {
  success: boolean;
  user?: {
    name: string;
    email: string;
    qrCodeId: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = environment.apiUrl || 'http://localhost:5001/api';

  constructor(private http: HttpClient) {}

  submitRecommendation(data: RecommendationFormData): Observable<RecommendationResponse> {
    return this.http.post<RecommendationResponse>(`${this.apiUrl}/recommendations/submit`, data);
  }

  getUserInfo(qrCodeId: string): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.apiUrl}/qrcode/user/${qrCodeId}`);
  }

  getUserRecommendations(qrCodeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations/user/${qrCodeId}`);
  }

  getMyRecommendations(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/recommendations/my-recommendations?userId=${userId}`);
  }
} 