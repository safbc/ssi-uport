import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UportService } from 'src/app/services/uport.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private user$: Subscription;
  loggedIn = false;

  constructor(
    private uportService: UportService,
    private router: Router
  ) {
    // this.user$ = this.uportService.user$.subscribe(_user => {
    //   if (_user.address !== '') {
    //     this.loggedIn = true;
    //   } else {
    //     this.loggedIn = false;
    //   }
    // });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }

  logout() {
    // this.uportService.logout();
    this.router.navigate(['/login']);
  }
}
