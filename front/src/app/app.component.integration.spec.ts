import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BehaviorSubject, of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { SessionInformation } from './interfaces/sessionInformation.interface';


describe('AppComponent (Integration Tests)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let sessionService: SessionService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
            HttpClientModule,
            MatToolbarModule
    ],
      declarations: [AppComponent],
      providers: [
        SessionService,
        AuthService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    // Get real services
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    authService = TestBed.inject(AuthService);
    
    // Mock service methods
    jest.spyOn(sessionService, '$isLogged').mockReturnValue(of(true));
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create with real services', () => {
    expect(component).toBeTruthy();
  });

  describe('$isLogged', () => {
    it('should return observable from real session service', (done) => {
      component.$isLogged().subscribe(isLogged => {
        expect(isLogged).toBe(true);
        expect(sessionService.$isLogged).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('logout', () => {
   
        let mockAuthService : any = jest.fn();
        let mockRouter : any = {navigate : jest.fn()};
        let mockSessionService : any = {logOut : jest.fn()};
        
        let mockComponent: AppComponent = new AppComponent(
          mockAuthService as AuthService,
          mockRouter,
          mockSessionService as SessionService
        );
    
        it("Logout successfully", () => {
          let isLogged!: Boolean;
          let sessionInformation: SessionInformation | undefined;
          let isLoggedSubject = new BehaviorSubject<Boolean>(isLogged);
    
          mockComponent.logout();
    
          expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
          // Mock logOut method from session.service.ts
          mockSessionService.logOut.mockImplementation({
            sessionInformation: undefined,
            isLogged: false,
            isLoggedSubject: isLoggedSubject.next(isLogged),
          });
          
          expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
          expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
        })
  });
});