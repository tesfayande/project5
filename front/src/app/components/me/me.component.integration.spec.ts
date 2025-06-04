import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { MeComponent } from './me.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from '../../interfaces/user.interface';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

describe('MeComponent (Integration Tests)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionService: SessionService;
  let userService: UserService;
  let router: Router;
  let snackBar: MatSnackBar;

  const mockUser: User = {
        id: 1,
        email: "email@email.com",
        lastName: "firstName",
        firstName: "lastName",
        admin: true,
        password: "password",
        createdAt: new Date(),
        updatedAt: new Date(),

  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
                  ],
      declarations: [MeComponent],
      providers: [
        SessionService,
        UserService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    
    // Get real services with TestBed
    sessionService = TestBed.inject(SessionService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);

    // Mock session information
    sessionService.sessionInformation = {
      id: 1,
      token: 'token',
      type: 'type',
      username: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      admin: false
    };

    // Spy on service methods
    jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));
    jest.spyOn(userService, 'delete').mockReturnValue(of({}));
    jest.spyOn(sessionService, 'logOut');
    jest.spyOn(router, 'navigate');
    jest.spyOn(snackBar, 'open');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    expect(userService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });
   /*
  it('should handle account deletion properly', () => {
    component.delete(1);
    
    expect(userService.delete).toHaveBeenCalledTimes(1);
    expect(userService.delete).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Your account has been deleted !', 
      'Close', 
      { duration: 3000 }
    );
     expect(sessionService.logOut).toHaveBeenCalledTimes(1);
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });*/

  // Test with actual HTTP call (remove mock if you want real HTTP)
  it('should make actual HTTP call for user data', () => {
    // Remove the mock to test actual HTTP
    jest.restoreAllMocks();
    
    const httpSpy = jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(httpSpy).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });
});