import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.html'
})
export class AppFooter {
    constructor(private auth: AuthService, private n: NavController) { }

    gotToPrivacy() {
        this.n.push(PrivacyPolicyPage);
    }
}
