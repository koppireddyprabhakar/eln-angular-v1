import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-create-formulation',
  templateUrl: './create-formulation.component.html',
  styleUrls: ['./create-formulation.component.css'],
})
export class CreateFormulationComponent implements OnInit {
  @ViewChild('inputfields') inputfields!: ElementRef;
  dummyTabs: any = [];
  inputValue: string;
  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    this.dummyTabs = [
      { label: 'Purpose and Conclusion', isEdit: false, value: 'primary' },
      { label: 'Formulation', isEdit: false, value: 'secondary' },
    ];
  }

  editMode(index) {
    console.log(index);
    console.log(this.inputfields);
    const d = this.dummyTabs.map((tab, i) => {
      if (i === index) {
        return { ...tab, isEdit: true };
      } else {
        return { ...tab, isEdit: false };
      }
    });
    this.dummyTabs = d;
  }

  resetEditMode(index, value) {
    console.log(index);
    const d = this.dummyTabs.map((tab, i) => {
      console.log(tab);

      return { ...tab, label: i === index ? value : tab.label, isEdit: false };
    });
    this.dummyTabs = d;

    let elemetClass = document.getElementById('summary-tab');
    this.renderer2.addClass(document.getElementById('summary-tab'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'active');
    this.renderer2.addClass(document.getElementById('summary'), 'show');
    console.log(document.getElementById('summary-tab'));
    console.log(document.getElementById('summary'));
  }

  addNew() {
    const length = this.dummyTabs.length;
    this.dummyTabs.push({
      label: `Add On - ${length + 1}`,
      isEdit: false,
      value: `newTab-${(length + 1).toString()}`,
    });
    console.log(this.dummyTabs);
  }
}
