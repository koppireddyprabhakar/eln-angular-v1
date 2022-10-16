import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DosageService } from '@app/services/dosage/dosage.service';
import { finalize } from 'rxjs';
import { Dosages } from './dosage.interface';

@Component({
  selector: 'app-dosage',
  templateUrl: './dosage.component.html',
  styleUrls: [
    './dosage.component.css',
    '../../../assets/css/simple-datatables.css',
  ],
})
export class DosageComponent implements OnInit {
  dosages: Dosages[] = [];
  selectedDosage: Dosages = {} as Dosages;
  dosageForm = this.formBuilder.group({
    dosageName: [''],
    formulations: this.formBuilder.array([this.addFormulations()]),
  });

  formulations = this.dosageForm.get('formulations') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDosages();
  }

  addFormulations(): FormGroup {
    return this.formBuilder.group({
      formulationName: [null],
    });
  }

  addNewFormulations() {
    this.formulations.push(this.addFormulations());
    console.log(this.formulations);
  }

  addDosage() {
    this.selectedDosage = {} as Dosages;
    this.dosageForm.reset();
  }

  getDosages() {
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosages = [...dosages];
    });
  }

  saveDosage() {
    console.log(this.dosageForm.value);
    const newDosage: any = {
      dosageName: this.dosageForm.get('dosageName')!.value,
      formulations: [
        {
          formulationId: 4,
          formulationName: 'Tablet',
          dosageId: 0,
        },
      ],
    };
    if (Object.keys(this.selectedDosage).length === 0) {
      console.log('create');
      this.dosageService
        .saveDosage(newDosage)
        .pipe(
          finalize(() => {
            this.closeButton.nativeElement.click();
            this.getDosages();
          })
        )
        .subscribe(() => {});
    } else {
      console.log('update');
      this.selectedDosage = {
        ...this.selectedDosage,
        dosageName: this.dosageForm.get('dosageName')!.value,
      };
      this.dosageService
        .updateDosage(this.selectedDosage)
        .pipe(
          finalize(() => {
            this.closeButton.nativeElement.click();
            this.getDosages();
          })
        )
        .subscribe(() => {});
    }
  }

  selectProduct(product: Dosages) {
    this.selectedDosage = product;
    this.dosageForm.patchValue({ dosageName: product.dosageName });
  }

  confirmProductDeletetion(product: Dosages) {
    this.selectedDosage = product;
  }

  deleteDosage() {
    this.dosageService
      .deleteDosage(this.selectedDosage.dosageId)
      .pipe(
        finalize(() => {
          this.closeDeleteButton.nativeElement.click();
          this.getDosages();
        })
      )
      .subscribe(() => {});
  }
}
