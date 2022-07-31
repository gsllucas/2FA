import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChildren('fields')
  fieldsRef?: QueryList<ElementRef>;

  title = 'fc';

  codeFields: CodeFields[] = [
    { name: 'fieldOne', value: '' },
    { name: 'fieldTwo', value: '' },
    { name: 'fieldThree', value: '' },
    { name: 'fieldFour', value: '' },
    { name: 'fieldFive', value: '' },
  ];

  disabled = true;
  loading = false;

  constructor(private toastr: ToastrService) {}

  @HostListener('window:keypress', ['$event'])
  submitVote(event: KeyboardEvent) {
    if (!this.disabled && event.key === 'Enter') this.sendVote();
  }

  ngOnInit(): void {}

  handleEvent({ target }: any, index: number): void {
    const { value } = target;

    if (index < this.codeFields.length - 1 && value !== '')
      this.focusNextField(index);

    if (value === '' && index > 0) this.focusLastField(index);

    this.codeFields[index].value = value;
    this.setButtonState();
  }

  focusNextField(index: number) {
    this.fieldsRef!.toArray()[index + 1].nativeElement.focus();
  }

  focusLastField(index: number) {
    this.fieldsRef!.toArray()[index - 1].nativeElement.focus();
  }

  sendVote() {
    const rightCode = 87463;
    const code = Number(
      this.codeFields.reduce((acc, field) => (acc += field.value), '').trim()
    );
    this.loading = true;
    this.disabled = true;
    setTimeout(() => {
      if (code === rightCode) this.toastr.success('Sucesso!');
      else this.toastr.error('O código não é válido.');
      this.loading = false;
      this.disabled = false;
      this.clearAll();
    }, 2000);
  }

  splitCode(event: ClipboardEvent) {
    const pasted = event.clipboardData!.getData('Text');
    const codeSplitted = pasted?.trim().split('');
    codeSplitted.map(
      (_, index) => (this.codeFields[index].value = codeSplitted[index])
    );
    this.fieldsRef?.toArray()[codeSplitted.length - 1].nativeElement.focus();
    this.setButtonState();
  }

  setButtonState() {
    this.disabled = this.codeFields.some(
      (field) => field.value === '' || field.value === null
    );
  }

  clear(index: number) {
    this.codeFields[index].value = '';
    this.setButtonState();
  }

  clearAll() {
    this.codeFields.map((field) => (field.value = ''));
  }
}

interface CodeFields {
  name: string;
  value?: string;
}
