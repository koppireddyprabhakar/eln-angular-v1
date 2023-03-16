import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DosageService } from '@app/shared/services/dosage/dosage.service';
import { GlobalService } from '@app/shared/services/global/global.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, finalize, takeWhile } from 'rxjs';
import { Dosages } from './dosage.interface';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dosage',
  templateUrl: './dosage.component.html',
  styleUrls: ['./dosage.component.css'],
})
export class DosageComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dosages: Dosages[] = [];
  selectedDosage: Dosages = {} as Dosages;
  subscribeFlag = true;
  dosageForm = this.formBuilder.group({
    dosageName: ['', [Validators.required]],
    formulations: this.formBuilder.array([this.addFormulations()]),
  });

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions = {
    pagingType: 'full_numbers',
  };
  formulations = this.dosageForm.get('formulations') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;

  public showErrorMsg: boolean = false;

  constructor(
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getDosages();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
  }

  addFormulations(): FormGroup {
    return this.formBuilder.group({
      formulationName: [null],
      formulationId: [null],
    });
  }

  addNewFormulations() {
    this.formulations.push(this.addFormulations());
  }

  addDosage() {
    this.showErrorMsg = false;
    this.formulations.clear();
    this.addNewFormulations();
    this.selectedDosage = {} as Dosages;
    this.dosageForm.reset();
  }

  getDosages() {
    this.globalService.showLoader();
    this.dosageService
      .getDosages()
      .pipe(takeWhile(() => this.subscribeFlag))
      .subscribe((dosages) => {
        const newDosagesList = dosages.map((dosage: any) => ({
          ...dosage,
          formulationsList: dosage.formulations.map(
            (dosage) => dosage.formulationName
          ),
        }));
        this.dosages = [...newDosagesList];
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.dosages);
        });
        this.globalService.hideLoader();
      });
  }

  saveDosage() {

    this.showErrorMsg = false;
    let dosageName = this.dosageForm.get('dosageName')!.value;

    let filteredDosages = this.dosages.filter(p => p.dosageName === dosageName);

    if (filteredDosages && filteredDosages.length === 1 && this.selectedDosage && !this.selectedDosage.dosageId) {
      this.showErrorMsg = true;
      return;
    } else if (filteredDosages && filteredDosages.length > 1 && this.selectedDosage && this.selectedDosage.dosageId) {
      this.showErrorMsg = true;
      return;
    }

    if (this.dosageForm.get('dosageName')!.value) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedDosage).length === 0) {
        const newDosage: any = {
          dosageName: this.dosageForm.get('dosageName')!.value,
          formulations: this.formulations.value,
        };
        this.dosageService
          .saveDosage(newDosage)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getDosages();
            this.closeButton.nativeElement.click();
            this.toastr.success(
              'Dosage has been updated succesfully',
              'Success'
            );
          });
      } else {
        this.selectedDosage = {
          ...this.selectedDosage,
          dosageName: this.dosageForm.get('dosageName')!.value,
        };
        this.dosageService
          .updateDosage(this.selectedDosage)
          .pipe(
            takeWhile(() => this.subscribeFlag),
            finalize(() => {
              this.globalService.hideLoader();
            })
          )
          .subscribe(() => {
            this.getDosages();
            this.toastr.success(
              'Dosage has been updated succesfully',
              'Success'
            );
            this.closeButton.nativeElement.click();
          });
      }
    } else {
      this.dosageForm.get('dosageName')?.markAsDirty();
    }
  }

  selectProduct(product: Dosages) {
    this.selectedDosage = {} as Dosages;
    this.selectedDosage = product;
    this.showErrorMsg = false;
    this.formulations.clear();
    this.dosageForm.patchValue({ dosageName: product.dosageName });
    this.selectedDosage.formulations.forEach((formulation, index) => {
      this.formulations.push(this.addFormulations());
      this.formulations.at(index).patchValue({
        formulationName: formulation.formulationName,
        formulationId: formulation.formulationId,
      });
    });
  }

  confirmProductDeletetion(dosage: Dosages) {
    this.selectedDosage = dosage;
  }

  deleteDosage() {
    this.selectedDosage = { ...this.selectedDosage, status: 'Inactive' };
    this.dosageService
      .deleteDosage(this.selectedDosage)
      .pipe(
        takeWhile(() => this.subscribeFlag),
        finalize(() => {
          this.globalService.hideLoader();
        })
      )
      .subscribe(() => {
        this.getDosages();
        this.closeDeleteButton.nativeElement.click();
        this.toastr.success('Dosage has been deleted succesfully', 'Success');
      });
  }

  deleteFormulation(index, id) {
    this.formulations.removeAt(index);
    const formIndex = this.selectedDosage.formulations.findIndex(
      (formulae) => formulae.formulationId === id
    );
    this.selectedDosage.formulations[formIndex].status = 'Inactive';
  }

  onChange(index, event, id) {
    if (!id) {
      this.selectedDosage.formulations.push(this.formulations.controls[index].value);
    } else {
      this.selectedDosage.formulations[index].formulationName = event.target && event.target.value;
      this.selectedDosage.formulations[index].status = 'Active';
    }
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
