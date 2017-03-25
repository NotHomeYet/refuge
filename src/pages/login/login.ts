import { Component } from '@angular/core';
import { NavController, NavParams, Alert } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthState } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ItemLoader } from '../../providers/item-loader';
import { HomePage } from '../../pages/home/home';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage {

    loginForm: FormGroup;
    submitted = false;
    message = "";

    constructor(private navCtrl: NavController, private navParams: NavParams,
      private auth: AuthService, private af: AngularFire, private form: FormBuilder) {
        this.loginForm = form.group({
            email: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        });
    }

    private loggedInSuccess(r: FirebaseAuthState) {
        console.log("I'm in: " + r.uid);

        //Save off our user
        var l = new ItemLoader(this.af);
        l.cacheItem('/userDetails/' + r.uid, (i) => {
          l.updateItem('email', this.auth.userEmail(r));
          l.updateItem('displayName', this.auth.userDisplayName(r));
          l.updateItem('photoURL', this.auth.userPhotoURL(r) || "./assets/img/foundry.png");
          this.navCtrl.setRoot(HomePage);
        });
    }

    // This is called on form submit
    emailPass() {
        var parent = this;
        parent.submitted = true;
        parent.message = "";

        var email = parent.loginForm.controls['email'];
        var password = parent.loginForm.controls['password'];
        if (email.valid && password.valid) {
            try {
                console.log("Logging in with: " + email.value + ", " + password.value);
                parent.auth.signIn(email.value, password.value)
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

    resetPassword() {
        var parent = this;
        parent.message = "";

        var email = parent.loginForm.controls['email'];
        if (email.valid) {
            try {
                parent.setMessage("A password reset email has been sent!");
                parent.auth.resetPasswordEmail(email.value);
            } catch (e) {
                parent.setMessage(e.message);
            }
        } else {
            parent.setMessage("Please enter a valid email address");
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
