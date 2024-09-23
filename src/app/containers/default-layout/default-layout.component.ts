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
  public navItems: any = [] = navItems;
  public nrp;
  public name;
  public csMd: any;
  public csTrx: any;

  constructor(private authenticationService: AuthenticationService, private router: Router){
    //PERSONAL INFORMATION
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    console.log('ISI currentUser', currentUserSubject)
    // this.nrp = currentUserSubject.userName;
    // this.name = currentUserSubject.personal[0].nama;
    this.nrp = 123;
    this.name = "benetAdmin";

    this.navItems = navItems;
    this.navItems[1].children = [];
    this.navItems[2].children = [];

    this.csMd = [
      { name: 'Plant', url: '/master-data/view-plant', icon: 'cil-minus' }
    ];

    this.csTrx = [
      { name: 'Header Monthly Planning', url: '/transaksi/header-mo', icon: 'cil-minus' }
    ];
  }

  ngOnInit(): void{
    this.navItems[1].children = [];
    this.navItems[2].children = [];

    this.csMd.forEach(item => {
      this.navItems[1].children.push(item);
    });

    this.csTrx.forEach(item => {
        this.navItems[2].children.push(item);
    });
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
