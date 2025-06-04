import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

describe('ListComponent (Unit Tests)', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;

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
    mockSessionService = {
      sessionInformation: mockSessionInfo
    } as any;

    mockSessionApiService = {
      all: jest.fn().mockReturnValue(of(mockSessions))
    } as any;

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule,HttpClientModule, MatCardModule, MatIconModule],
      declarations: [ListComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize sessions$ with data from sessionApiService', (done) => {
    component.sessions$.subscribe(sessions => {
      expect(sessions).toEqual(mockSessions);
      expect(mockSessionApiService.all).toHaveBeenCalled();
      done();
    });
  });

  it('should return user session information', () => {
    expect(component.user).toEqual(mockSessionInfo);
  });

  it('should handle empty session information', () => {
    mockSessionService.sessionInformation = undefined;
    expect(component.user).toBeUndefined();
  });
});