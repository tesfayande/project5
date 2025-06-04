import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { FormComponent } from './form.component';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Session } from '../../interfaces/session.interface';


describe('FormComponent (Integration Tests)', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let teacherService: TeacherService;
  let sessionApiService: SessionApiService;
  let router: Router;
  let route: ActivatedRoute;
  let snackBar: MatSnackBar;

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
        SessionService,
        TeacherService,
        SessionApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    
    sessionService = TestBed.inject(SessionService);
    teacherService = TestBed.inject(TeacherService);
    sessionApiService = TestBed.inject(SessionApiService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    snackBar = TestBed.inject(MatSnackBar);

    // Mock services
    sessionService.sessionInformation = { admin: true } as any;
    jest.spyOn(teacherService, 'all').mockReturnValue(of([]));
    jest.spyOn(sessionApiService, 'detail').mockReturnValue(of(mockSession));
    jest.spyOn(sessionApiService, 'create').mockReturnValue(of(mockSession));
    jest.spyOn(sessionApiService, 'update').mockReturnValue(of(mockSession));
    jest.spyOn(router, 'navigate');
    jest.spyOn(route.snapshot.paramMap, 'get').mockReturnValue('1');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', fakeAsync(() => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/create');
    component.ngOnInit();
    tick();
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm).toBeDefined();
  }));

  it('should initialize form in update mode', fakeAsync(() => {
    jest.spyOn(router, 'url', 'get').mockReturnValue('/sessions/update/1');
    component.ngOnInit();
    tick();
    expect(component.onUpdate).toBeTruthy();
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.sessionForm).toBeDefined();
  }));
   /*
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

    expect(sessionApiService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should update session', fakeAsync(() => {
    component.onUpdate = true;
    component.id = '1';
    component.initForm(mockSession);

    component.submit();
    tick();

    expect(sessionApiService.update).toHaveBeenCalledWith('1', expect.any(Object));
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  }));*/

  it('should redirect if not admin', fakeAsync(() => {
    sessionService.sessionInformation!.admin = false;
    component.ngOnInit();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  }));
});