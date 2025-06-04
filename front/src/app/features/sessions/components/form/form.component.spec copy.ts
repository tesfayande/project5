import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { of, throwError } from 'rxjs';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  
    // Add form component constructor parameters (mocks), object keys are service methods
    let mockComponent: FormComponent;

    let mockRoute: any = { snapshot: { paramMap: { get: jest.fn() } } };
    let mockFormBuilder: FormBuilder = new FormBuilder();
    let mockMatSnackBar: any = { open: jest.fn() };
    let mockSessionApiService: any = {
      create: jest.fn().mockReturnValue({subscribe: jest.fn()}),
      update: jest.fn().mockReturnValue(of({})),
    };
    //let mockSessionService: any;
    let mockTeacherService: any = {all : jest.fn()};
    let mockRouter: any = {
      navigate: jest.fn(),
    };

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  } 

  mockComponent = new FormComponent(
    mockRoute as ActivatedRoute,
    mockFormBuilder,
    mockMatSnackBar as MatSnackBar,
    mockSessionApiService as SessionApiService,
    mockSessionService as SessionService,
    mockTeacherService as TeacherService,
    mockRouter as Router
  )

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
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        SessionApiService
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  describe("When I fill fields correctly in session creation form", () => {

    it("Creates session", () => {
      // Session request data
      const sessionReq : Session = {
        id:1,
        name: 'Name',
        description: 'Description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Input & submit form
      const form = mockComponent.sessionForm?.setValue(sessionReq);
      mockComponent.onUpdate = false;
      mockComponent.submit();

      // Call sessionApiService with session request data
      expect(mockSessionApiService.create).toHaveBeenCalledTimes(1);
      expect(mockSessionApiService.create).toHaveBeenCalledWith(form);

      // Mock subscribe
      mockSessionApiService.create.mockReturnValue(of(
        mockMatSnackBar.open("Session created !"),
        mockRouter.navigate(['sessions'])
      ));

      // Call open
      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Session created !");

      // Call navigation
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    });
  })

  describe("When I fill fields correctly in session update form", () => {
    it("Updates session", () => {
      // Mock id to update
      const idNumber: number = 1;
      const id : string | undefined = mockRoute.snapshot.paramMap.get(idNumber.toString());
      
      // Session request data
      const sessionReq : Session = {
        id:1,
        name: 'Updated Name',
        description: 'Updated Description',
        date: new Date(),
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }       
      
      // Input & submit form
      const form =  mockComponent.sessionForm?.setValue(sessionReq);
      mockComponent.onUpdate = true;
      mockComponent.submit();

      // Call sessionApiService with session request data
      expect(mockSessionApiService.update).toHaveBeenCalledTimes(1);
      expect(mockSessionApiService.update).toHaveBeenCalledWith(id,form);

      // Mock subscribe
      mockSessionApiService.update.mockReturnValue(of(
        mockMatSnackBar.open("Session updated !"),
        mockRouter.navigate(['sessions'])
      ))

      // Call open
      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Session updated !");

      // Call navigation
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);      

    });
  })

  describe("When I don't fill fields correctly in session creation form", () => {
    it("Creation fails, invalid fields", () => {
      // Invalid session request
      const sessionReq : Session = {
        id:0,
        name: '',
        description: '',
        date: new Date(),
        teacher_id: 0,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const form = mockComponent.sessionForm?.setValue(sessionReq);
      mockComponent.onUpdate = false;
      mockComponent.submit();

      expect(mockSessionApiService.create).toHaveBeenCalledWith(form);

      mockSessionApiService.create.mockReturnValue(of(
        mockMatSnackBar.open("Error : invalid fields !")
      ));

      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Error : invalid fields !");
    })
  })

  describe("When I don't fill fields correctly in session update form", () => {
    it("Update fails, invalid fields", () => {
      // Mock id to update
      const idNumber: number = 1;
      const id : string | undefined = mockRoute.snapshot.paramMap.get(idNumber.toString());
      
      // Invalid session request
      const sessionReq : Session = {
        id:0,
        name: '',
        description: '',
        date: new Date(),
        teacher_id: 0,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const form = mockComponent.sessionForm?.setValue(sessionReq);
      mockComponent.onUpdate = true;
      mockComponent.submit();

      expect(mockSessionApiService.update).toHaveBeenCalledWith(id,form);

      mockSessionApiService.create.mockReturnValue(of(
        mockMatSnackBar.open("Error : invalid fields !")
      ));

      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Error : invalid fields !");      
    })
  })

});

