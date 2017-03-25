import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

import { ListLoader } from '../providers/list-loader';

/*
  Generated class for the PageBoxes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PageBoxes {

  public ref: string;
  private l: ListLoader;

  constructor(private af: AngularFire, private alerter: AlertController,
    private pageName: string, private filter: string = null) {
    this.l = new ListLoader(af);
    this.ref = '/pageBoxes/' + pageName;
    this.l.cacheList(this.ref, 100, filter);
  }

  get boxes(): any[] {
    return this.l.list;
  }

  addBox(box: any){
      return this.l.obs.push(box);
  }

  updateBox(key:any, box: any){
    return this.l.obs.update(key, box);
  }

  deleteBox(box: any){
    console.log('Removing existing item: ' + JSON.stringify(box));
    let alert = this.alerter.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete this item?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked - not removed: ' + JSON.stringify(box));
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.l.obs.remove(box);
          }
        }
      ]
    });
    alert.present();
  }
}
