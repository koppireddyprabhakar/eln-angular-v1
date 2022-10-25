import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, Subject } from 'rxjs';
import { Dosages } from './dosage.interface';

@Component({
  selector: 'app-dosage',
  templateUrl: './dosage.component.html',
  styleUrls: ['./dosage.component.css'],
})
export class DosageComponent implements OnInit {
  dosages: Dosages[] = [];
  selectedDosage: Dosages = {} as Dosages;
  dosageForm = this.formBuilder.group({
    dosageName: ['', [Validators.required]],
    formulations: this.formBuilder.array([this.addFormulations()]),
  });
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  loader = false;

  formulations = this.dosageForm.get('formulations') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  constructor(
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private toastr: ToastrService
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
    this.loader = true;
    this.dosageService.getDosages().subscribe((dosages) => {
      this.dosages = [...dosages];
      this.dtTrigger.next(this.dosages);
      this.loader = false;
    });
  }

  saveDosage() {
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
    if (this.dosageForm.get('dosageName')!.value) {
      if (Object.keys(this.selectedDosage).length === 0) {
        console.log('create');
        this.dosageService
          .saveDosage(newDosage)
          .pipe(
            finalize(() => {
              this.toastr.success(
                'Dosage has been added succesfully',
                'Success'
              );
              this.dtTrigger.unsubscribe();
              this.closeButton.nativeElement.click();
              this.getDosages();
              this.loader = false;
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
              this.toastr.success(
                'Dosage has been updated succesfully',
                'Success'
              );
              this.dtTrigger.unsubscribe();
              this.closeButton.nativeElement.click();
              this.getDosages();
              this.loader = false;
            })
          )
          .subscribe(() => {});
      }
    } else {
      this.dosageForm.get('dosageName')?.markAsDirty();
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
          this.toastr.success('Dosage has been deleted succesfully', 'Success');
          this.dtTrigger.unsubscribe();
          this.closeDeleteButton.nativeElement.click();
          this.getDosages();
          this.loader = false;
        })
      )
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
