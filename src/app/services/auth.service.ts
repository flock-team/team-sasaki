import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  afUser$: Observable<firebase.User> = this.afAuth.user;
  afUser: firebase.User;
  loginProcessing = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
  ) {
    this.afUser$.subscribe((user) => {
      this.afUser = user && user;
    });
  }

  login(): void {
    this.loginProcessing = true;
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    this.afAuth.signInWithPopup(provider).catch((error) => console.error(error));
    this.loginProcessing = false;
  }

  logout(): void {
    this.loginProcessing = true;
    this.afAuth.signOut().then(() => this.router.navigateByUrl('/welcome')).catch((error) => console.error(error));
    this.loginProcessing = false;
  }
}
