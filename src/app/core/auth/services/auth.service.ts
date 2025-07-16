import { Injectable } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { setPersistence } from 'firebase/auth';
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private firebaseAuth: Auth) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  register(
    email: string,
    password: string
  ): Observable<UserCredential | { error: string }> {
    return from(
      createUserWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(catchError((err) => of({ error: err.message })));
  }

  login(
    email: string,
    password: string
  ): Observable<UserCredential | { error: string }> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(catchError((err) => of({ error: err.message })));
  }

  logout(): Observable<void | { error: string }> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });

    return from(promise).pipe(catchError((err) => of({ error: err.message })));
  }

  loginWithGoogle(): Observable<UserCredential | { error: string }> {
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.firebaseAuth, provider)).pipe(
      catchError((err) => of({ error: err.message }))
    );
  }
}
