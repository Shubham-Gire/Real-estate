package com.example.realestate.user;

import com.example.realestate.common.audit.AuditLogService;
import com.example.realestate.common.exception.BadRequestException;
import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.security.JwtTokenProvider;
import com.example.realestate.user.dto.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists.");
        }

        Role assignedRole = request.getRole() != null ? request.getRole() : Role.ROLE_USER;
        // Prevent registering directly as ADMIN
        if (assignedRole == Role.ROLE_ADMIN) {
            assignedRole = Role.ROLE_USER;
        }

        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName().trim(),
                request.getLastName().trim(),
                assignedRole
        );
        user.setPhone(request.getPhone());
        user.setAgencyName(request.getAgencyName());
        user.setLicenseNumber(request.getLicenseNumber());
        user.setStatus(UserStatus.ACTIVE);

        User savedUser = userRepository.save(user);

        auditLogService.record(
                savedUser.getId(),
                savedUser.getEmail(),
                "USER_REGISTERED",
                "USER",
                savedUser.getId().toString(),
                "New account registered with role " + savedUser.getRole(),
                null
        );

        String token = tokenProvider.generateTokenFromUserId(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRole(),
                savedUser.getStatus(),
                savedUser.getAvatarUrl(),
                savedUser.getAgencyName()
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new BadRequestException("This account has been suspended by the platform administrator.");
        }

        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getStatus(),
                user.getAvatarUrl(),
                user.getAgencyName()
        );
    }

    @Transactional(readOnly = true)
    public UserSummaryDTO getCurrentUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserSummaryDTO(user);
    }

    @Transactional
    public UserSummaryDTO updateProfile(UUID userId, UserProfileUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFirstName(dto.getFirstName().trim());
        user.setLastName(dto.getLastName().trim());
        user.setPhone(dto.getPhone());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setAgencyName(dto.getAgencyName());
        user.setLicenseNumber(dto.getLicenseNumber());
        user.setBio(dto.getBio());

        User updatedUser = userRepository.save(user);
        return new UserSummaryDTO(updatedUser);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        auditLogService.record(
                user.getId(),
                user.getEmail(),
                "PASSWORD_CHANGED",
                "USER",
                user.getId().toString(),
                "User changed their password",
                null
        );
    }

    @Transactional(readOnly = true)
    public User getUserEntity(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
