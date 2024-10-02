package fr.norsys.gestionpatrimoine.auth.service;

import fr.norsys.gestionpatrimoine.auth.dto.AuthenticationResponse;
import fr.norsys.gestionpatrimoine.auth.dto.LoginRequestDto;
import fr.norsys.gestionpatrimoine.auth.dto.UserInfoDtoResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


public interface AuthService {
    AuthenticationResponse authenticate(LoginRequestDto loginDto, HttpServletResponse response);
    void refreshToken(HttpServletRequest request, HttpServletResponse response);
    UserInfoDtoResponse getAuthenticateUser(String username);
    void logout(HttpServletRequest request, HttpServletResponse response);
}
