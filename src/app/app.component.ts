import { HostListener } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular-Starter';
  showLoader = false;
  isDesktopScreen: boolean = true;
  service: string;
  currentOutletName: string;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, 
    private titleService: Title, private sharedService: SharedService) { }

  ngOnInit(): void {

    window.innerWidth <= 1024 ? this.isDesktopScreen = false : this.isDesktopScreen = true;

    this.sharedService.isServiceChanged$.subscribe((data) => this.service = this.sharedService.service)

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setDynamicTitle();
      }
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    window.innerWidth <= 1024 ? this.isDesktopScreen = false : this.isDesktopScreen = true;
  }

  /**
   * Method that sets dynamic title based on current route
   */
  setDynamicTitle() {
    const ar: ActivatedRoute = this.getChild(this.activatedRoute);
    // adding service from queryParams for routes of forms
    let title = '';
    if (ar.snapshot.data.title === 'Speedyy Admin') {
      this.service = null;
    }
    // if(ar.snapshot.data.title === undefined){
    //   if(this.service === 'Food'){
    //     this.router.navigate(['/home'])
    //   }
    //   else{
    //     this.router.navigate(['rider/riders-list'])
    //   }
    // }
    this.service = this.service?.replace(/^(.).*/, '$1');

      title = this.service ? `[${this.service.toUpperCase()}] ${ar.snapshot.data.title} ` : ar.snapshot.data.title;
      
    if (title) {
      this.currentOutletName ? this.titleService.setTitle(`${title} ${this.currentOutletName} `) : this.titleService.setTitle(`${title} `)
    }

  }

  /**
   * Method that returns last child of active route
   * @param activatedRoute 
   * @returns 
   */
  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) return this.getChild(activatedRoute.firstChild);
    
  this.currentOutletName = activatedRoute.snapshot.queryParamMap.get('outletName');
    return activatedRoute;
  }
}
