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
import { finalize, Subject, takeUntil, takeWhile } from 'rxjs';
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
      { key: 'formulations', title: 'Formulations' },
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
          formulations: 'Capsules, Tablets, Formula1',
          status: 'Active',
        }));
        this.dosages = newDosagesList;
        this.globalService.hideLoader();
      });
  }

  saveDosage() {
    this.globalService.showLoader();
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
          formulations: [
            {
              formulationName: 'string',
              dosageId: 0,
            },
          ], //change later
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

  ngOnDestroy(): void {
    this.subscribeFlag = false;
  }
}
