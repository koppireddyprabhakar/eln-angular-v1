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
import { finalize, takeWhile } from 'rxjs';
import { Dosages } from './dosage.interface';

@Component({
  selector: 'app-dosage',
  templateUrl: './dosage.component.html',
  styleUrls: ['./dosage.component.css'],
})
export class DosageComponent implements OnInit {
  dosages: Dosages[] = [];
  selectedDosage: Dosages = {} as Dosages;
  subscribeFlag = true;
  dosageForm = this.formBuilder.group({
    dosageName: ['', [Validators.required]],
    formulations: this.formBuilder.array([this.addFormulations()]),
  });

  columns: any = [];
  options: any = {};

  formulations = this.dosageForm.get('formulations') as FormArray;

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('closeDeleteButton') closeDeleteButton: ElementRef;
  @ViewChild('actionTpl', { static: true }) actionTpl: TemplateRef<any>;

  constructor(
    private readonly dosageService: DosageService,
    private readonly formBuilder: FormBuilder,
    private readonly globalService: GlobalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getDosages();
    this.columns = [
      { key: 'dosageName', title: 'Dosage Name' },
      { key: 'formulationsList', title: 'Formulations' },
      { key: 'status', title: 'Status' },
      {
        key: 'options',
        title: '<div class="blue">Options</div>',
        align: { head: 'center', body: 'center' },
        sorting: false,
        width: 80,
        cellTemplate: this.actionTpl,
      },
    ];
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
          status: 'Active',
        }));
        console.log(newDosagesList);
        this.dosages = newDosagesList;
        this.globalService.hideLoader();
      });
  }

  saveDosage() {
    const newDosage: any = {
      dosageName: this.dosageForm.get('dosageName')!.value,
      formulations: this.formulations.value,
    };
    console.log(newDosage);
    if (this.dosageForm.get('dosageName')!.value) {
      this.globalService.showLoader();
      if (Object.keys(this.selectedDosage).length === 0) {
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
          formulations: this.formulations.value.map((formula, index) => {
            if (this.selectedDosage.formulations[index]?.formulationId) {
              return {
                formulationName: formula.formulationName,
                formulationId:
                  this.selectedDosage.formulations[index]?.formulationId || 0,
                dosageId: this.selectedDosage.dosageId,
              };
            } else {
              return {
                formulationName: formula.formulationName,
              };
            }
          }),
        };
        console.log(this.selectedDosage);
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
    this.selectedDosage = product;
    this.formulations.clear();
    console.log(this.formulations.value);
    this.dosageForm.patchValue({ dosageName: product.dosageName });
    this.selectedDosage.formulations.forEach((formulation, index) => {
      console.log(formulation);
      this.formulations.push(this.addFormulations());
      this.formulations
        .at(index)
        .patchValue({ formulationName: formulation.formulationName });
    });
  }

  confirmProductDeletetion(product: Dosages) {
    this.selectedDosage = product;
  }

  deleteDosage() {
    this.dosageService
      .deleteDosage(this.selectedDosage.dosageId)
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

  deleteFormulation(index) {
    this.formulations.removeAt(index);
  }

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
