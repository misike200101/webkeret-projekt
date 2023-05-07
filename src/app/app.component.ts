import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar';
import {User} from "./user";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'technical-webshop';
  isAdmin = false;
  user$: Observable<User | null | undefined> = new Observable<User | null | undefined>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.user$ = this.authService.getCurrentUser();
    this.user$.subscribe(
      (user) => {
        this.isAdmin = user?.admin || false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => {
        console.log(error);
        this.snackBar.open(error.message, '', {
          duration: 3000
        });
      });

  }
}
