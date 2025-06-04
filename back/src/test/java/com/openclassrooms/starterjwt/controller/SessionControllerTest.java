package com.openclassrooms.starterjwt.controller;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @InjectMocks
    private SessionController sessionController;

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    @BeforeEach
    public void setUp(){
        sessionController = new SessionController(sessionService,sessionMapper);
    }

    @Test
    @DisplayName("findById method, return response entity OK")
    void whenUserId_thenReturnResponseEntityOK(){
        String id = "4";
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();

        when(sessionService.getById(Long.valueOf(id))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().body(sessionDto);
        ResponseEntity<?> findById = sessionController.findById(id);

        assertEquals(findById.getStatusCode(), HttpStatus.OK);
        assertEquals(findById, responseEntityOK);
    }

    @Test
    @DisplayName("findById method, return not found response entity")
    void whenSessionNull_thenResponseEntityNotFound(){
        String id = "0";
        Session session = null;

        when(sessionService.getById(Long.valueOf(id))).thenReturn(session);
        ResponseEntity<?> findById = sessionController.findById(id);
        assertEquals(findById.getStatusCode(),  HttpStatus.NOT_FOUND);
    }

    @Test
    @DisplayName("findById method, return response entity bad request")
    void whenNumberFormatException_thenReturnResponseEntityBadRequest(){
        String id = "invalid_id";

        assertThrows(NumberFormatException.class, () -> { Long.valueOf(id); });
        ResponseEntity<?> findById = sessionController.findById(id);
        ResponseEntity<?> badRequestResponse = ResponseEntity.badRequest().build();
        assertEquals(findById, badRequestResponse);
    }

    @Test
    @DisplayName("findAll method, return response entity OK")
    void whenSessionList_thenReturnResponseEntityOK(){
        List<Session> sessions = new ArrayList<>();
        when(sessionService.findAll()).thenReturn(sessions);
        List<SessionDto> sessionDto = sessionMapper.toDto(sessions);

        ResponseEntity<?> responseEntityOK = ResponseEntity.ok(sessionDto);
        ResponseEntity<?> findAll = sessionController.findAll();

        assertEquals(findAll, responseEntityOK);
    }

    @Test
    @DisplayName("create method, return response entity OK")
    void whenSessionDTO_thenReturnResponseEntityOK(){
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);

        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().body(sessionMapper.toDto(session));
        ResponseEntity<?> create = sessionController.create(sessionDto);

        assertEquals(create, responseEntityOK);
    }

    @Test
    @DisplayName("update method, return response entity OK")
    void whenSessionIdAndSessionDtoValid_thenReturnResponseEntityOK(){
        String id = "1";
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();

        when(sessionService.update(Long.parseLong(id), sessionMapper.toEntity(sessionDto))).thenReturn(session);

        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().body(sessionMapper.toDto(session));
        ResponseEntity<?> update = sessionController.update(id,sessionDto);

        assertEquals(update, responseEntityOK);
    }

    @Test
    @DisplayName("update method, return bad request")
    void whenInvalidId_thenReturnResponseEntityBadRequest(){
        String id = "invalid_id";
        SessionDto sessionDto = new SessionDto();

        assertThrows(NumberFormatException.class, () -> { Long.valueOf(id);});
        ResponseEntity<?> update = sessionController.update(id, sessionDto);
        ResponseEntity<?> responseEntityBadRequest = ResponseEntity.badRequest().build();
        assertEquals(update, responseEntityBadRequest);
    }

    @Test
    @DisplayName("save method, return response entity bad request")
    void whenSessionId_thenReturnResponseEntityOK(){
        String id = "1";
        Session session = new Session();
        when(sessionService.getById(Long.valueOf(id))).thenReturn(session);
        sessionService.delete(Long.valueOf(id));
        ResponseEntity<?> save = sessionController.save(id);
        ResponseEntity<?> responseEntityOK = ResponseEntity.ok().build();
        assertEquals(save, responseEntityOK);
        verify(sessionService, times(2)).delete(Long.valueOf(id));
    }

    @Test
    @DisplayName("save method, return not found response entity")
    void whenSessionNull_thenReturnResponseEntityNotFound(){
        String id = "0";
        Session session = null;

        when(sessionService.getById(Long.valueOf(id))).thenReturn(session);

        ResponseEntity<?> responseEntityNotFound = ResponseEntity.notFound().build();
        ResponseEntity<?> save = sessionController.save(id);

        assertEquals(save, responseEntityNotFound);
    }

    @Test
    @DisplayName("save method, return bad request response entity")
    void whenSessionIdInvalid_thenReturnResponseEntityBadRequest(){
        String id = "invalid_id";
        assertThrows(NumberFormatException.class, () -> {Long.valueOf(id);});
        ResponseEntity<?> save = sessionController.save(id);
        ResponseEntity<?> responseEntityBadRequest = ResponseEntity.badRequest().build();
        assertEquals(save,responseEntityBadRequest);
    }

    @Test
    @DisplayName("participate method, return response entity OK")
    void whenIdAndUserId_thenReturnResponseEntityOKParticipate(){
        String id = "1";
        String userId = "1";

        sessionService.participate(Long.parseLong(id), Long.parseLong(userId));
        assertEquals(sessionController.participate(id,userId), ResponseEntity.ok().build());
        verify(sessionService, times(2)).participate(Long.parseLong(id), Long.parseLong(userId));
    }

    @Test
    @DisplayName("participate method, return response entity bad request")
    void whenIdAndUserIdInvalid_thenReturnResponseEntityBadRequest(){
        String id = "invalid_id";
        String userId = "invalid_userId";

        assertThrows(NumberFormatException.class, () -> {Long.valueOf(id);});

        ResponseEntity<?> participate = sessionController.participate(id, userId);
        ResponseEntity<?> responseEntityBadRequest = ResponseEntity.badRequest().build();
        assertEquals(participate,responseEntityBadRequest);
    }

    @Test
    @DisplayName("noLongerParticipate method, return response entity OK")
    void whenIdAndUserId_thenReturnResponseEntityOKNoParticipate(){
        String id = "1";
        String userId = "1";

        sessionService.noLongerParticipate(Long.parseLong(id), Long.parseLong(userId));
        assertEquals(sessionController.noLongerParticipate(id,userId), ResponseEntity.ok().build());
        verify(sessionService, times(2)).noLongerParticipate(Long.parseLong(id), Long.parseLong(userId));
    }

    @Test
    @DisplayName("participate method, return response entity bad request")
    void whenIdAndUserIdInvalid_thenReturnResponseEntityBadRequestNoParticipate(){
        String id = "invalid_id";
        String userId = "invalid_userId";

        assertThrows(NumberFormatException.class, () -> {Long.valueOf(id);});

        ResponseEntity<?> noLongerParticipate = sessionController.noLongerParticipate(id, userId);
        ResponseEntity<?> responseEntityBadRequest = ResponseEntity.badRequest().build();
        assertEquals(noLongerParticipate,responseEntityBadRequest);
    }
}
