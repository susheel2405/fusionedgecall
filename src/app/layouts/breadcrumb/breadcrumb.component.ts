import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {
  currentPage: string = '';
  currentRoute: string = '';
  showPopup: boolean = false;

  private hideButtonRoutes: string[] = [
  '/area-codes',
  '/service-provider/types'
];

  // ✅ Centralized popup configuration
  // private popupMap: { [key: string]: string } = {
  //   '/users': 'users',
  //   '/service-provider/service-providers': 'service-providers',
  //   '/service-provider/service-provider-types': 'service-provider-types',
  // };

  constructor(
    private router: Router,

    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updateBreadcrumb();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.updateBreadcrumb();
      });
       this.currentRoute = this.router.url; // Initialize currentRoute
  }

  // updateBreadcrumb(): void {
  //   let route = this.activatedRoute.root;
  //   let breadcrumb = '';

  //   while (route.firstChild) {
  //     route = route.firstChild;
  //     if (route.snapshot.data['breadcrumb']) {
  //       breadcrumb = route.snapshot.data['breadcrumb'];
  //     }
  //   }

  //   this.currentPage = breadcrumb || 'Dashboard / Home';
  // }

  updateBreadcrumb(): void {
    const breadcrumbs: string[] = [];
    let route = this.activatedRoute.root;

    while (route.firstChild) {
      route = route.firstChild;
      const routeSnapshot = route.snapshot;

      if (routeSnapshot.data['breadcrumb']) {
        breadcrumbs.push(routeSnapshot.data['breadcrumb']);
      } else if (routeSnapshot.params['id']) {
        // Optional: fetch name by ID for dynamic breadcrumbs
        breadcrumbs.push(`Details for ${routeSnapshot.params['id']}`);
      }
    }

    this.currentPage = breadcrumbs.join(' / ') || 'Dashboard / Home';
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  get activePopup(): string | null {
    if (this.currentRoute.includes('/users')) return 'users';
    // if (this.currentRoute.includes('/area-codes')) return 'areacodes';
    if (this.currentRoute.includes('/service-provider/providers'))
      return 'service-providers';
    if (this.currentRoute.includes('/service-provider/types'))
      return 'service-provider-types';
    if (this.currentRoute.includes('/service-provider/services'))
      return 'services';
    if(this.currentRoute.includes('/client'))
      return 'client-popup'
    return null;
  }

  get showNewButton(): boolean {
  return !this.hideButtonRoutes.some(route =>
    this.currentRoute.includes(route)
  );
}
  // ✅ Dynamically determine which popup to show based on route
  // get activePopup(): string | null {
  //   return (
  //     Object.entries(this.popupMap).find(([path]) =>
  //       this.currentRoute.includes(path)
  //     )?.[1] || null
  //   );
  // }
}
