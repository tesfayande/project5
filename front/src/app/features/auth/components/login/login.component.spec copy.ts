import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
//import { expect } from '@jest/globals/build/index';
import { SessionService } from 'src/app/services/session.service';
import { JestExpect } from '@jest/expect';

import { LoginComponent } from './login.component';
import { LoginRequest } from '../../interfaces/loginRequest.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

declare const expect: JestExpect;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
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
});
