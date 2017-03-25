import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFire} from 'angularfire2';

import { AuthService } from '../../providers/auth-service';
import { ListLoader } from '../../providers/list-loader';
import { AppFooter, AppUser } from '../../pages/common';
import { BlogCreatePage } from '../../pages/blog-create/blog-create';
import { BlogDetailsPage } from '../../pages/blog-details/blog-details';

@Component({
  selector: 'page-blog',
  templateUrl: 'blog.html'
})
export class BlogPage {

  public teamView: string
  private l: ListLoader;
  private g: ListLoader;

  //admin stuff
  private tl: ListLoader;

  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController,
    private auth: AuthService, private af: AngularFire) {
    this.teamView = this.auth.team;

    this.l = new ListLoader(af);
    this.setTeamFilter();

    this.g = new ListLoader(af);
    this.g.cacheList('/blogs/global', 10, 'time');

    //All teams
    this.tl = new ListLoader(af);
    this.tl.cacheList('/userTeams');
  }

  getPhotoURL(box: any): string {
    if (!box) return null;
    return this.auth.getDetails(box.UUID).photoURL;
  }

  getDisplayName(box: any): string {
    if (!box) return null;
    return this.auth.getDetails(box.UUID).displayName;
  }

  get teamList(): any[] {
    return this.tl.list;
  }

  setTeamFilter() {
    this.l.cacheList('/blogs/' + this.teamView, 20, 'time');
  }

  get blogs(): any[] {
    if (!this.l.list || !this.g.list) return [];
    var concat = this.l.list.concat(this.g.list);
    concat.sort((a, b) => {
      return a.time - b.time;
    });
    return concat;
  }

  blogDetails(blog: any) {
    if (!this.auth.authenticated) return;
    console.log("Viewing blog in depth");
    this.navCtrl.push(BlogDetailsPage, {
      blog: blog
    });
  }

  startNewBlog() {
    console.log("Creating a new blog!");
    this.navCtrl.push(BlogCreatePage, {
      UUID: this.auth.userId,
      team: this.teamView
    });
  }

  editBlog(blog: any) {
    console.log("Editing existing blog!");
    this.navCtrl.push(BlogCreatePage, {
      id: blog.$key,
      title: blog.title,
      text: blog.text,
      UUID: this.auth.userId,
      team: this.teamView,
      isGlobal: blog.isGlobal
    });
  }

  deleteBlog(blog: any) {
    console.log("Removing existing blog!");
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
            this.l.obs.remove(blog);
          }
        }
      ]
    });
    alert.present();
  }
}
