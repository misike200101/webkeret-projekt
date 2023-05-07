import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  password = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user: User | null | undefined) => {
        this.user = user || null;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  updateProfile() {
    if (this.user) {
      const updatedUser: User = {
        uid: this.user.uid,
        email: this.user.email,
        displayName: this.user.displayName,
      };
      this.authService.updateProfile(updatedUser)
        .then(() => {
          this.snackBar.open('A profil sikeresen frissítve lett!', '', {
            duration: 3000
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(error.message, '', {
            duration: 3000
          });
        });
    }
  }


  updatePassword() {
    if (this.password) {
      this.authService.updatePassword(this.password)
        .then(() => {
          this.snackBar.open('A jelszó sikeresen frissítve lett!', '', {
            duration: 3000
          });
          this.password = '';
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(error.message, '', {
            duration: 3000
          });
        });
    } else {
      this.snackBar.open('A jelszó mező nem lehet üres!', '', {
        duration: 3000
      });
    }
  }

  deleteProfile() {
    if (confirm('Biztosan törölni szeretné a profilját? Ez a művelet visszavonhatatlan.')) {
      this.authService.deleteProfile()
        .then(() => {
          this.snackBar.open('A profil sikeresen törölve lett.', '', {
            duration: 3000
          });
        })
        .catch((error) => {
          console.log(error);
          this.snackBar.open(error.message, '', {
            duration: 3000
          });
        });
    }
  }
}
