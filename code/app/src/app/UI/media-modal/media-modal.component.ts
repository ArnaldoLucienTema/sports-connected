import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Media } from '../../_models/media';

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaModalComponent implements OnInit {

  // @ViewChild('titleTextarea') titleTextarea: ElementRef;
  // @ViewChild('descriptionTextarea') descriptionTextarea: ElementRef;
  media: Media;
  text: string;
  title: string;
  attachments = [];
  // @Input() media: Media;
  
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    console.log('modal', {this: this, text: this.text});
  }

}
