import { Component, Inject  } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  
  constructor (
    public modal: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

}
