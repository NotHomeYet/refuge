import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import *  as Config from '../config'

@Injectable()
export class FCMPushService {

  constructor(public http: Http) {
    console.log('Hello FCMService Provider');
  }

  //See: https://github.com/fechanique/cordova-plugin-fcm
  public sendAlert(title: string, body: string, topic: string,
    onSub?: (ok: boolean) => void) {

    if (!topic) {
      topic = 'all';
    }

    var json = {};
    json['notification'] = { title: title, body: body };
    json['to'] = '/topics/' + topic;
    json['priority'] = 'high';

    console.log("Sending: " + JSON.stringify(json));
    var headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'key=' + Config.FCM_API_KEY
    });

    try {
      this.http.post('https://fcm.googleapis.com/fcm/send', json,
        new RequestOptions({ headers: headers })).subscribe(resp => {
          console.log("Resp: " + JSON.stringify(resp));
          if (onSub) onSub(resp != null && resp.ok);
        });
    }
    catch (e) {
      console.log("Unexpected Error on send: " + e);
      if (onSub) onSub(false);
    }
  }
}
