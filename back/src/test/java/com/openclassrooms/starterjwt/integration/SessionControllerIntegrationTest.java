package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Date;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIntegrationTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Before("")
    public void setUp(){
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    Session session;
    @BeforeEach
    public void setup(){
       Date LocalDateTime = new Date();
        session = Session.builder()
                .name("Session")
                .date(LocalDateTime)
                .description("my description")
                .build();
    }


    @Test
    @DisplayName("findById method, response entity ok")
    public void testFindById_responseEntityOK() throws Exception{
        String email = "email@email.com";
        String password = "password";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email,password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateJwtToken(authentication);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .get("/api/session/{id}", "3")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("my description"))
                .andReturn();
    }


    @Test
    @DisplayName("find all method, response entity ok")
    public void testFind_allEntityOK() throws Exception{
        String email = "email@email.com";
        String password = "password";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email,password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateJwtToken(authentication);
        this.mockMvc.perform(MockMvcRequestBuilders
                        .get("/api/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
    }




    @Test
    @DisplayName("delete method, response entity not found")
    public void deleteSession() throws Exception{


        String email = "email@email.com";
        String password = "password";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email,password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtUtils.generateJwtToken(authentication);
        this.mockMvc
                .perform(
                        MockMvcRequestBuilders
                                .delete("/api/session/{id}","30")
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                                .contentType(APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andReturn();

    }

}
