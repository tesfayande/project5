import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals'; 
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('DetailComponent (Unit Tests)', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockRouter: jest.Mocked<any>;
  let mockRoute: jest.Mocked<any>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  const mockSession: Session = {
    id: 1,
    name: 'Session 1',
    date: new Date(),
    teacher_id: 1,
    description: 'Description',
    users: [1, 2],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        id: 1,
        admin: false,
        token: 'token',
        username: 'test@test.com'
      }
    } as any;

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of({})),
      participate: jest.fn().mockReturnValue(of({})),
      unParticipate: jest.fn().mockReturnValue(of({}))
    } as any;

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    } as any;

    mockRouter = {
      navigate: jest.fn(),
      url: '/sessions/1'
    } as any;

    mockRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1')
        }
      }
    } as any;

    mockSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
              RouterTestingModule,
              HttpClientModule,
              MatSnackBarModule,
              ReactiveFormsModule,
              MatCardModule,
              MatIconModule,
              MatFormFieldModule,
              MatInputModule,
              ReactiveFormsModule,
              MatSnackBarModule,
              MatSelectModule,
            ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with session data', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toEqual(mockTeacher);
  }));

  it('should determine participation status', fakeAsync(() => {
    // User ID 1 is in mockSession.users
    component.ngOnInit();
    tick();
    expect(component.isParticipate).toBeTruthy();

    // Test non-participant
    mockSession.users = [2, 3];
    mockSessionApiService.detail.mockReturnValueOnce(of(mockSession));
    component.ngOnInit();
    tick();
    expect(component.isParticipate).toBeFalsy();
  }));

  it('should delete session', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
  });

  it('should participate in session', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should unparticipate in session', () => {
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });

  it('should navigate back', () => {
    const historySpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(historySpy).toHaveBeenCalled();
  });
});