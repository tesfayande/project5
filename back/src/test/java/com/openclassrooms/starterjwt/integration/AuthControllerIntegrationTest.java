package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private final ObjectMapper om = new ObjectMapper();

    @Before("before")
    public void setUp(){
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    @DisplayName("registerUser method, response entity bad request")
    public void testRegister() throws Exception {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("email@email.com");
        signupRequest.setPassword("password");
        signupRequest.setFirstName("firstname");
        signupRequest.setLastName("lastname");
        String jsonRequest = om.writeValueAsString(signupRequest);
        // Expect bad request because email already taken
        this.mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register").contentType(APPLICATION_JSON).content(jsonRequest)).andExpect(status().isBadRequest()).andReturn();
    }


    @Test
    @DisplayName("authenticateUser method, response entity ok")
    public void testLogin() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("yoga@studio.com");
        loginRequest.setPassword("test!1234");
        String jsonRequest = om.writeValueAsString(loginRequest);
        this.mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login").contentType(APPLICATION_JSON).content(jsonRequest)).andExpect(status().isOk()).andReturn();
    }

}
