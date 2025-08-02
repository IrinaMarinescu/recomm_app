import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-recommendations-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './recommendations-view.component.html',
  styleUrls: ['./recommendations-view.component.css']
})
export class RecommendationsViewComponent implements OnInit {
  loading = false;
  userInfo: any = null;
  recommendations: any[] = [];
  qrCodeId: string = '';

  constructor(
    private route: ActivatedRoute,
    private recommendationService: RecommendationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.qrCodeId = params['qrCodeId'];
      if (this.qrCodeId) {
        this.loadRecommendations();
      }
    });
  }

  loadRecommendations(): void {
    this.loading = true;
    this.recommendationService.getUserRecommendations(this.qrCodeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.userInfo = response.user;
          this.recommendations = response.recommendations || [];
        } else {
          this.snackBar.open('Failed to load recommendations', 'Close', { duration: 3000 });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
        this.snackBar.open('Error loading recommendations', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openLink(link: string): void {
    window.open(link, '_blank');
  }

  getFormattedDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  copyRecommendationUrl(): void {
    const recommendationUrl = `${window.location.origin}/recommend/${this.qrCodeId}`;
    navigator.clipboard.writeText(recommendationUrl).then(() => {
      this.snackBar.open('Recommendation URL copied to clipboard!', 'Close', { duration: 2000 });
    }).catch(() => {
      this.snackBar.open('Failed to copy recommendation URL', 'Close', { duration: 3000 });
    });
  }
} 