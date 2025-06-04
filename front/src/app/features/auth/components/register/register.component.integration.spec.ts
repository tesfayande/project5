import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('RegisterComponent (Integration Tests)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

        imports: [
                
                ReactiveFormsModule,
                BrowserAnimationsModule,
                HttpClientModule,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      declarations: [RegisterComponent],
      providers: [AuthService]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit form and navigate on successful registration', fakeAsync(() => {
    const registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.setValue(registerRequest);
    component.submit();
    tick();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(component.onError).toBeFalsy();
  }));

  it('should set onError when registration fails', fakeAsync(() => {
    const registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    };

    jest.spyOn(authService, 'register').mockReturnValue(
      throwError(() => ({ message: 'Registration failed' }))
    );
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.form.setValue(registerRequest);
    component.submit();
    tick();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  }));

  it('should validate form inputs', () => {
    const email = component.form.controls['email'];
    const firstName = component.form.controls['firstName'];
    const lastName = component.form.controls['lastName'];
    const password = component.form.controls['password'];

    // Test invalid states
    email.setValue('invalid-email');
    firstName.setValue('Jo');
    lastName.setValue('Do');
    password.setValue('pw');
    expect(component.form.valid).toBeFalsy();

    // Test valid states
    email.setValue('valid@email.com');
    firstName.setValue('John');
    lastName.setValue('Doe');
    password.setValue('password123');
    expect(component.form.valid).toBeTruthy();
  });
});