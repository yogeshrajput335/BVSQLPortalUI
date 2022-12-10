import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CandidateDataService } from '../../services/candidate-data.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-candidate.dialog',
  templateUrl: '../../dialogs/edit/edit-candidate.dialog.html',
  styleUrls: ['../../dialogs/edit/edit-candidate.dialog.css']
})
export class EditCandidateDialogComponent {
  statuses: any
  constructor(public dialogRef: MatDialogRef<EditCandidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CandidateDataService) {
    this.statuses = this.dataService.getStatues()
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateCandidate(this.data);
  }
}
