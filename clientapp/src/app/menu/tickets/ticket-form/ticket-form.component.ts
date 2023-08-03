import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ticket } from '@app/_models/ticket';
import { TicketService } from '@app/_services/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent {
  formInput: FormGroup;
  idtc;
  ticket: Ticket;
  isFieldAjuVisible = true;
  isFieldNopenVisible = true;

  constructor(private tcService: TicketService,
    private dialogRef: MatDialogRef<TicketFormComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data) {
      if (data) {
        this.idtc = data.id;
      }
      this.formInput = fb.group({
        aju: '',
        nopen: '',
        pendate: [new Date()],
        name: ['', Validators.required],
        problem: ['', [Validators.required, Validators.maxLength(200)]]
      },{validators: this.validateFields});

      this.formInput.get('aju')?.valueChanges.subscribe(value => {
        if (value || value === '') {
          this.formInput.get('nopen')?.reset();
          this.formInput.get('pendate')?.reset();
          this.formInput.get('nopen')?.disable();
          this.isFieldAjuVisible = true;
          this.isFieldNopenVisible = false;
        } else {
          this.formInput.get('nopen')?.enable();
          this.isFieldAjuVisible = false;
          this.isFieldNopenVisible = true;
        }
      });

      this.formInput.get('nopen')?.valueChanges.subscribe(value => {
        if (value) {
          this.formInput.get('pendate')?.enable();
          this.isFieldAjuVisible = false;
        } else {
          this.formInput.get('pendate')?.reset();
          this.formInput.get('pendate')?.disable();
          this.isFieldAjuVisible = true;
        }
      });
 }
 validateFields(formGroup: FormGroup) {
   const aju = formGroup.get('aju')?.value;
   const nopen = formGroup.get('nopen')?.value;
   const pendate = formGroup.get('pendate')?.value;

   // Cek jika field1 atau field2 diisi
   if (aju && !nopen ) {
     return null;
   }
   if (nopen && (!aju || aju.length < 1)) {
     return null;
   }
   // Cek jika field2 diisi dan field3 kosong
   if (nopen && !pendate) {
     return { field3Required: true };
   }
   return null;
 }

  ngOnInit() {
    this.ticket = <Ticket>{};
    this.loadData();
  }
  loadData(){
    if (this.idtc) {
      this.tcService.get<Ticket>(this.idtc).subscribe(result => {
        this.ticket = result;

        this.formInput.patchValue({
          aju: this.ticket.aju,
          pendate: new Date(this.ticket.pendate),
          nopen: this.ticket.nopen,
          name: this.ticket.name,
          problem: this.ticket.problem,
          creator: this.ticket.creator
        });

      }, error => console.error(error));
    }
  }

  onSubmit(){
    this.ticket.aju = this.formInput.get('aju').value;
    this.ticket.pendate = new Date(this.formInput.get('pendate').value);
    this.ticket.nopen = this.formInput.get('nopen').value;
    this.ticket.name = this.formInput.get('name').value;
    this.ticket.problem = this.formInput.get('problem').value;
    
    if (this.idtc) {
      this.ticket.id = this.idtc;
      this.tcService.put<Ticket>(this.ticket).subscribe(result => {
        if (result) {
          this.closeDialog();
        }
      }, error => {
        console.error(error);
        Swal.fire(error.message);
      });

    } else {
      this.tcService.post<Ticket>(this.ticket).subscribe(
        result => {
        if (result) {
          Swal.fire('result');
          this.closeDialog();
        }
      }, error => {
        console.error(error);
        Swal.fire(error.error.message);
      });
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
