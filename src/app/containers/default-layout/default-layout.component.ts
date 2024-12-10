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
  public role;
  public masterPPC: any;
  public transaksiPPC: any;
  public transaksiMarketing: any;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    //PERSONAL INFORMATION
    // localStorage.clear();
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    this.nrp = currentUserSubject.userName;
    this.name = currentUserSubject.fullName;
    this.role = currentUserSubject.roles.role_name;

    this.navItems = navItems;
    this.navItems[1].children = [];
    this.navItems[2].children = [];

    this.masterPPC = [
      { name: 'Plant', url: '/master-data/view-plant', icon: 'cil-minus' },
      { name: 'Building', url: '/master-data/view-building', icon: 'cil-minus' },
      { name: 'Building Distance', url: '/master-data/view-bdistance', icon: 'cil-minus' },
      { name: 'Quadrant', url: '/master-data/view-quadrant', icon: 'cil-minus' },
      { name: 'Quadrant Distance', url: '/master-data/view-qdistance', icon: 'cil-minus' },
      { name: 'Machine Curing', url: '/master-data/view-curing-machine', icon: 'cil-minus' },
      { name: 'Machine Curing Type', url: '/master-data/view-machine-curing-type', icon: 'cil-minus' },
      { name: 'Machine Tass', url: '/master-data/view-machine-tass', icon: 'cil-minus' },
      { name: 'Machine Tass Type', url: '/master-data/view-machine-tass-type', icon: 'cil-minus' },
      { name: 'Machine Extruding', url: '/master-data/view-machine-extruding', icon: 'cil-minus' },
      { name: 'Machine Allowence', url: '/master-data/view-machine-allowence', icon: 'cil-minus' },
      { name: 'Curing Size', url: '/master-data/view-curing-size', icon: 'cil-minus' },
      { name: 'Tass Size', url: '/master-data/view-tass-size', icon: 'cil-minus' },
      { name: 'Max Capacity', url: '/master-data/view-max-capacity', icon: 'cil-minus' },
      { name: 'Pattern', url: '/master-data/view-pattern', icon: 'cil-minus' },
      { name: 'Size', url: '/master-data/view-size', icon: 'cil-minus' },
      { name: 'ProductType', url: '/master-data/view-product-type', icon: 'cil-minus' },
      { name: 'Item Curing', url: '/master-data/view-item-curing', icon: 'cil-minus' },
      { name: 'Item Assy', url: '/master-data/view-item-assy', icon: 'cil-minus' },
      { name: 'Product', url: '/master-data/view-product', icon: 'cil-minus' },
      { name: 'CT Kapa', url: '/master-data/view-ct-kapa', icon: 'cil-minus' },
      { name: 'CT Curing', url: '/master-data/view-ct-curing', icon: 'cil-minus' },
      { name: 'CT Assy', url: '/master-data/view-routing-machine', icon: 'cil-minus' },
      { name: 'Setting', url: '/master-data/view-setting', icon: 'cil-minus' },
      { name: 'PM Stop Machine', url: '/master-data/view-pm-stop-machine', icon: 'cil-minus' },
      { name: 'Delivery Schedule', url: '/master-data/view-delivery-schedule', icon: 'cil-minus' },
      { name: 'Detail Delivery Schedule', url: '/master-data/view-d-deliveryschedule', icon: 'cil-minus' },
      { name: 'Work Day', url: '/master-data/view-work-day', icon: 'cil-minus' },
    ];

    this.transaksiPPC = [
      { name: 'Marketing Order', url: '/transaksi/view-mo-ppc', icon: 'cil-minus' },
      { name: 'Monthly Planning', url: '/transaksi/view-monthly-planning', icon: 'cil-minus' },
    ];

    this.transaksiMarketing = [{ name: 'Marketing Order', url: '/transaksi/view-mo-marketing', icon: 'cil-minus' }];
  }

  ngOnInit(): void {
    if (this.role === 'PPC') {
      // PPC: show Master Data and Transaksi
      this.masterPPC.forEach((item) => {
        this.navItems[1].children.push(item);
      });
      this.transaksiPPC.forEach((item) => {
        this.navItems[2].children.push(item);
      });
    } else if (this.role === 'Marketing FED' || this.role === 'Marketing FDR') {
      this.transaksiMarketing.forEach((item) => {
        this.navItems[2].children.push(item);
      });
      this.navItems = this.navItems.filter((item) => item.name !== 'Master Data');
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
