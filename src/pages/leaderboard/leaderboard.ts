import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';

/*
  Generated class for the Leaderboard page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-leaderboard',
  templateUrl: 'leaderboard.html'
})
export class LeaderboardPage {

  private tl: ListLoader;
  private il: ListLoader;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private auth: AuthService, private af: AngularFire) {
    this.tl = new ListLoader(af);
    this.tl.cacheList('/userTeams');

    this.il = new ListLoader(af);
    this.il.cacheList("/userDetails");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeaderboardPage');
  }

  get teamScore(): any[] {
    var map = {};
    if (this.il.list && this.tl.list) {
      for (var i = 0; i < this.tl.list.length; i++) {
        var team = this.tl.list[i];
        var p = +(team.points || 0);

        for (var j = 0; j < this.il.list.length; j++) {
          var user = this.il.list[j];
          if (user.team === team.$key) {
            p += +(user.points || 0);
          }
        }

        if (p === 0) continue;

        if (map[p]) {
          map[p] = map[p] + ", " + team.name;
        }
        else {
          map[p] = team.name;
        }
      }
    }

    return this.convertMap(map, 5);
  }

  get individualScore(): any[] {
    var map = {};
    if (this.il.list) {
      for (var i = 0; i < this.il.list.length; i++) {
        var user = this.il.list[i];
        var p = +(user.points || 0);

        if (p === 0) continue;

        if (map[p]) {
          map[p] = map[p] + ", " + user.displayName;
        }
        else {
          map[p] = user.displayName;
        }
      }
    }

    return this.convertMap(map, 10);
  }

  convertMap(map: any, max: number): any[] {
    var keys = Object.keys(map);
    if (keys.length === 0) return [{ rank: "No scores here yet!" }];

    keys = keys.reverse().slice(0, max);
    console.log(JSON.stringify(map) + ", " + JSON.stringify(keys));

    var r = [];
    for (var i = 0; i < keys.length; i++) { // now lets iterate in sort order
      r[i] = { rank: ((i + 1) + ") Points: " + keys[i]), name: map[keys[i]] };
    }
    return r;
  }
}
