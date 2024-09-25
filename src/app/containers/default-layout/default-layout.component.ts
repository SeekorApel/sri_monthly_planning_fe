import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems: any = ([] = navItems);
  public nrp;
  public name;
  public csMd: any;
  public csTrx: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    //PERSONAL INFORMATION
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    console.log('ISI currentUser', currentUserSubject);
    // this.nrp = currentUserSubject.userName;
    // this.name = currentUserSubject.personal[0].nama;
    this.nrp = 123;
    this.name = 'benetAdmin';

    this.navItems = navItems;
    this.navItems[1].children = [];
    this.navItems[2].children = [];

    this.csMd = [
      { name: 'Plant', url: '/master-data/view-plant', icon: 'cil-minus' },
      { name: 'Product', url: '/master-data/view-product', icon: 'cil-minus' },
      { name: 'Pattern', url: '/master-data/view-pattern', icon: 'cil-minus' },
      { name: 'Tass Machine', url: '/master-data/view-tassMachine', icon: 'cil-minus' },
      { name: 'Setting', url: '/master-data/view-setting', icon: 'cil-minus' },
      { name: 'Quadrant', url: '/master-data/view-quadrant', icon: 'cil-minus' },
      { name: 'ProductType', url: '/master-data/view-product-type', icon: 'cil-minus' },
      { name: 'Building', url: '/master-data/view-building', icon: 'cil-minus' },
      { name: 'Building Distance', url: '/master-data/view-bdistance', icon: 'cil-minus' },
      { name: 'Quadrant Distance', url: '/master-data/view-qdistance', icon: 'cil-minus' },
      { name: 'Size', url: '/master-data/view-size', icon: 'cil-minus' },
      { name: 'Machine Curing Type', url: '/master-data/view-machine-curing-type', icon: 'cil-minus' },
      { name: 'Machine Curing Type Cavity', url: '/master-data/view-machine-curing-type-cavity', icon: 'cil-minus' },
      { name: 'Machine Tass Type', url: '/master-data/view-machine-tass-type', icon: 'cil-minus' },
      { name: 'Tass Size', url: '/master-data/view-tass-size', icon: 'cil-minus' },
      { name: 'Item Curing', url: '/master-data/view-item-curing', icon: 'cil-minus' },
      { name: 'Tass Machine Type', url: '/master-data/view-tass-machine-type', icon: 'cil-minus' },
      { name: 'Max Capacity', url: '/master-data/view-max-capacity', icon: 'cil-minus' },
      { name: 'Curing Machine', url: '/master-data/view-curing-machine', icon: 'cil-minus' },
    ];


    this.csTrx = [
      { name: 'Marketing Order', url: '/transaksi/view-marketing-order', icon: 'cil-minus' }
    ];
  }

  ngOnInit(): void {
    this.navItems[1].children = [];
    this.navItems[2].children = [];

    this.csMd.forEach((item) => {
      this.navItems[1].children.push(item);
    });

    this.csTrx.forEach((item) => {
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
