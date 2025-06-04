import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { describe, expect } from '@jest/globals';
import { JestExpect } from '@jest/expect';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { describe } from '@jest/globals';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

declare const expect: JestExpect;

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const checkEmailFormat = (email:string) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Register", () => {
    // Add register component constructor parameters (mocks), object keys are service methods
    let mockAuthService: any = {
      register: jest.fn().mockReturnValue({subscribe:jest.fn()})
    }; 
    let mockFormBuilder: FormBuilder = new FormBuilder();
    let mockRouter: any = {navigate:jest.fn()};

    let mockComponent: RegisterComponent = new RegisterComponent(mockAuthService as AuthService,mockFormBuilder,mockRouter as Router)
    
    it("Register success", () => {
      const email: string = "email@email.com";
      const registerReq: RegisterRequest = {
        email,
        firstName: "firstName",
        lastName: "lastName",
        password: "password",
      }
      mockComponent.form.setValue(registerReq);
      if(checkEmailFormat(email)){
        mockAuthService.register.mockReturnValue(of(registerReq));

        mockComponent.submit();
  
        expect(mockAuthService.register).toHaveBeenCalledTimes(1);
        expect(mockAuthService.register).toHaveBeenCalledWith(registerReq);
  
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      }else{
        mockComponent.submit();
  
        expect(mockAuthService.register).toHaveBeenCalledTimes(0);
        expect(mockAuthService.register).toHaveBeenCalledWith(registerReq);
  
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/login']);    
      }
    })

    it("Register failed, invalid fields", () => {
      const registerReq: RegisterRequest= {
        email:"",
        firstName:"",
        lastName:"",
        password:"",
      }
      mockComponent.form.setValue(registerReq);
      mockAuthService.register.mockReturnValue(throwError(() => {new Error("Error : invalid fields !")}));
     
      mockComponent.submit();
      
      expect(mockComponent.onError).toBeTruthy();
      expect(mockRouter.navigate).not.toHaveBeenCalledWith();
    })
  })


});
