import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AngularFire, AuthProviders } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { AppFooter, AppUser } from '../../pages/common';

@Component({
    selector: 'page-user-account',
    templateUrl: 'user-account.html'
})
export class UserAccountPage {

    public user: any;
    private userForm: FormGroup;
    private submitted = false;
    private message = "";

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private auth: AuthService, private form: FormBuilder) {
        this.user = {
            displayName: this.auth.displayName,
            email: this.auth.email,
            photoURL: this.auth.photoURL
        };

        this.userForm = form.group({
            email: [this.user.email, Validators.compose([Validators.required, Validators.minLength(6)])],
            displayName: [this.user.displayName, Validators.compose([Validators.required, Validators.minLength(2)])],
            photoURL: [this.user.photoURL, Validators.compose([Validators.required, Validators.minLength(2)])],
            newPassword: ['', Validators.compose([Validators.minLength(6)])],
        });
    }

    saveSettings() {
        var parent = this;
        parent.submitted = true;
        parent.message = "";

        if (parent.userForm.valid) {
            try {
                var email = parent.userForm.controls['email'].value;
                if (parent.auth.email !== email) {
                    console.log("Updating email to: " + email + ", from " + parent.auth.email);
                    parent.auth.updateEmail(email);
                }
                var displayName = parent.userForm.controls['displayName'].value;
                if (parent.auth.displayName !== displayName) {
                    console.log("Updating display name to: " + displayName + ", from " + parent.auth.displayName);
                    parent.auth.updateDisplayName(displayName);
                }
                var photoURL = parent.userForm.controls['photoURL'].value;
                if (parent.auth.photoURL !== photoURL) {
                    console.log("Updating photoURL to: " + photoURL + ", from " + parent.auth.photoURL);
                    parent.auth.updatePhotoURL(photoURL);
                }
                var newPassword = parent.userForm.controls['newPassword'].value;
                if (newPassword) {


                    console.log("Updating password: " + newPassword);
                    //todo: reauth to do this
                    parent.auth.setPassword(newPassword);
                }
            } catch (e) {
                parent.setMessage(e.message);
            }
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
