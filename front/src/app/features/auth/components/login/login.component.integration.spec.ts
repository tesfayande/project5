import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

import { Router } from '@angular/router';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

describe('LoginComponent (Integration Tests)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  const mockSessionInfo: SessionInformation = {
    token: 'mock-token',
    type: 'user',
    id: 1,
    username: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
                    RouterTestingModule,
                    BrowserAnimationsModule,
                    HttpClientModule,
                    MatCardModule,
                    MatIconModule,
                    MatFormFieldModule,
                    MatInputModule
                  ],
      declarations: [LoginComponent],
      providers: [
        AuthService,
        SessionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
 
   describe("Login", () => {
      // Add login component constructor parameters (mocks), object keys are service methods
      let mockAuthService : any = {
        login : jest.fn().mockReturnValue({subscribe : jest.fn()}),
      }
  
      let mockFormBuilder: FormBuilder = new FormBuilder();
  
      let mockSessionService : any = {logIn: jest.fn()};
  
      let mockRouter : any = {navigate: jest.fn()};
  
      let mockComponent : LoginComponent = new LoginComponent(
        mockAuthService as AuthService,
        mockFormBuilder,
        mockRouter as Router,
        mockSessionService as SessionService
      )
  
      it("Login successful", () => {
        // Login request data
        const loginReq: LoginRequest = {
          email:"yoga@studio.com",
          password:"test!12345"
        }
        
        // Expected login response data
        const loginRes = {
          token:"token",
          type:"Bearer",
          id:1,
          username:"username",
          firstName:"firstName",
          lastName:"lastName",
          admin:true,
        }
    
        // Input & submit form
        mockComponent.form.setValue(loginReq);
        mockComponent.submit();
    
        // Call authService with login request data
        expect(mockAuthService.login).toHaveBeenCalledTimes(1);
        expect(mockAuthService.login).toHaveBeenCalledWith(loginReq);
    
        // Get authService response
        mockAuthService.login.mockReturnValue(of(loginRes));
    
        mockComponent.submit();
  
        // Call sessionService with login response data
        expect(mockSessionService.logIn).toHaveBeenCalledTimes(1);
        expect(mockSessionService.logIn).toHaveBeenCalledWith(loginRes);
    
        // Call navigation
        expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
      });
    
      it("Login fails, invalid fields", () => {
        const loginReq: LoginRequest = {
          email: "",
          password: "",
        }
        
        mockComponent.form.setValue(loginReq);
        mockAuthService.login.mockReturnValue(throwError(() => new Error("Error : invalid fields !")));
        
        mockComponent.submit();
  
        expect(mockComponent.onError).toBeTruthy();
        expect(mockSessionService.logIn).not.toHaveBeenCalledWith();
        expect(mockRouter.navigate).not.toHaveBeenCalledWith();
      })
  
      it("Login fails, invalid credentials", () => {
        const loginReq: LoginRequest = {
          email: "email@email.com",
          password: "password",
        }
        
        mockComponent.form.setValue(loginReq);
        mockAuthService.login.mockReturnValue(throwError(() => new Error("Error : invalid credentials !")));
        
        mockComponent.submit();
  
        expect(mockComponent.onError).toBeTruthy();
        expect(mockSessionService.logIn).not.toHaveBeenCalledWith();
        expect(mockRouter.navigate).not.toHaveBeenCalledWith();
      })
  
    })




  it('should set onError when login fails', fakeAsync(() => {
    const loginRequest: LoginRequest = {
      email: 'test@test.com',
      password: 'wrongpassword'
    };
    
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Login failed')));
    jest.spyOn(sessionService, 'logIn');
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.setValue(loginRequest);
    component.submit();
    tick();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(sessionService.logIn).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  }));

  it('should validate form inputs', () => {
    const email = component.form.controls['email'];
    const password = component.form.controls['password'];

    // Test invalid states
    email.setValue('invalid-email');
    password.setValue('1');
    expect(email.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
    expect(component.form.valid).toBeFalsy();

    // Test valid states
    email.setValue('valid@email.com');
    password.setValue('123');
    expect(email.valid).toBeTruthy();
    expect(password.valid).toBeTruthy();
    expect(component.form.valid).toBeTruthy();
  });
});