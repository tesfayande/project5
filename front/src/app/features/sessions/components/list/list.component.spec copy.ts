import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [{ provide: SessionService, useValue: mockSessionService,SessionApiService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();




      let SessionApi = TestBed.inject(SessionApiService);

    jest.spyOn(SessionApi, 'all').mockReturnValue(
      of([{
        id:1,
        name: 'Name',
        description: 'Description',
        date: new Date("2023-09-07T12:00:00"),
        teacher_id: 0,
        users: [],
        createdAt: new Date("2023-09-07T12:00:00"),
        updatedAt: new Date("2023-09-07T12:00:00"),
      },{
        id:1,
        name: 'Name',
        description: 'Description',
        date: new Date("2023-09-07T12:00:00"),
        teacher_id: 0,
        users: [],
        createdAt: new Date("2023-09-07T12:00:00"),
        updatedAt: new Date("2023-09-07T12:00:00"),
      }


      ])
    );


  });

/*
   it('should display a list of sessions', () => {
    fixture.detectChanges(); 

     let SessionApi = TestBed.inject(SessionApiService);
    //expect(SessionApi.all).toBeCalledTimes(1);

    const compiled = fixture.nativeElement;
    expect(compiled.querySelectorAll('div').length).toBe(2);
    expect(compiled.querySelector('div').textContent).toContain('Name');
  });*/

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Session" , () => {

    it("Gets session list data" , () => {
      // Initialize response of type Session[]
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

      component.sessions$.subscribe(session => {
        response = session;
      })
      
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
    })


    
  })
});
