package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @InjectMocks
    private TeacherService teacherService;

    @Mock
    private TeacherRepository teacherRepository;

    @BeforeEach
    public void setUp(){
        teacherService = new TeacherService(teacherRepository);
    }

    @Test
    @DisplayName("findAll method")
    void whenTeacherList_thenReturnTeacherList(){
        List<Teacher> teacherList = new ArrayList<>();

        when(teacherRepository.findAll()).thenReturn(teacherList);

        List<Teacher> teacherListMock = teacherService.findAll();
        assertEquals(teacherList,teacherListMock);
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("findById method")
    void whenTeacherId_thenReturnTeacher(){
        Long id = 123456789L;
        Teacher teacher = new Teacher();

        when(teacherRepository.findById(id)).thenReturn(Optional.of(teacher));

        Teacher teacherMock = teacherService.findById(id);
        assertEquals(teacher,teacherMock);
        verify(teacherRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("findById null")
    void whenTeacherIdNull_thenReturnNull(){
        // When id is null
        Long id = null;
        Teacher teacher = new Teacher();
        when(teacherRepository.findById(id)).thenReturn(Optional.of(teacher));
        Teacher teacherMock = teacherService.findById(id);
        assertEquals(teacher,teacherMock);
        verify(teacherRepository, times(1)).findById(id);
    }
}
