/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';

import { DualListComponent } from './dual-list/dual-list.component';



@Component({
  selector: 'creative-root',
  styles: [
    '.form-group { margin-bottom: 16px; }',
    '.checkbox { margin-top: inherit }'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  tab = 1;
  keepSorted = true;
  key: string;
  display: string;
  filter = false;
  source: Array<any>;
  confirmed: Array<any>;
  userAdd = '';
  disabled = false;

  sourceLeft = true;
  format: any = DualListComponent.DEFAULT_FORMAT;

  private sourceFlavors: Array<any>;

  private confirmedFlavors: Array<any>;

  private flavors: Array<any> = [
    {key: 1,id:100,name:'Coke Part 1',label:'Coke I'},
    {key: 2,id:101,name:'Coke Part 2',label:'Coke II'},
    {key: 3,id:102,name:'Diet Coke Part 1',label:'Diet Coke I'},
    {key: 4,id:103,name:'Diet Coke Part 2',label:'Diet Coke II'},
    {key: 5,id:104,name:'Fanta',label:'Fanta'},
    {key: 6,id:105,name:'Sprite',label:'Sprite'},
    {key: 7,id:106,name:'Powerade',label:'Powerade'},
    {key: 8,id:107,name:'Lemon',label:'Lemon'}
  ];

  ngOnInit() {
    this.doReset();
  }

  private useFlavors() {
    this.key = 'key';
    this.display = 'label';
    this.keepSorted = true;
    this.source = this.sourceFlavors;
    this.confirmed = this.confirmedFlavors;
  }
  doReset() {
    this.sourceFlavors = JSON.parse(JSON.stringify(this.flavors));

    console.log(JSON.parse(JSON.stringify(this.flavors)))

    this.confirmedFlavors = new Array<any>();

    // Preconfirm some items.
    this.confirmedFlavors.push(this.flavors[2]);


    this.useFlavors();
  }

  filterBtn() {
    return this.filter ? 'Hide Filter' : 'Show Filter';
  }

  doDisable() {
    this.disabled = !this.disabled;
  }

  disableBtn() {
    return this.disabled ? 'Enable' : 'Disabled';
  }

  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft
      ? DualListComponent.LTR
      : DualListComponent.RTL;
  }
}
