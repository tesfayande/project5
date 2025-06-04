import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('LoginComponent (Unit Tests)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<any>;
  let mockSessionService: jest.Mocked<SessionService>;

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
    mockAuthService = {
      login: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    };

    mockSessionService = {
      logIn: jest.fn()
    } as any;

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
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {


    it('should have invalid form when empty', () => {
      expect(component.form.valid).toBeFalsy();
    });

    it('should validate email format', () => {
      const email = component.form.controls['email'];
      email.setValue('invalid-email');
      expect(email.valid).toBeFalsy();
      email.setValue('valid@email.com');
      expect(email.valid).toBeTruthy();
    });

    it('should validate password length', () => {
      const password = component.form.controls['password'];
      password.setValue('1');
     expect(password.valid).toBeFalsy();
      password.setValue('123');
      expect(password.valid).toBeTruthy();
    });

  });

  describe('submit()', () => {
    
      it("Login fails, invalid credentials", () => {
          const loginReq: LoginRequest = {
            email: "email@email.com",
            password: "password",
          }
          
           component.form.setValue(loginReq);
          mockAuthService.login.mockReturnValue(throwError(() => new Error("Error : invalid credentials !")));
          
           component.submit();
    
          expect( component.onError).toBeTruthy();
          expect(mockSessionService.logIn).not.toHaveBeenCalledWith();
          expect(mockRouter.navigate).not.toHaveBeenCalledWith();
        })

    it('should handle successful login', () => {
      const loginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123'
      };
      component.form.setValue(loginRequest);
      mockAuthService.login.mockReturnValue(of(mockSessionInfo));

      component.submit();

      expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
      expect(mockSessionService.logIn).toHaveBeenCalledWith(mockSessionInfo);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
      expect(component.onError).toBeFalsy();
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = {
        email: 'test@test.com',
        password: 'password123'
      };
      component.form.setValue(loginRequest);
      mockAuthService.login.mockReturnValue(throwError(() => new Error('Login failed')));

      component.submit();

      expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
      expect(mockSessionService.logIn).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(component.onError).toBeTruthy();
    });
  });
});