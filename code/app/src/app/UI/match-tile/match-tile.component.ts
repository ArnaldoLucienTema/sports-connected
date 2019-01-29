import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatchViewModel } from '../../_models/match_viewmodel';

@Component({
  selector: 'ui-match-tile',
  templateUrl: './match-tile.component.html',
  styleUrls: ['./match-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchTileComponent implements OnInit {

  @Input() match: MatchViewModel;
  @ViewChild('homeTeam') homeTeam: ElementRef;
  @ViewChild('awayTeam') awayTeam: ElementRef;

  constructor(private _renderer: Renderer2) { }

  ngOnInit() {
    if (this.match.played) {
      if (this.match.home_team.goals > this.match.away_team.goals) {
        this._renderer.addClass(this.awayTeam.nativeElement, 'team-game-score--loser');
      } else if (this.match.home_team.goals < this.match.away_team.goals) {
        this._renderer.addClass(this.homeTeam.nativeElement, 'team-game-score--loser');
      } else {
        this._renderer.addClass(this.homeTeam.nativeElement, 'team-game-score--loser');
        this._renderer.addClass(this.awayTeam.nativeElement, 'team-game-score--loser');
      }
    }
  }

}
