package com.openclassrooms.starterjwt.controller;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserService userService;

    @Mock
    SecurityContext securityContext;

    @Mock
    Authentication authentication;

    @BeforeEach
    public void setUp(){
        userController = new UserController(userService,userMapper);
    }

    @Test
    @DisplayName("findById method, return response entity ok")
    void whenUserId_thenReturnResponseEntityOkFind(){
        String id = "4";
        User user = new User();
        UserDto userDto = new UserDto();

        when(userService.findById(Long.valueOf(id))).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        ResponseEntity<?> findById = userController.findById(id);
        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().body(userDto);

        assertEquals(findById, responseEntityOK);
        verify(userService, times(1)).findById(Long.parseLong(id));
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    @DisplayName("findById method, return response entity not found")
    void whenUserNull_thenReturnResponseEntityNotFound(){
        String id = "4";
        User user = null;

        when(userService.findById(Long.parseLong(id))).thenReturn(user);

        ResponseEntity<?> findById = userController.findById(id);
        ResponseEntity<?> responseEntityNotFound = ResponseEntity.notFound().build();

        assertEquals(findById,responseEntityNotFound);
        verify(userService, times(1)).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("findById method, return response entity bad request")
    void whenIdInvalidFormat_thenReturnResponseEntityBadRequest(){
        String id = "invalid_id";
        assertThrows(NumberFormatException.class, () -> {Long.valueOf(id);});
        ResponseEntity<?> findById = userController.findById(id);
        ResponseEntity<?> badRequestResponse = ResponseEntity.badRequest().build();
        assertEquals(findById,badRequestResponse);
    }

    @Test
    @DisplayName("save method, return response entity ok")
    void whenUserId_thenReturnResponseEntityOkDelete(){
        String id = "4";
        User user = new User();
        user.setId(Long.valueOf(id));
        user.setEmail("toto3@toto.com");

        when(userService.findById(Long.valueOf(id))).thenReturn(user);

        UserDetails userDetails = UserDetailsImpl.builder().username(user.getEmail()).build();
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        userService.delete(Long.parseLong(id));
        ResponseEntity<?> save = userController.save(id);
        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().build();
        assertEquals(save,responseEntityOK);
        verify(userService, times(1)).findById(Long.valueOf(id));
        verify(userService, times(2)).delete(Long.valueOf(id));
    }

    @Test
    @DisplayName("save method, return response entity not found")
    void whenUserNull_thenReturnResponseEntityNotFoundDelete(){
        String id = "4";
        User user = null;

        when(userService.findById(Long.valueOf(id))).thenReturn(user);

        ResponseEntity<?> save = userController.save(id);
        ResponseEntity<?> responseEntityNotFound = ResponseEntity.notFound().build();

        assertEquals(save, responseEntityNotFound);
        verify(userService, times(1)).findById(Long.valueOf(id));
    }

    @Test
    @DisplayName("save method, return response entity unauthorized")
    void whenIncorrectUserDetails_thenReturnResponseEntityUnauthorized(){
        String id = "4";
        User user = new User();
        user.setId(Long.valueOf(id));
        user.setEmail("toto3@toto.com");
        user.setPassword("test!1234");
        user.setFirstName("toto");
        user.setLastName("toto");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.parse("2023-09-12T23:08:17"));
        user.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:08:18"));

        when(userService.findById(Long.valueOf(id))).thenReturn(user);

        // Different email to cause unauthorized response
        UserDetails userDetails = UserDetailsImpl.builder().username("different@email.com").build();
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);

        ResponseEntity<?> save = userController.save(id);
        assertEquals(save.getStatusCode(),HttpStatus.UNAUTHORIZED);
    }

    @Test
    @DisplayName("save method, return response entity bad request")
    void whenIdInvalidFormat_thenReturnResponseEntityBadRequestSave(){
        String id = "invalid_id";
        assertThrows(NumberFormatException.class, () -> { Long.valueOf(id); });
        ResponseEntity<?> save = userController.save(id);
        ResponseEntity<?> badRequestResponse = ResponseEntity.badRequest().build();
        assertEquals(save,badRequestResponse);
    }
}
