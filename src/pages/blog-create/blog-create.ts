import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ItemLoader } from '../../providers/item-loader';
import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';

/*
  Generated class for the BlogCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-blog-create',
  templateUrl: 'blog-create.html'
})
export class BlogCreatePage {

  public title: string;
  public text: string;
  public UUID: string;
  public team: string;
  public isGlobal: boolean;

  public id: string;
  private l: ItemLoader;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private af: AngularFire, private auth: AuthService) {

    this.id = navParams.get('id');
    this.title = navParams.get('title');
    this.text = navParams.get('text');
    this.UUID = navParams.get('UUID');
    this.isGlobal = navParams.get('isGlobal') || false;
    this.team = navParams.get('team');

    this.l = new ItemLoader(af);
    if (this.id) {
      var ref = this.isGlobal ? ('global/' + this.id)
        : (this.team + '/' + this.id);
      this.l.cacheItem('/blogs/' + ref);
    }
  }

  saveBlog() {
    var blog = {
      title: this.title,
      text: this.text,
      time: (0 - new Date().getTime()),
      UUID: this.UUID,
      isGlobal: this.isGlobal
    };

    if (this.id) {
      this.l.updateItemMap(blog);
      this.navCtrl.pop();
    }
    else {
      var ll = new ListLoader(this.af);
      ll.cacheList('/blogs/' + (this.isGlobal ? 'global' : this.team));

      ll.obs.push(blog).then(r => {
        this.navCtrl.pop();
      });
    }
  }
}
