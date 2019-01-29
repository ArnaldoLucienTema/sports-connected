import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ui-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() visible = true;

  constructor() { }

  ngOnInit() {
  }

}
