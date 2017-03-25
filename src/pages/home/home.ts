import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { PageBoxes } from '../../providers/page-boxes';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  public box: any;
  public challengeType: string;

  public b: PageBoxes;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private auth: AuthService, private af: AngularFire, private alterer: AlertController) {
    this.b = new PageBoxes(af, alterer, "homePage");
    this.box = {};
  }

  update(ub: any) {
    this.box = ub;
    this.box.challenges = this.getChallenges(this.box.challenges);
  }

  addNewChallenge() {
    console.log("Adding new challenge of type: " + this.challengeType);
    this.box.challenges = this.box.challenges || [];

    var c = { type: this.challengeType };
    if (this.challengeType !== 'v' ) {
      var us = {};
      us[this.auth.userId] = false;
      c['userState'] = us;
      c['points'] = 1;
    }
    this.box.challenges.push(c);
    this.challengeType = null;
  }

  removeChallenge(c: any) {
    for (var i = this.box.challenges.length; i--;) {
      var ch = this.box.challenges[i];
      if (ch === c) {

        //If this is keyed, remove the key item
        if (this.box.$key && ch.$key) {
          var list = this.af.database.list(this.b.ref + '/' + this.box.$key + "/challenges");
          list.remove(ch.$key);
        }

        this.box.challenges.splice(i, 1);
      }
    }
  }

  getChallenges(c: any): any[] {
    if (!c) return [];

    var a = [];
    Object.keys(c).forEach(function(key, index) {
      if (key !== null) c[key].$key = key;
      a.push(c[key]);
    });
    return a;
  }

  save() {
    var box = this.box;
    var e = {
      title: box.title,
      content: box.content,
      date: box.date,
      time: (Date.parse(box.date) + (new Date().getTimezoneOffset() * 60 * 1000)),
    }

    if (box.$key) {
      this.b.updateBox(box.$key, e).then(r => {
        this.saveChallenges(box.challenges, box.$key);
      });
    }
    else {
      this.b.addBox(e).then(r => {
        this.saveChallenges(box.challenges, r.key);
      });
    }
    this.box = {};
  }

  saveChallenges(challenges: any[], key: string) {
    if (challenges) {
      var list = this.af.database.list(this.b.ref + '/' + key + "/challenges");

      //Save what we have
      challenges.forEach(e => {
        var c = {
          title: e.title,
          type: e.type,
        };
        if (e.points) c['points'] = +e.points;
        if (e.userState) {
          c['userState'] = e.userState;
        }

        if (e.$key) list.update(e.$key, c);
        else list.push(c);
      });

      //New remove any hangers
      list.forEach(dbc =>{
        for (var i = 0; i < dbc.length; i++){
          if (i >= challenges.length) {
            list.remove(dbc[i]);
          }
        }
      });
    }
  }

  setUserDidChallenge(key: string, c: any) {
    //todo: noah - replace this with an item loader
    var obj = this.af.database.object(this.b.ref + '/' + key + "/challenges/" + c.$key
    + "/userState/" + this.auth.userId);

    var state = c.userState[this.auth.userId] || false;
    obj.set(state);

    if (c.points) {
      var p = +c.points;
      if (!state) p = -1*p;
      if (p !== 0) {
        console.log("Adding: " + p + "points");
        this.auth.addPoints(p);
      }
    }
  }
}
