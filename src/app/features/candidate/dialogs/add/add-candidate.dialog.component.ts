import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CandidateDataService } from '../../services/candidate-data.service';
import { FormControl, Validators } from '@angular/forms';
import { Candidate } from '../../models/Candidate';

@Component({
  selector: 'app-add-candidate.dialog',
  templateUrl: '../../dialogs/add/add-candidate.dialog.html',
  styleUrls: ['../../dialogs/add/add-candidate.dialog.css']
})

export class AddCandidateDialogComponent {
  statuses: any
  constructor(public dialogRef: MatDialogRef<AddCandidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Candidate,
    public dataService: CandidateDataService) {
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

  public confirmAdd(): void {
    this.dataService.addCandidate(this.data);
  }
}
