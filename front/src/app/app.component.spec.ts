import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect, jest } from '@jest/globals';

import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { SessionInformation } from './interfaces/sessionInformation.interface';
import { BehaviorSubject } from 'rxjs';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe("Logout", () => {
    // Add app component constructor parameters (mocks), object keys are service methods
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
  })
});
