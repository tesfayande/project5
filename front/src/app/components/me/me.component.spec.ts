import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { MeComponent } from './me.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('MeComponent (Unit Tests)', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockRouter: jest.Mocked<any>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;
  let mockUserService: jest.Mocked<UserService>;

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
    mockRouter = {
      navigate: jest.fn()
    };

    mockSessionService = {
      sessionInformation: {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        admin: false
      },
      logOut: jest.fn()
    } as any;

    mockMatSnackBar = {
      open: jest.fn()
    } as any;

    mockUserService = {
      getById: jest.fn(() => of(mockUser)),
      delete: jest.fn(() => of({}))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
              MatSnackBarModule,
              HttpClientModule,
              MatCardModule,
              MatFormFieldModule,
              MatIconModule,
              MatInputModule
            ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data on init', () => {
    expect(mockUserService.getById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
  });

  
     it('Should call history.back on back', () => {
    // On écoute la méthode back de l'objet window.history
    const spy = jest.spyOn(window.history, 'back');
    // On lance la méthode back du composant
    component.back();
    // On s'attend à ce que la méthode back de l'objet window.history ait été appelée
    expect(spy).toHaveBeenCalled();
  });

  it('should delete account and navigate to home', () => {
    component.delete(1);
    
    expect(mockUserService.delete).toHaveBeenCalledWith('1');
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      "Your account has been deleted !", 
      'Close', 
      { duration: 3000 }
    );
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});