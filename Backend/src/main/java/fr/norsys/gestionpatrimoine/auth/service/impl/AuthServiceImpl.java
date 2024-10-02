package fr.norsys.gestionpatrimoine.auth.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import fr.norsys.gestionpatrimoine.auth.config.JwtAuthFilter;
import fr.norsys.gestionpatrimoine.auth.config.JwtTokenProvider;
import fr.norsys.gestionpatrimoine.auth.dto.AuthenticationResponse;
import fr.norsys.gestionpatrimoine.auth.dto.LoginRequestDto;
import fr.norsys.gestionpatrimoine.auth.dto.UserInfoDtoResponse;
import fr.norsys.gestionpatrimoine.auth.entity.Token;
import fr.norsys.gestionpatrimoine.auth.entity.UserModel;
import fr.norsys.gestionpatrimoine.auth.mapper.UserMapper;
import fr.norsys.gestionpatrimoine.auth.repository.TokenRepository;
import fr.norsys.gestionpatrimoine.auth.service.AuthService;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import fr.norsys.gestionpatrimoine.utilisateur.repository.UtilisateurRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;

import static fr.norsys.gestionpatrimoine.auth.enums.TokenType.*;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UtilisateurRepository utilisateurRepository;
    private final TokenRepository tokenRepository;
    @Value("${jwt.refresh.cookie-name}")
    private String refreshTokenCookieName;
    @Value("${jwt.refresh.expiration-milliseconds}")
    private long jwtRefreshExpirationDate;
    @Override
    public AuthenticationResponse authenticate(LoginRequestDto loginDto, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDto.username(), loginDto.password()
                )
        );

        Utilisateur utilisateur = getUser(loginDto.username());
        UserModel user = getUserModel(utilisateur);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        revokeAllUserTokens(utilisateur);
//        saveUserToken(utilisateur, accessToken);
        saveUserToken(utilisateur, refreshToken);

        Cookie refreshTokenCookie = generateTokenCookie(refreshTokenCookieName, refreshToken, (int)jwtRefreshExpirationDate);
        response.addCookie(refreshTokenCookie);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new AuthenticationResponse(accessToken, user.getRole().name(), BEARER);
    }
    @Override
    public UserInfoDtoResponse getAuthenticateUser(String username) {
        Utilisateur utilisateur = getUser(username);

        // get collaborateur associated with utilisateur
        Collaborateur collaborateur = utilisateur.getCollaborateur();

        if(collaborateur == null)
            return UserMapper.toDto(utilisateur);

        UserInfoDtoResponse userInfoDtoResponse = new UserInfoDtoResponse(
                utilisateur.getUsername(),
                utilisateur.getEmail(),
                utilisateur.getRole(),
                utilisateur.isActif(),
                collaborateur.getNom(),
                collaborateur.getPrenom(),
                collaborateur.getTelephone(),
                collaborateur.getCIN(),
                collaborateur.getAdresse(),
                collaborateur.getPoste(),
                collaborateur.getSpecialite()
        );

        return userInfoDtoResponse;
    }
    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = isValidRefreshToken(request);

        String username = jwtTokenProvider.extractUsername(refreshToken);

        if(username != null) {
            Utilisateur utilisateur = getUser(username);
            UserModel user = getUserModel(utilisateur);
            String accessToken = jwtTokenProvider.generateAccessToken(user);

//            revokeAllUserTokens(utilisateur);
//            saveUserToken(utilisateur, accessToken);

            Cookie refreshTokenCookie = generateTokenCookie(refreshTokenCookieName, refreshToken, (int)jwtRefreshExpirationDate);
            response.addCookie(refreshTokenCookie);

            AuthenticationResponse authenticationResponse = new AuthenticationResponse(
                    accessToken,
                    user.getRole().name(),
                    BEARER
            );

            try {
                new ObjectMapper().writeValue(response.getOutputStream(), authenticationResponse);
            } catch (IOException e) {
                throw new AppException(HttpStatus.UNAUTHORIZED, e.getMessage());
            }
        }
    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = isValidRefreshToken(request);
        String username = jwtTokenProvider.extractUsername(refreshToken);
        if(username != null) {
            Utilisateur utilisateur = getUser(username);
            // revoke all refresh token of user
            revokeAllUserTokens(utilisateur);

            SecurityContextHolder.clearContext();

            // remove cookie
            for(Cookie cookie : request.getCookies()) {
                if(cookie.getName().equals(refreshTokenCookieName)) {
                    cookie.setMaxAge(0);
                    cookie.setValue(null);
                    response.addCookie(cookie);
                    return;
                }
            }
        }
        throw new AppException(HttpStatus.BAD_REQUEST, "logout failed");
    }
    private void revokeAllUserTokens(Utilisateur utilisateur) {
        var validUserToken = tokenRepository.findAllValidTokenByUtilisateur(utilisateur.getId());
        if(validUserToken.isEmpty())
            return;

        for(Token token : validUserToken) {
            if (jwtTokenProvider.extractExpirationDate(token.getToken()).before(new Date())) {
                tokenRepository.delete(token);
            } else {
                token.setExpired(true);
                token.setRevoked(true);
                tokenRepository.save(token);
            }
        }
    }
    private void saveUserToken(Utilisateur utilisateur, String accessToken) {
        Token token = new Token();
        token.setToken(accessToken);
        token.setUtilisateur(utilisateur);
        token.setType(BEARER);
        token.setRevoked(false);
        token.setExpired(false);

        tokenRepository.save(token);
    }
    private Utilisateur getUser(String username) {
        return utilisateurRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("Utilisateur", "username", username)
        );
    }
    private UserModel getUserModel(Utilisateur utilisateur) {
        return new UserModel(
                utilisateur.getUsername(),
                utilisateur.getPassword(),
                utilisateur.getRole(),
                utilisateur.isActif()
        );
    }
    private Cookie generateTokenCookie(String cookieName, String value, int age) {
        Cookie cookie = new Cookie(cookieName, value);
        cookie.setSecure(true);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(age);
        cookie.setPath("/");
        return cookie;
    }
    private String isValidRefreshToken(HttpServletRequest request) {
        String refreshToken = jwtTokenProvider.extractTokenFromCookie(request);

        if(refreshToken == null)
            throw new AppException(HttpStatus.BAD_REQUEST, "Refresh Token not exist");

        String username = jwtTokenProvider.extractUsername(refreshToken);

        // check if refresh token not expired
        Token token = tokenRepository.findByToken(refreshToken).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Refresh token not found")
        );

        if(!(token.getUtilisateur().getUsername().equals(username)) || token.isExpired() || token.isRevoked()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Invalid Refresh token");
        }
        return refreshToken;
    }
}
