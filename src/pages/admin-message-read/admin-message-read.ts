import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { PageBoxes } from '../../providers/page-boxes';
import { AuthService } from '../../providers/auth-service';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
  selector: 'page-admin-message-read',
  templateUrl: 'admin-message-read.html'
})
export class AdminMessageReadPage {

  private b: PageBoxes;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private alerter: AlertController, private auth: AuthService, private af: AngularFire) {
    this.b = new PageBoxes(af, alerter, 'messages', 'time');
  }

  getPhotoURL(box: any) : string {
    return this.auth.getDetails(box.UUID).photoURL;
  }

  getDisplayName(box: any) : string {
    return this.auth.getDetails(box.UUID).displayName;
  }
}
