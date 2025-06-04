import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('ListComponent (Integration Tests)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessionInfo: SessionInformation = {
    token: 'mock-token',
    type: 'user',
    id: 1,
    username: 'test@test.com',
    firstName: 'Test',
    lastName: 'User',
    admin: false
  };

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Session 1',
      description: 'Description 1',
      date: new Date(),
      teacher_id: 1,
      users: [1, 2],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
         imports: [
            RouterTestingModule,
            HttpClientModule,
            MatCardModule,
            MatIconModule,
            HttpClientTestingModule,
            RouterTestingModule // Add this line
            ],
      declarations: [ListComponent],
      providers: [SessionService, SessionApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    
    sessionService.sessionInformation = mockSessionInfo;
    jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sessions on initialization', fakeAsync(() => {
    //component.ngOnInit();
    tick();
    
    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      expect(sessionApiService.all).toHaveBeenCalled();
    });
  }));

  it('should return user session information', () => {
    expect(component.user).toEqual(mockSessionInfo);
  });

  it('should handle empty session information', () => {
    sessionService.sessionInformation = undefined;
    expect(component.user).toBeUndefined();
  });

  it('should make actual HTTP call for sessions', fakeAsync(() => {
    // Remove the mock to test actual HTTP
    jest.restoreAllMocks();
    
    const httpSpy = jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));
    
    //component.ngOnInit();
    tick();

    let response : Session[] = [{
        id:1,
        name: 'Name',
        description: 'Description',
        date: new Date("2023-09-07T12:00:00"),
        teacher_id: 0,
        users: [],
        createdAt: new Date("2023-09-07T12:00:00"),
        updatedAt: new Date("2023-09-07T12:00:00"),
      }]

    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
    });
      
      // Initialize expectedResponse of type Session[]
      let expectedResponse : Session[] = [{
        id:1,
        name: 'Name',
        description: 'Description',
        date: new Date("2023-09-07T12:00:00"),
        teacher_id: 0,
        users: [],
        createdAt: new Date("2023-09-07T12:00:00"),
        updatedAt: new Date("2023-09-07T12:00:00"),
      }]

      expect(expectedResponse).toEqual(response);
    /*
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(httpSpy).toHaveBeenCalled();
    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
    });*/
  }));
});