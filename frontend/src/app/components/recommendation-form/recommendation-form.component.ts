import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-recommendation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './recommendation-form.component.html',
  styleUrls: ['./recommendation-form.component.css']
})
export class RecommendationFormComponent implements OnInit {
  recommendationForm: FormGroup;
  loading = false;
  submitting = false;
  userInfo: any = null;
  qrCodeId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recommendationService: RecommendationService,
    private snackBar: MatSnackBar
  ) {
    this.recommendationForm = this.fb.group({
      recommenderName: ['', [Validators.required, Validators.minLength(2)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      link: ['', [Validators.required, Validators.pattern('https?://.+')]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.qrCodeId = params['qrCodeId'];
      if (this.qrCodeId) {
        this.loadUserInfo();
      }
    });
  }

  loadUserInfo(): void {
    this.loading = true;
    this.recommendationService.getUserInfo(this.qrCodeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.userInfo = response.user;
        } else {
          this.snackBar.open('Invalid QR code', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.snackBar.open('Error loading user info', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(): void {
    if (this.recommendationForm.valid) {
      this.submitting = true;
      const formData = {
        ...this.recommendationForm.value,
        qrCodeId: this.qrCodeId
      };

      this.recommendationService.submitRecommendation(formData).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Recommendation submitted successfully!', 'Close', { duration: 3000 });
            this.recommendationForm.reset();
          } else {
            this.snackBar.open('Failed to submit recommendation', 'Close', { duration: 3000 });
          }
          this.submitting = false;
        },
        error: (error) => {
          console.error('Error submitting recommendation:', error);
          this.snackBar.open('Error submitting recommendation', 'Close', { duration: 3000 });
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.recommendationForm.controls).forEach(key => {
      const control = this.recommendationForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.recommendationForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName === 'recommenderName' ? 'Your name' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName === 'recommenderName' ? 'Your name' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid URL (starting with http:// or https://)';
    }
    return '';
  }
} 