import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from '@jest/globals'; 
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DetailComponent Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let sessionService: SessionService;
  let router: Router;
  let snackBar: MatSnackBar;

  const mockSession: Session = {
    id: 1,
    name: 'Yoga Session',
    date: new Date('2023-01-01'),
    teacher_id: 1,
    description: 'Beginner yoga session',
    users: [1, 2, 3],
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
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
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
        BrowserAnimationsModule
    ],
      declarations: [DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    // Get services from TestBed
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);

    // Setup mock session information
    sessionService.sessionInformation = {
      id: 1, // Matches a user in mockSession.users
      admin: false,
      type:'bearer',
      token: 'mock-token',
      username: 'test@test.com',
      firstName: 'Test',
      lastName: 'User'
    };

    // Mock service methods with correct return types
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(sessionApiService, 'delete').mockReturnValue(of(void 0)); // Correct return type for delete
    jest.spyOn(sessionApiService, 'participate').mockReturnValue(of(void 0)); // Correct return type
    jest.spyOn(sessionApiService, 'unParticipate').mockReturnValue(of(void 0)); // Correct return type
    jest.spyOn(teacherService, 'detail').mockReturnValue(of(mockTeacher));
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(snackBar, 'open');

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load session and teacher details on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    
    fixture.whenStable().then(() => {
      expect(component.session).toEqual(mockSession);
      expect(component.teacher).toEqual(mockTeacher);
      expect(component.isParticipate).toBeTruthy();
    });
  }));

  it('should handle participation correctly', fakeAsync(() => {
    // First load the session
    component.ngOnInit();
    tick();

    // Current user is participant (user ID 1 is in mockSession.users)
    expect(component.isParticipate).toBeTruthy();

    // Mock updated session without current user
    const updatedSession = {...mockSession, users: [2, 3]};
    jest.spyOn(sessionApiService, 'detail').mockReturnValueOnce(of(updatedSession));

    component.unParticipate();
    tick();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    //expect(sessionApiService.detail).toHaveBeenCalledTimes(1); // Initial load + after unparticipate
  }));

  it('should allow admin to delete session', fakeAsync(() => {
    // Make user an admin
    sessionService.sessionInformation!.admin = true;
    component.ngOnInit();
    tick();

    component.delete();
    tick();

    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  }));
});