import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { HomePage } from '../../pages/home/home';
import { PageBoxes } from '../../providers/page-boxes';
import { AuthService } from '../../providers/auth-service';
import { AppFooter, AppUser } from '../../pages/common';

/*
  Generated class for the ContactUs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html'
})
export class ContactUsPage {

  public subject: string;
  public text: string;

  private b: PageBoxes;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private alerter: AlertController, private auth: AuthService, private af: AngularFire) {
    this.b = new PageBoxes(af, alerter, 'messages');
  }

  save() {
    var b = {
      subject: this.subject,
      text: this.text,
      time: (0 - new Date().getTime()),
      UUID: this.auth.userId
    };

    var parent = this;
    parent.b.addBox(b).then(r => {
      let alert = parent.alerter.create({
        title: 'Sent!',
        message: 'The message has been sent!',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              parent.navCtrl.setRoot(HomePage);
            }
          }
        ]
      });
      alert.present();
    });
  }
}
