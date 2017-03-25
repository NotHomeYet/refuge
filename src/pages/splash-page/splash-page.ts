import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState, FirebaseListObservable } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';

@Component({
    selector: 'page-splash-page',
    templateUrl: 'splash-page.html'
})
export class SplashPage {

    public user: any;
    public message: string;

    private password: string;
    private tl: ListLoader;
    private ll: ListLoader;

    constructor(private n: NavController, private p: NavParams, private af: AngularFire,
        private auth: AuthService) {
        this.tl = new ListLoader(af);
        this.tl.cacheList('/userTeams');

        this.ll = new ListLoader(af);
        this.ll.cacheList('/userDetails', 100, "class", "l");

        this.user = {};
    }

    loginPage() {
        this.n.push(LoginPage);
    }

    get teamList(): any[] {
        return this.tl.list;
    }

    facebook() {
        this.commonLogin(AuthProviders.Facebook, ['public_profile', 'email']);
    }

    google() {
        this.commonLogin(AuthProviders.Google, ['profile', 'email']);
    }

    twitter() {
        this.commonLogin(AuthProviders.Twitter, null);
    }

    private commonLogin(provider: AuthProviders, scope: string[]) {
        var parent = this;
        parent.message = "";

        try {
            console.log("Popup login in with: " + provider + ", scope: " + scope);
            parent.auth.signInWithPopup(provider, scope)
                .then(function(result) {
                    parent.loggedInSuccess(result);
                })
                .catch(function(e) {
                    parent.setMessage(e.message);
                });
        } catch (e) {
            parent.setMessage(e.message);
        }
    }

    emailPassCreate() {
        var parent = this;
        parent.message = "";

        try {
            console.log("Creating with: " + this.user.email + ", " + this.password);
            parent.auth.createNewUser(this.user.email, this.password)
                .then(function(result) {
                    parent.loggedInSuccess(result);
                })
                .catch(function(e) {
                    parent.setMessage(e.message);
                })
        } catch (e) {
            parent.setMessage(e.message);
        }
    }

    private loggedInSuccess(r: FirebaseAuthState) {
        console.log("I'm new! " + JSON.stringify(r));

        try {
            //Save off our user
            this.user['photoURL'] = this.auth.userPhotoURL(r) || "./assets/img/foundry.png";
            this.user['email'] = this.user['email'] ||  this.auth.userEmail(r);
            this.af.database.object('/userDetails/' + r.uid).update(this.user);
            r.auth.sendEmailVerification();
            this.n.setRoot(HomePage);
        }
        catch (e) {
            this.setMessage(e.message);
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
