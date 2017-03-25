import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AngularFire, AngularFireAuth, FirebaseAuthState, AuthProviders, AuthMethods } from 'angularfire2';

import * as firebase from 'firebase/app';

import { ItemLoader } from '../providers/item-loader';

@Injectable()
export class AuthService {

  //Firebase objects for auth
  private a: AngularFireAuth;
  private authState: FirebaseAuthState;

  //All user loader
  private ul: ItemLoader;

  constructor(private af: AngularFire, private e: Events) {
    this.a = af.auth;
    this.authState = this.a.getAuth();

    //Get this user's details
    this.a.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if (this.authenticated) {
        this.e.publish('user:login');
      }
      else {
        this.e.publish('user:logout');
      }
    });

    //Get all user details
    this.ul = new ItemLoader(af);
    this.ul.cacheItem('/userDetails');
  }

  resetPasswordEmail(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email);
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  public getDetails(userId: string): any {
    if (!this.ul || !this.ul.item) return null;
    return this.ul.item[userId];
  }

  get hasDetails(): boolean {
    return this.authenticated && this.getDetails(this.userId) !== null;
  }

  get userId(): string {
    if (this.authenticated) return this.authState.uid;
    return null;
  }

  get isAdmin(): boolean {
    if (this.hasDetails) return this.getDetails(this.userId).isAdmin;
    return false;
  }

  updateIsAdmin(b: boolean) {
    if (!this.hasDetails) return;
    var details = this.getDetails(this.userId);
    details['isAdmin'] = b;
    this.ul.updateItem(this.userId, details);
  }

  get points(): number {
    if (this.hasDetails) return +(this.getDetails(this.userId).points || 0);
    return 0;
  }

  addPoints(p: number) {
    if (!this.hasDetails) return;
    var details = this.getDetails(this.userId);
    details['points'] = +this.points + +p;
    this.ul.updateItem(this.userId, details);
  }

  get isTeamLeader(): boolean {
    if (this.hasDetails) return this.getDetails(this.userId).class === 'l';
    return false;
  }

  updateUserClass(c: string) {
    if (!this.hasDetails) return;
    var details = this.getDetails(this.userId);
    details['class'] = c;
    this.ul.updateItem(this.userId, details);
  }

  get email(): string {
    if (this.hasDetails) return this.getDetails(this.userId).email;
    return this.userEmail(this.authState);
  }

  updateEmail(e: string) {
    if (!this.authenticated) return;
    var details = this.getDetails(this.userId);
    details['email'] = e;
    this.ul.updateItem(this.userId, details);
    return this.authState.auth.updateEmail(e);
  }

  get displayName(): string {
    if (this.hasDetails) return this.getDetails(this.userId).displayName;
    return this.userDisplayName(this.authState);
  }

  updateDisplayName(newName: string) {
    if (!this.authenticated) return;
    var details = this.getDetails(this.userId);
    details['displayName'] = newName;
    this.ul.updateItem(this.userId, details);
    return this.authState.auth.updateProfile({
      displayName: newName,
      photoURL: this.authState.auth.photoURL
    });
  }

  get team(): string {
    if (this.hasDetails) return this.getDetails(this.userId).team;
    return null;
  }

  updateTeam(oldTeam: string, newTeam: string) {
    if (!this.authenticated || oldTeam === newTeam) return;
    var details = this.getDetails(this.userId);
    details['team'] = newTeam;
    this.ul.updateItem(this.userId, details);
  }

  get photoURL(): string {
    if (this.hasDetails) return this.getDetails(this.userId).photoURL;
    return this.userPhotoURL(this.authState) || './assets/img/foundry.png';
  }

  updatePhotoURL(newURL: string) {
    if (!this.authenticated) return;
    var details = this.getDetails(this.userId);
    details['photoURL'] = newURL;
    this.ul.updateItem(this.userId, details);
    return this.authState.auth.updateProfile({
      displayName: this.authState.auth.displayName,
      photoURL: newURL
    });
  }

  get friendlyName(): string {
    return this.displayName || this.email || "[Guest User]";
  }

  signInWithPopup(provider: AuthProviders, sc: string[]): firebase.Promise<FirebaseAuthState> {
    if (this.authenticated) this.signOut();
    if (!sc) return this.a.login({ provider: provider, method: AuthMethods.Popup });
    return this.a.login({ provider: provider, method: AuthMethods.Popup, scope: sc });
  }

  signIn(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    if (this.authenticated) this.signOut();
    return this.a.login({ email: email, password: password },
      { provider: AuthProviders.Password, method: AuthMethods.Password });
  }

  createNewUser(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    if (this.authenticated) this.signOut();
    return this.a.createUser({ email: email, password: password });
  }

  setPassword(password: string) {
    if (!this.authenticated) return;
    return this.authState.auth.updatePassword(password);
  }

  signOut(): void {
    this.a.logout();
  }

  userEmail(u: FirebaseAuthState): string {
    if (u) {
      if (u.auth.email) return u.auth.email;
      if (u.facebook) return u.facebook.email;
      if (u.google) return u.google.email;
      if (u.twitter) return u.twitter.email;
    }
    return null;
  }

  userDisplayName(u: FirebaseAuthState): string {
    if (u) {
      if (u.auth.displayName) return u.auth.displayName;
      if (u.facebook) return u.facebook.displayName;
      if (u.google) return u.google.displayName;
      if (u.twitter) return u.twitter.displayName;
    }
    return null;
  }

  userPhotoURL(u: FirebaseAuthState): string {
    if (u) {
      if (u) return u.auth.photoURL;
      if (u) return u.facebook.photoURL;
      if (u) return u.google.photoURL;
      if (u) return u.twitter.photoURL;
    }
    return null;
  }
}
