import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[nomorAjuDirective]'
})
export class NomorAjuDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let value = inputElement.value;

    // Hapus karakter selain angka dan '-'
    value = value.replace(/[^\d-]/g, '');

    // Hapus semua tanda '-' sebelum memasukkan kembali
    value = value.replace(/-/g, '');

    // Jika nilai melebihi 24 digit, potong ke 24 digit pertama
    if (value.length > 24) {
      value = value.substr(0, 24);
    }

    // Tambahkan tanda '-' setiap 6 digit
    if (value.length > 6) {
      const parts = [];
      for (let i = 0; i < value.length; i += 6) {
        parts.push(value.substr(i, 6));
      }
      value = parts.join('-');
    }

    // Setelah manipulasi, terapkan kembali ke input
    inputElement.value = value;
  }

}
