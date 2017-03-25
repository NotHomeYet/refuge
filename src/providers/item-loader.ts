import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class ItemLoader {

  public item: any;
  public obs: FirebaseObjectObservable<any>;
  private sub: any;

  constructor(private af: AngularFire) { }

  cacheItem(p: string, onSub?: (value: any) => void) {
    this.obs = this.af.database.object(p);
    this.sub = this.obs.subscribe(i => {
      this.item = i;
      if (onSub) onSub(this.item);
    });
  }

  updateItem(k: string, v: any) {
    var map = {};
    map[k] = v;
    this.updateItemMap(map);
  }

  updateItemMap(map: any) {
    if (this.obs) {
      console.log(JSON.stringify(this.item) + ", updating: " + map);
      this.obs.update(map).catch(e => {
        console.log("Unable to update item: " + JSON.stringify(this.item) + ", " + map);
      });
    } else {
      console.log(this.item + ", could not be updated, no obs");
    }
  }

  close() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
    if (this.obs) {
      this.obs = null;
    }
  }

  ngOnDestroy() {
    close();
  }
}
