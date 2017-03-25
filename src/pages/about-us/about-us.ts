import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
    selector: 'page-about-us',
    templateUrl: 'about-us.html'
})
export class AboutUsPage {

    constructor(private navCtrl: NavController, private navParams: NavParams, private auth: AuthService) { }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AboutUsPage');
    }
}
