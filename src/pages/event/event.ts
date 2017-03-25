import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ListLoader } from '../../providers/list-loader';
import { PageBoxes } from '../../providers/page-boxes';
import { EventDetailsPage } from '../../pages/event-details/event-details';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
    selector: 'page-event',
    templateUrl: 'event.html'
})
export class EventPage {

    public box: any

    private l: ListLoader
    private b: PageBoxes

    constructor(private navCtrl: NavController, private navParams: NavParams,
        private auth: AuthService, private af: AngularFire, private alterer: AlertController) {
        this.b = new PageBoxes(af, alterer, "eventPage", "time");
        this.box = {};
    }

    update(ub: any) {
        this.box = ub;
    }

    save() {
        var e = {
            title: this.box.title,
            content: this.box.content,
            date: this.box.date,
            time: (Date.parse(this.box.date) + (new Date().getTimezoneOffset() * 60 * 1000))
        }

        if (this.box.$key) {
            this.b.updateBox(this.box.$key, e);
        }
        else {
            this.b.addBox(e);
        }
        this.box = {};
    }
}
