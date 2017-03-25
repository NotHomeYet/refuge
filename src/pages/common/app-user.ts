import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { ItemLoader } from '../../providers/item-loader';
import { UserAccountPage } from '../../pages/user-account/user-account';
import { LoginPage } from '../../pages/login/login';
import { AboutUsPage } from '../../pages/about-us/about-us';

@Component({
    selector: 'app-user',
    templateUrl: 'userbar.html'
})
export class AppUser {
    private isAdmin: boolean
    private isLeader: boolean

    constructor(private a: AuthService, private n: NavController) {
    }

    viewUserDetails() {
        this.n.push(UserAccountPage);
    }

    loginPage() {
        this.n.push(LoginPage);
    }

    aboutUsPage() {
        this.n.push(AboutUsPage);
    }
}
