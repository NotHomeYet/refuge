import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import { AuthService } from '../providers/auth-service';
import { ItemLoader } from '../providers/item-loader';
import { ListLoader } from '../providers/list-loader';
import { PageBoxes } from '../providers/page-boxes';
import { FCMPushService } from '../providers/fcm-service';

import { AdminUserManagerPage } from '../pages/admin-user-manager/admin-user-manager';
import { AdminUserTeamPage } from '../pages/admin-user-team/user-team';
import { AdminMessageReadPage } from '../pages/admin-message-read/admin-message-read';
import { AdminAlertsPage } from '../pages/admin-alerts/admin-alerts';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EventPage } from '../pages/event/event';
import { LoginPage } from '../pages/login/login';
import { AboutUsPage } from '../pages/about-us/about-us';
import { BlogPage } from '../pages/blog/blog';
import { BlogCreatePage } from '../pages/blog-create/blog-create';
import { BlogDetailsPage } from '../pages/blog-details/blog-details';
import { SplashPage } from '../pages/splash-page/splash-page';
import { TeamDiscussionPage } from '../pages/team-discussion/team-discussion';
import { AppFooter } from '../pages/common/app-footer';
import { AppUser } from '../pages/common/app-user';
import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { UserAccountPage } from '../pages/user-account/user-account';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';

import *  as Config from '../config'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventPage,
    LoginPage,
    AboutUsPage,
    BlogPage,
    BlogCreatePage,
    BlogDetailsPage,
    AdminUserTeamPage,
    AdminMessageReadPage,
    AdminUserManagerPage,
    AdminAlertsPage,
    SplashPage,
    AppFooter,
    AppUser,
    PrivacyPolicyPage,
    TeamDiscussionPage,
    LeaderboardPage,
    ContactUsPage,
    UserAccountPage,
    UserNotificationsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(Config.FIREBASE_CONFIG)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventPage,
    LoginPage,
    AboutUsPage,
    BlogPage,
    BlogCreatePage,
    BlogDetailsPage,
    AdminUserTeamPage,
    AdminMessageReadPage,
    AdminUserManagerPage,
    AdminAlertsPage,
    SplashPage,
    AppFooter,
    AppUser,
    PrivacyPolicyPage,
    TeamDiscussionPage,
    LeaderboardPage,
    ContactUsPage,
    UserAccountPage,
    UserNotificationsPage,
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService, ItemLoader, ListLoader, PageBoxes, FCMPushService]
})
export class AppModule { }
