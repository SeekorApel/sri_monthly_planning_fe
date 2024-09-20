import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public nrp;
  public name;

  constructor(private authenticationService: AuthenticationService, private router: Router){
    //PERSONAL INFORMATION
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    console.log('ISI currentUser', currentUserSubject)
    // this.nrp = currentUserSubject.userName;
    // this.name = currentUserSubject.personal[0].nama;
    this.nrp = 123;
    this.name = "benetAdmin";
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
