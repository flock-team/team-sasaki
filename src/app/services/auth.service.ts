import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { UserService } from './user.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uid: string;
  afUser$: Observable<firebase.User> = this.afAuth.user.pipe(
    map((user) => {
      this.uid = user.uid;
      return user;
    })
  );
  afUser: firebase.User;
  loginProcessing = false;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {
    this.afUser$.subscribe((user) => {
      this.afUser = user && user;
    });
  }

  login(): void {
    this.loginProcessing = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.afAuth
      .signInWithPopup(provider)
      .then((userCredential) => {
        return this.userService
          .getUser(userCredential.user.uid)
          .pipe(take(1))
          .toPromise();
      })
      .then((user) => {
        if (user?.webhookURL) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl('/signup');
        }
        this.loginProcessing = false;
      })
      .catch((error) => {
        console.error(error);
        this.loginProcessing = false;
      });
  }

  logout(): void {
    this.loginProcessing = true;
    this.afAuth
      .signOut()
      .then(() => {
        this.router.navigateByUrl('/welcome');
        this.loginProcessing = false;
      })
      .catch((error) => {
        console.error(error);
        this.loginProcessing = false;
      });
  }
}
