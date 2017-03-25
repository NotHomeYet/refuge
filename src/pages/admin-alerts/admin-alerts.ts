import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FCMPushService } from '../../providers/fcm-service';
import { AuthService } from '../../providers/auth-service';

import { AppFooter, AppUser } from '../../pages/common';

/*
  Generated class for the AdminAlerts page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin-alerts',
  templateUrl: 'admin-alerts.html'
})
export class AdminAlertsPage {

  alertForm: FormGroup;
  submitted = false;
  message = "";

  public topic: string;
  public subject: string;
  public text: string;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private form: FormBuilder, private push: FCMPushService, private alerter: AlertController) {
    this.alertForm = form.group({
        topic: ['', Validators.compose([Validators.nullValidator])],
        subject: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        text: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  send() {
    this.message = "";
    this.submitted = true;

    if (this.alertForm.valid) {
      this.push.sendAlert(this.subject, this.text, this.topic, success=>{
        if (success){
          this.submitted = false;
          this.topic = null;
          this.subject = null;
          this.text = null;

          this.alerter.create({
            title: 'Notification Success',
            message: 'Message sent with success! It may take some time to show up!',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              },
            ]
          }).present();
        } else {
          this.setMessage("Message not sent - unexpected error!");
        }
      });
    }
    else {
      this.setMessage("Message not sent - please correct the above input and try again.");
    }
  }

  private setMessage(m) {
      console.log(m);
      if (!m || m.length > 200) {
          this.message = "An unexpected error occured, please try again";
      }
      else {
          this.message = m;
      }
  }
}
