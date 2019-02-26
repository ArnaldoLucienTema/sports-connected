import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-endorcement-modal',
  templateUrl: './endorcement-modal.component.html',
  styleUrls: ['./endorcement-modal.component.scss']
})
export class EndorcementModalComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
