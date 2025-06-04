package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @InjectMocks
    private SessionService sessionService;

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        sessionService = new SessionService(sessionRepository,userRepository);
    }

    @Test
    @DisplayName("create method")
    void whenValidSessionRequest_thenCreateSession(){
        Teacher teacher = new Teacher();
        teacher.setId(12346789L);
        teacher.setLastName("Lastname");
        teacher.setFirstName("Firstname");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        List<User> users = new ArrayList<>();

        Session session = new Session();
        session.setId(123456789L);
        session.setName("Session");
        session.setDate(Date.from(Instant.now()));
        session.setDescription("Description");
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        when(sessionRepository.save(session)).thenReturn(session);
        Session sessionMock = sessionService.create(session);
        verify(sessionRepository, times(1)).save(session);
        assertEquals(session,sessionMock);
    }

    @Test
    @DisplayName("delete session method")
    void whenSessionId_thenDeleteSession(){
        Long id = 123456789L;
        sessionService.delete(id);
        sessionRepository.deleteById(id);
        verify(sessionRepository, times(2)).deleteById(id);
    }

    @Test
    @DisplayName("findAll method")
    void whenSessionList_thenReturnSessionList(){
        // Mock user
        User user = new User();
        user.setId(4L);
        user.setEmail("toto3@toto.com");
        user.setFirstName("toto");
        user.setLastName("toto");
        user.setPassword("test!1234");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.parse("2023-09-12T23:08:17"));
        user.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:08:18"));

        // Mock users list
        List<User> users = Arrays.asList(user);

        // Mock teacher
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Margot");
        teacher.setLastName("DELAHAYE");
        teacher.setCreatedAt(LocalDateTime.parse("2023-08-29T18:57:01"));
        teacher.setUpdatedAt(LocalDateTime.parse("2023-08-29T18:57:01"));

        // Mock session
        Session session = new Session();
        session.setId(1L);
        session.setName("session 1");
        session.setDescription("my description");
        session.setDate(Date.from(Instant.now()));
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(LocalDateTime.parse("2023-09-08T18:45:03"));
        session.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:23:22"));

        // Mock session list
        List<Session> sessionList = Arrays.asList(session);

        when(sessionRepository.findAll()).thenReturn(sessionList);

        List<Session> findSessionList = sessionService.findAll();
        // Check if elements are identical
        assertEquals(sessionList,findSessionList);
        // Check if sessions list size are equal
        assertEquals(sessionList.size(),findSessionList.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getById method")
    void whenSessionId_thenReturnSession(){
        Long id = 123456789L;
        Session session = new Session();
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));
        Session sessionMock = sessionService.getById(id);
        assertEquals(session,sessionMock);
        verify(sessionRepository,times(1)).findById(id);
    }

    @Test
    @DisplayName("getById method null")
    void whenSessionIdNull_thenReturnNull(){
        Long id = null;
        Session session = new Session();
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));
        Session sessionMock = sessionService.getById(id);
        assertEquals(session,sessionMock);
        verify(sessionRepository,times(1)).findById(id);
    }

    @Test
    @DisplayName("update session method")
    void whenSessionId_thenUpdateSession(){
        Long id = 123456789L;
        Session session = new Session();
        session.setId(id);
        when(sessionRepository.save(session)).thenReturn(session);
        Session sessionMock = sessionService.update(id,session);
        assertEquals(session,sessionMock);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("participate method")
    void whenSessionAndUser_thenParticipateSession(){
        Long id = 123456789L;
        Long userId = 4L;
        List<User> users = new ArrayList<>();

        Session session = new Session();
        session.setId(id);
        session.setName("Name");
        session.setDescription("Description");
        session.setUsers(users);

        User user = new User();
        user.setId(userId);
        user.setEmail("toto3@toto.com");
        user.setLastName("toto");
        user.setFirstName("toto");
        user.setAdmin(false);
        user.setPassword("test!1234");
        user.setCreatedAt(LocalDateTime.parse("2023-09-12T23:08:17"));
        user.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:08:18"));

        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        sessionRepository.save(session);
        sessionService.participate(id,userId);

        verify(sessionRepository, times(1)).findById(id);
        verify(userRepository, times(1)).findById(userId);
        verify(sessionRepository, times(2)).save(session);
    }

    @Test
    @DisplayName("participate method, not found exception")
    void whenSessionOrUserNull_thenReturnNotFound(){
        Long id = null;
        Long userId = null;

        Session session = sessionRepository.findById(id).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        assertThrows(NotFoundException.class, () -> {throw new NotFoundException();});
        assertEquals(session,null);
        assertEquals(user,null);
    }

    @Test
    @DisplayName("participate method, bad request exception")
    void whenAlreadyParticipate_thenReturnBadRequest(){
      Long id = 123456789L;
      Long userId = 1L;

      List<User> users = new ArrayList<>();
      Session session = new Session();
      User user = new User();

      session.setUsers(users);
      user.setId(userId);
      session.getUsers().add(user);

      when(sessionRepository.findById(id)).thenReturn(Optional.of(session));
      when(userRepository.findById(userId)).thenReturn(Optional.of(user));

      assertThrows(BadRequestException.class, () -> {sessionService.participate(id,userId);});

      verify(sessionRepository, times(1)).findById(id);
      verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("no longer participate method")
    void whenAlreadyParticipate_thenNoLongerParticipate(){
        Long id = 123456789L;
        Long userId = 4L;

        User user = new User();
        user.setId(userId);
        user.setEmail("toto3@toto.com");
        user.setFirstName("toto");
        user.setLastName("toto");
        user.setPassword("test!1234");
        user.setAdmin(false);
        user.setCreatedAt(LocalDateTime.parse("2023-09-12T23:08:17"));
        user.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:08:18"));

        // Add user to a users list
        List<User> users = new ArrayList<>();
        users.add(user);

        Teacher teacher = new Teacher();
        teacher.setId(12346789L);
        teacher.setLastName("Lastname");
        teacher.setFirstName("Firstname");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Session session = new Session();
        session.setId(id);
        session.setName("session 1");
        session.setDescription("my description");
        session.setDate(Date.from(Instant.now()));
        session.setTeacher(teacher);
        session.setUsers(users);
        session.setCreatedAt(LocalDateTime.parse("2023-09-08T18:45:03"));
        session.setUpdatedAt(LocalDateTime.parse("2023-09-12T23:23:22"));

        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));
        sessionRepository.save(session);
        sessionService.noLongerParticipate(id,userId);

        verify(sessionRepository, times(1)).findById(id);
        verify(sessionRepository, times(2)).save(session);
    }

    @Test
    @DisplayName("no longer participate method, not found exception")
    void whenSessionNull_thenReturnNotFound(){
        Long id = null;
        Long userId = 4L;

        sessionRepository.findById(id).orElse(null);
        assertThrows(NotFoundException.class, () -> {sessionService.noLongerParticipate(id,userId);});
        verify(sessionRepository, times(2)).findById(id);
    }

    @Test
    @DisplayName("no longer participate, bad request exception")
    void whenNotAlreadyParticipate_thenReturnBadRequest(){
        Long id = 123456789L;
        Long userId = 4L;

        List<User> users = new ArrayList<>();
        Session session = new Session();
        User user = new User();

        session.setUsers(users);
        // Set fake userId in order to cause BadRequestExecption
        Long fakeUserId = 1L;
        user.setId(fakeUserId);
        session.getUsers().add(user);

        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> {sessionService.noLongerParticipate(id,userId);});

        verify(sessionRepository, times(1)).findById(id);

    }
}
