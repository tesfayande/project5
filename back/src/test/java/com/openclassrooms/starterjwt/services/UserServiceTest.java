package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        userService = new UserService(userRepository);
    }

    @Test
    @DisplayName("delete method")
    void whenUserId_thenDeleteById(){
        // When id
        Long id = 123456789L;

        // Then delete by id , call methods
        userService.delete(id);
        userRepository.deleteById(id);

        verify(userRepository,times(2)).deleteById(id);
    }

    @Test
    @DisplayName("findById method")
    void whenUserId_thenFindById(){
        // When id
        Long id = 123456789L;
        User user = new User();

        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User userMock = userService.findById(id);
        assertEquals(user,userMock);
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("null")
    void whenUserIsNull_thenReturnNull(){
        // When id is null
        Long id = null;
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));
        User mockUser = userService.findById(id);
        assertEquals(user,mockUser);
        verify(userRepository, times(1)).findById(id);
    }
}
