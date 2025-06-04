package com.openclassrooms.starterjwt.models;

import lombok.Data;

import lombok.experimental.Accessors;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;


import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@Data
@Accessors(chain = true)
@SpringBootTest
public class UserTest {

    @Test
    void testUserEntity() {
        User user = new User();
        user.equals(new User());
        user.hashCode();
        user.toString();
        assertNotNull(user.toString());
    }

    @Test
    void testUserEntityBuilder() {
        User user = new User();
        user.equals(User.builder()
                .email("email@email.com")
                .id(5L)
                .admin(false)
                .lastName("lastname")
                .firstName("firstname")
                .password("password")
                .createdAt(LocalDateTime.parse("2023-10-01T12:57:09"))
                .updatedAt(LocalDateTime.parse("2023-10-01T12:57:10"))
                .build());
        assertNotNull(user.toString());
    }
}
