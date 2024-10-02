package fr.norsys.gestionpatrimoine.auth.controller;

import fr.norsys.gestionpatrimoine.auth.dto.AuthenticationResponse;
import fr.norsys.gestionpatrimoine.auth.dto.LoginRequestDto;
import fr.norsys.gestionpatrimoine.auth.dto.UserInfoDtoResponse;
import fr.norsys.gestionpatrimoine.auth.entity.UserModel;
import fr.norsys.gestionpatrimoine.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticateHandler(
            @Valid @RequestBody LoginRequestDto loginDto, HttpServletResponse response) {
        AuthenticationResponse authenticationResponse = authService.authenticate(loginDto, response);

        return new ResponseEntity<>(authenticationResponse, HttpStatus.OK);
    }
    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authService.refreshToken(request, response);
        return ResponseEntity.ok("Refreshed successfully");
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logoutHandler(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok("Logout successfully");
    }
    // get info authenticated user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/info")
    public ResponseEntity<UserInfoDtoResponse> getCurrentUser(
            @AuthenticationPrincipal UserModel userModel) {
        String username = userModel.getUsername();
        UserInfoDtoResponse response = authService.getAuthenticateUser(username);
        return ResponseEntity.ok(response);
    }
}
