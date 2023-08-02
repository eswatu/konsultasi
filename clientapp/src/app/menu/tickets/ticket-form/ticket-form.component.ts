import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ticket } from '@app/_models/ticket';
import { TicketService } from '@app/_services/ticket.service';
import Swal from 'sweetalert2';
import { MatInput } from "@angular/material/input";

@Component({
  selector: 'ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.css']
})
export class TicketFormComponent {
  formInput: FormGroup;
  idtc;
  ticket: Ticket;

  constructor(private tcService: TicketService,
    private dialogRef: MatDialogRef<TicketFormComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data) {
      if (data) {
        this.idtc = data.id;
      }
      this.formInput = fb.group({
        aju: ['', [Validators.minLength(40), Validators.minLength(40)]],
        nopen: ['', Validators.required],
        pendate: [new Date(), Validators.required],
        name: ['', Validators.required],
        problem: ['', Validators.maxLength(100)]
      });
 }
 //error message
 get ErrorMessageaju() : string{
  const c: FormControl = (this.formInput.get('aju') as FormControl);
  return c.hasError('required') ? 'Nomor Aju atau Pendaftaran harus diisi': '';
}
 get ErrorMessagenopen() : string{
  const c: FormControl = (this.formInput.get('nopen') as FormControl);
  return c.hasError('required') ? 'Nomor Pendaftaran Harus diisi': '';
}
get ErrorMessagePendate() : string{
  const c: FormControl = (this.formInput.get('pendate') as FormControl);
  return c.hasError('required') ? 'Jika Nomor Daftar diisi, maka Tanggal Pendaftaran juga harus diisi': '';
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

  stringDate(inp:string) {
    let d = inp.substring(0,2);
    let m = inp.substring(3,5);
    let y = inp.substring(6,10);
    return String(m + '/' + d + '/' +y);
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
