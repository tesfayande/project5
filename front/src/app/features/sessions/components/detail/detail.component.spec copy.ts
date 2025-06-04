import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>; 
  let service: SessionService;

  // Add detail component constructor parameters (mocks), object keys are service methods
  let mockRoute: any = { snapshot: {paramMap: { get: jest.fn() }}}
  let mockFormBuilder: FormBuilder = new FormBuilder();
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  let mockSessionApiService : any = {
    delete : jest.fn().mockReturnValue({subscribe: jest.fn()}),
    participate : jest.fn().mockReturnValue({subscribe: jest.fn()}),
    unparticipate : jest.fn().mockReturnValue({subscribe: jest.fn()}),
    detail: jest.fn().mockReturnValue({subscribe: jest.fn()}),
  }

  let mockTeacherService : any = {
    detail: jest.fn(),
  }

  let mockMatSnackBar : any = {
    open: jest.fn(),
  }
  
  let mockRouter : any = {
    navigate : jest.fn(),
  }

  let mockComponent : DetailComponent = new DetailComponent(
    mockRoute as ActivatedRoute,
    mockFormBuilder,
    mockSessionService as SessionService,
    mockSessionApiService as SessionApiService,
    mockTeacherService as TeacherService,
    mockMatSnackBar as MatSnackBar,
    mockRouter as Router,
  )

  let sessionId = mockRoute.snapshot.paramMap.get('id');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule
      ],
      declarations: [DetailComponent], 
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    })
      .compileComponents();
      service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("When I delete a session", () => {
    it("Deletes successfully a session", () => {
      // Call delete method
      mockComponent.delete();

      // Call sessionApiService with session id
      expect(mockSessionApiService.delete).toHaveBeenCalledTimes(1);
      expect(mockSessionApiService.delete).toHaveBeenCalledWith(sessionId);

      // Mock subscribe
      mockSessionApiService.delete.mockReturnValue(of(
        mockMatSnackBar.open("Session deleted !"),
        mockRouter.navigate(['sessions'])        
      ))
      // Call open
      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Session deleted !");

      // Call navigation
      expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);      
    })
  })

});
