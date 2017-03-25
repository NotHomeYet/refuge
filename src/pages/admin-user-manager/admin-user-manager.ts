import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
    selector: 'page-admin-user-manager',
    templateUrl: 'admin-user-manager.html'
})
export class AdminUserManagerPage {

    public findUser: string = "";
    public findUserClass: string = "";

    private l: ListLoader;
    private tl: ListLoader;

    constructor(public navCtrl: NavController, public navParams: NavParams, private af: AngularFire) {
        this.l = new ListLoader(af);
        this.l.cacheList('/userDetails');

        this.tl = new ListLoader(af);
        this.tl.cacheList('/userTeams');
    }

    get userList(): any[] {
        var filtered = this.l.list;
        if (this.findUserClass && this.findUserClass !== '') {
            filtered = filtered.filter(item => item.class.indexOf(this.findUserClass) !== -1);
        }
        if (this.findUser && this.findUser !== '') {
            filtered = filtered.filter(item => item.displayName.indexOf(this.findUser) !== -1
                || item.email.indexOf(this.findUser) !== -1);
        }
        return filtered;
    }

    setUserClass(item: any) {
        this.l.updateItem(item, 'class', item.class);
    }

    get teams() : any[] {
      return this.tl.list;
    }

    setUserTeam(item: any) {
        this.l.updateItem(item, 'team', item.team);
    }

    setUserPoints(item: any) {
        this.l.updateItem(item, 'points', +item.points);
    }
}
