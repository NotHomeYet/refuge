import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class ListLoader {

  public list: any[];
  public obs: FirebaseListObservable<any>;
  private sub: any;

  constructor(private af: AngularFire) {}

  cacheList(p: string, top: number = 100, order: string = null, equalTo: any = null) {
    var q = {
      limitToFirst: top
    };
    if (order) {
      q['orderByChild'] = order;
    }
    if(equalTo) {
      q['equalTo'] = equalTo;
    }

    this.obs = this.af.database.list(p, {query: q});
    this.sub = this.obs.subscribe(l=>{
      this.list = l;
    });
  }

  updateItem(item: any, k: string, v: any){
    if (this.obs){
      var map = {};
      map[k] = v;
      console.log(JSON.stringify(item) + ", updating: " + map);
      this.obs.update(item.$key, map).catch(e=>{
        console.log("Unable to update item: " + JSON.stringify(item) + ", " + map);
      });
    } else{
      console.log(item + ", could not be updated, no obs");
    }
  }

  close(){
    if (this.sub){
      this.sub.unsubscribe();
      this.sub = null;
    }
    if (this.obs){
      this.obs = null;
    }
  }

  ngOnDestroy() {
    close();
  }
}
