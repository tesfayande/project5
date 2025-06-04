
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';

import { FormComponent } from './form.component';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';


describe('FormComponent (Unit Tests)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockRouter: jest.Mocked<any>;
  let mockRoute: jest.Mocked<any>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;

  const mockSession: Session = {
    id: 1,
    name: 'Session 1',
    date: new Date(),
    teacher_id: 1,
    description: 'Description',
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: {
        admin: true
      },
      isLogged: true
    } as any;

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of([]))
    } as any;

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      create: jest.fn().mockReturnValue(of(mockSession)),
      update: jest.fn().mockReturnValue(of(mockSession))
    } as any;

    mockRouter = {
      navigate: jest.fn(),
      url: '/sessions'
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
              MatCardModule,
              MatIconModule,
              MatFormFieldModule,
              MatInputModule,
              ReactiveFormsModule, 
              MatSnackBarModule,
              MatSelectModule,
              BrowserAnimationsModule
            ],
      declarations: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect if not admin', () => {
      mockSessionService.sessionInformation!.admin = false;
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should initialize form in create mode', () => {
      mockRouter.url = '/sessions/create';
      component.ngOnInit();
      expect(component.onUpdate).toBeFalsy();
      expect(component.sessionForm).toBeDefined();
    });

    it('should initialize form in update mode', fakeAsync(() => {
      mockRouter.url = '/sessions/update/1';
      component.ngOnInit();
      tick();
      expect(component.onUpdate).toBeTruthy();
      expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
      expect(component.sessionForm).toBeDefined();
    }));
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.initForm();
    });

    it('should have invalid form when empty', () => {
      expect(component.sessionForm?.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const form = component.sessionForm!;
      form.patchValue({
        name: 'Test',
        date: '2023-01-01',
        teacher_id: 1,
        description: 'Description'
      });
      expect(form.valid).toBeTruthy();
    });
  });

  describe('submit', () => {
    it('should create session', fakeAsync(() => {
      component.initForm();
      component.sessionForm?.patchValue({
        name: 'New Session',
        date: '2023-01-01',
        teacher_id: 1,
        description: 'Description'
      });

      component.submit();
      tick();

      expect(mockSessionApiService.create).toHaveBeenCalled();
      expect(mockSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    }));

    it('should update session', fakeAsync(() => {
      component.onUpdate = true;
      component.id = '1';
      component.initForm(mockSession);

      component.submit();
      tick();

      expect(mockSessionApiService.update).toHaveBeenCalledWith('1', expect.any(Object));
      expect(mockSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    }));
  });
});
