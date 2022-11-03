import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {CandidateDataService} from '../../services/candidate-data.service';


@Component({
  selector: 'app-delete-candidate.dialog',
  templateUrl: '../../dialogs/delete/delete-candidate.dialog.html',
  styleUrls: ['../../dialogs/delete/delete-candidate.dialog.css']
})
export class DeleteCandidateDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteCandidateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: CandidateDataService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.dataService.deleteCandidate(this.data.id);
  }
}
