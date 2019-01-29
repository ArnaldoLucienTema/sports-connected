import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatchViewModel } from '../../_models/match_viewmodel';

@Component({
  selector: 'ui-tiny-match-tile',
  templateUrl: './tiny-match-tile.component.html',
  styleUrls: ['./tiny-match-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TinyMatchTileComponent implements OnInit {

  @Input() match: MatchViewModel;

  constructor() { }

  ngOnInit() {
  }

}
