import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  uid: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  displayName: string = '';
  admin: boolean = false;

  constructor(private authService: AuthService, private firestore: AngularFirestore, private router: Router) {}

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.log('A jelszó nem egyezik meg a megerősítéssel.');
      return;
    }

    if (this.password.length < 6) {
      console.log('A jelszó legalább 6 karakter hosszúnak kell lennie.');
      return;
    }

    try {
      const result = await this.authService.register(this.email, this.password);
      await this.addUser(result.user?.uid);
      console.log('Sikeres regisztráció és felhasználó hozzáadása az adatbázishoz.');
      this.router.navigate(['/']);
    } catch (error) {
      console.log('Hiba a regisztráció során:', error);
    }
  }

  async addUser(uid: string | undefined) {
    if (!uid) {
      console.log('Hiba az új felhasználó hozzáadásakor: Hiányzó felhasználó azonosító.');
      return;
    }

    const userRef = this.firestore.collection('users').doc(uid);
    const doc = await userRef.get().toPromise();

    if (doc && doc.exists) {
      console.log('Az új felhasználó már létezik az adatbázisban.');
      return;
    }

    try {
      await userRef.set({
        email: this.email,
        displayName: this.displayName,
        uid: uid,
        admin : false
      });
      console.log('Az új felhasználó sikeresen hozzáadva az adatbázishoz.');
    } catch (error) {
      console.log('Hiba az új felhasználó hozzáadásakor:', error);
    }
  }

}
