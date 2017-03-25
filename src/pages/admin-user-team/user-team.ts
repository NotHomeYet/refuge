import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';
/*
  Generated class for the UserTeam page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-admin-user-team',
    templateUrl: 'user-team.html'
})
export class AdminUserTeamPage {

    public team: any;

    private tl: ListLoader;
    private ll: ListLoader;
    private sl: ListLoader;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private alertControl: AlertController, private af: AngularFire) {
        this.tl = new ListLoader(af);
        this.tl.cacheList('/userTeams');

        this.ll = new ListLoader(af);
        this.ll.cacheList('/userDetails', 100, "class", "l");

        this.sl = new ListLoader(af);
        this.sl.cacheList('/userDetails', 1000, "class", "s");

        this.team = {};
    }

    get teamList(): any[] {
        return this.tl.list;
    }

    get teamLeadUsers(): any[] {
        return this.ll.list;
    }

    getStudentsOnTeam(team: any): any[] {
        if (!this.sl.list) return null;
        return this.sl.list.filter(item => item.team && item.team.indexOf(team.$key) !== -1) || [];
    }

    getLeaderNames(team: any): any[]{
        if (!this.ll.list) return null;
        return this.ll.list.filter(item => item.team && item.team.indexOf(team.$key) !== -1) || [];
    }

    deleteTeam(team: any) {
        console.log("Removing existing entry!");
        let alert = this.alertControl.create({
            title: 'Confirm Delete',
            message: 'Do you want to delete this entry?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.tl.obs.remove(team);
                    }
                }
            ]
        });
        alert.present();
    }

    editTeam(team: any) {
        this.team = team;
    }

    saveTeam() {
        if (this.team.$key) {
            this.tl.updateItem(this.team, "name", this.team.name);
            this.tl.updateItem(this.team, "points", +this.team.points);
        } else {
            this.tl.obs.push(this.team);
        }
        this.team = {};
    }
}
