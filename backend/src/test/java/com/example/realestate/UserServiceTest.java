package com.example.realestate;

import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.BadRequestException;
import com.example.realestate.security.JwtTokenProvider;
import com.example.realestate.user.Role;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import com.example.realestate.user.UserService;
import com.example.realestate.user.dto.AuthResponse;
import com.example.realestate.user.dto.LoginRequest;
import com.example.realestate.user.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private UserService userService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("TestPass123!");
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Doe");
        registerRequest.setRole(Role.ROLE_USER);
    }

    @Test
    void register_Successful() {
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        
        User savedUser = new User("test@example.com", "encodedPassword", "Jane", "Doe", Role.ROLE_USER);
        savedUser.setId(UUID.randomUUID());
        
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateTokenFromUserId(any(), any(), any())).thenReturn("mock-jwt-token");

        AuthResponse response = userService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("mock-jwt-token", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsBadRequestException() {
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_AdminRole_ForcedToUserRole() {
        registerRequest.setRole(Role.ROLE_ADMIN);
        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        User savedUser = new User("test@example.com", "encodedPassword", "Jane", "Doe", Role.ROLE_USER);
        savedUser.setId(UUID.randomUUID());

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User passed = invocation.getArgument(0);
            assertEquals(Role.ROLE_USER, passed.getRole());
            return savedUser;
        });
        when(tokenProvider.generateTokenFromUserId(any(), any(), any())).thenReturn("mock-jwt-token");

        AuthResponse response = userService.register(registerRequest);
        assertEquals(Role.ROLE_USER, response.getRole());
    }
}
