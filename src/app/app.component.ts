import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar, Splashscreen, InAppBrowser } from 'ionic-native';

import { AuthService } from '../providers/auth-service';

import { AdminUserManagerPage } from '../pages/admin-user-manager/admin-user-manager';
import { AdminUserTeamPage } from '../pages/admin-user-team/user-team';
import { AdminMessageReadPage } from '../pages/admin-message-read/admin-message-read';
import { AdminAlertsPage } from '../pages/admin-alerts/admin-alerts';
import { HomePage } from '../pages/home/home';
import { EventPage } from '../pages/event/event';
import { LoginPage } from '../pages/login/login';
import { AboutUsPage } from '../pages/about-us/about-us';
import { BlogPage } from '../pages/blog/blog';
import { SplashPage } from '../pages/splash-page/splash-page';
import { TeamDiscussionPage } from '../pages/team-discussion/team-discussion';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserAccountPage } from '../pages/user-account/user-account';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  loggedInContent: PageInterface[] = [
    { title: 'The Refuge', component: HomePage, icon: 'megaphone' },
    { title: 'Calendar of Events', component: EventPage, icon: 'calendar' },
    { title: 'The Leaderboard', component: LeaderboardPage, icon: 'medal' },
  ];

  teamPages: PageInterface[] = [
    { title: 'Team Connect', component: BlogPage, icon: 'chatbubbles' },
    { title: 'Discussion Starters', component: TeamDiscussionPage, icon: 'bulb' }
  ];

  loggedInPages: PageInterface[] = [
    { title: 'Account Settings', component: UserAccountPage, icon: 'person' },
    { title: 'Contact Us', component: ContactUsPage, icon: 'mail' },
    { title: 'Logout', component: SplashPage, icon: 'log-out', logsOut: true }
  ];

  adminPages: PageInterface[] = [
    { title: 'User Manager', component: AdminUserManagerPage, icon: 'people' },
    { title: 'Team Manager', component: AdminUserTeamPage, icon: 'contacts' },
    { title: 'Notifications', component: AdminAlertsPage, icon: 'phone-portrait' },
    { title: 'Received Messages', component: AdminMessageReadPage, icon: 'mail' }
  ];

  loggedOutPages: PageInterface[] = [
    { title: 'About Us', component: AboutUsPage, icon: 'help-circle' },
    { title: 'Login', component: LoginPage, icon: 'log-in' }
  ];

  rootPage: any = SplashPage;

  constructor(public platform: Platform,
    private menu: MenuController,
    private events: Events,
    private auth: AuthService) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.listenToLoginEvents();

      StatusBar.styleDefault();
      setTimeout(() => { Splashscreen.hide(); }, 2000);
    });
  }

  launch(url) {
    this.platform.ready().then(() => {
      open(url, "_blank", "location=no");
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

    // Give the menu time to close before changing to logged out
    if (page.logsOut === true) {
      setTimeout(() => { this.auth.signOut(); }, 500);
    }
  }

  pushPage(page) {
    this.nav.push(page.component);

    if (page.logsOut === true) {
      setTimeout(() => { this.auth.signOut(); }, 500);
    }
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.setMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.setMenu(false);
    });
  }

  setMenu(isLoggedIn: boolean) {
    if (isLoggedIn) this.nav.setRoot(HomePage);
    else this.nav.setRoot(SplashPage);

    this.menu.enable(isLoggedIn, 'loggedInMenu');
    this.menu.enable(!isLoggedIn, 'loggedOutMenu');
  }
}
