import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, switchMap } from 'rxjs';
import { User } from './user';
import firebase from 'firebase/compat/app';
import { UserCredential } from 'firebase/auth';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore
  ) {
    this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  getCurrentUser(): Observable<User | null | undefined> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges()
            .pipe(
              map((user) => {
                if (user) {
                  return { ...user, uid: user.uid } as User;
                }
                return null;
              })
            );
        } else {
          return of(undefined);
        }
      })
    );
  }


  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
  getUid() {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.uid;
      } else {
        throw new Error('Nincs belépve.');
      }
    });
  }

  updateProfile(user: User | null): Promise<void> {
    if (!user) {
      return Promise.reject('User is null');
    }
    const { uid, ...userData } = user;
    return this.firestore.doc<User>(`users/${uid}`).update(userData)
      .then(() => {
        return this.afAuth.currentUser.then((currentUser) => {
          if (currentUser) {
            return currentUser.updateEmail(user.email);
          }
          return Promise.reject('A felhasználó nincs bejelentkezve.');
        });
      });
  }

  deleteProfile(): Promise<any> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        const uid = user.uid;
        const userDoc = this.firestore.doc(`users/${uid}`);
        return user.delete().then(() => {
          return userDoc.delete();
        });

      }
      return Promise.reject('A felhasználó nincs bejelentkezve.');
    });
  }

  updatePassword(newPassword: string): Promise<void> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.updatePassword(newPassword);
      }
      return Promise.reject('A felhasználó nincs bejelentkezve.');
    });
  }
}
