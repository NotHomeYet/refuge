import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire} from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ListLoader } from '../../providers/list-loader';

@Component({
    selector: 'page-blog-details',
    templateUrl: 'blog-details.html'
})
export class BlogDetailsPage {

    public c: string;

    private blog: any;
    private l: ListLoader;

    constructor(public navCtrl: NavController, public navParams: NavParams,
        private alertCtrl: AlertController, private af: AngularFire, private auth: AuthService) {
        this.blog = navParams.get('blog');
        this.l = new ListLoader(af);
        this.l.cacheList('/blogComments/' + this.blog.$key, 200, 'time');
    }

    getPhotoURL(box: any) : string {
      if (!box) return null;
      return this.auth.getDetails(box.UUID).photoURL;
    }

    getDisplayName(box: any) : string {
      if (!box) return null;
      return this.auth.getDetails(box.UUID).displayName;
    }

    get comments(): any[] {
        return this.l.list;
    }

    addComment() {
        this.l.obs.push({
            text: this.c,
            time: (new Date().getTime()),
            UUID: this.auth.userId
        });
        this.c = null;
    }

    deleteComment(comment: any) {
        console.log("Removing existing comment!");
        let alert = this.alertCtrl.create({
            title: 'Confirm Delete',
            message: 'Do you want to delete this entry?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.l.obs.remove(comment);
                    }
                }
            ]
        });
        alert.present();
    }
}
