import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('RegisterComponent (Unit Tests)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<any>;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

    it('should validate firstName length', () => {
      const firstName = component.form.controls['firstName'];
      firstName.setValue('1'); // too short
      expect(firstName.valid).toBeFalsy();
     
      firstName.setValue('abc'); // valid
      expect(firstName.valid).toBeTruthy();
    });

    it('should validate lastName length', () => {
      const lastName = component.form.controls['lastName'];
      lastName.setValue('2'); // too short
      expect(lastName.valid).toBeFalsy();
     
      lastName.setValue('abc'); // valid
      expect(lastName.valid).toBeTruthy();
    });

    it('should validate password length', () => {
      const password = component.form.controls['password'];
      password.setValue('1'); // too short
      expect(password.valid).toBeFalsy();
      password.setValue('1'.repeat(41)); // too long
      expect(password.valid).toBeFalsy();
      password.setValue('abc'); // valid
      expect(password.valid).toBeTruthy();
    });
  });

  describe('submit()', () => {
    const validRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    it('should not call authService.register if form is invalid', () => {
     
       const nullregisterReq: RegisterRequest= {
              email:"",
              firstName:"",
              lastName:"",
              password:"",
            }
            component.form.setValue(nullregisterReq);
            mockAuthService.register.mockReturnValue(throwError(() => {new Error("Error : invalid fields !")}));
           
            component.submit();
            
            expect(component.onError).toBeTruthy();
            expect(mockRouter.navigate).not.toHaveBeenCalledWith();
    });

    it('should handle successful registration', () => {
      component.form.setValue(validRequest);
      mockAuthService.register.mockReturnValue(of(void 0));

      component.submit();

      expect(mockAuthService.register).toHaveBeenCalledWith(validRequest);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.onError).toBeFalsy();
    });

    it('should handle registration error', () => {
      component.form.setValue(validRequest);
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Registration failed')));

      component.submit();

      expect(mockAuthService.register).toHaveBeenCalledWith(validRequest);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(component.onError).toBeTruthy();
    });
  });
});