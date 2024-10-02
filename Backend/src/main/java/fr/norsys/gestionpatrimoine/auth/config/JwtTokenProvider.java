package fr.norsys.gestionpatrimoine.auth.config;

import fr.norsys.gestionpatrimoine.auth.entity.UserModel;
import fr.norsys.gestionpatrimoine.auth.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Component
public class JwtTokenProvider {
    private static final String ALGORITHM = "HS256";
    private static final String DEFAULT_SIGNATURE_ALGORITHM = SignatureAlgorithm.forName(ALGORITHM).getValue();
    @Value("${jwt.secret}")
    private String jwtSecret;
    @Value("${jwt.refresh.cookie-name}")
    private String refreshTokenCookieName;
    @Value("${jwt.access.expiration-milliseconds}")
    private long jwtAccessExpirationDate;
    @Value("${jwt.refresh.expiration-milliseconds}")
    private long jwtRefreshExpirationDate;

    // Generate JWT access token
    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtAccessExpirationDate);
    }

    // Generate JWT refresh token
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtRefreshExpirationDate);
    }

    // Build token
    public String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        String username = userDetails.getUsername();
        Role role = ((UserModel)userDetails).getRole();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + expiration);

        return Jwts.builder()
                .setClaims(extraClaims)
                .claim("role", role.name())
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(decodeSecretKey(jwtSecret), SignatureAlgorithm.forName(DEFAULT_SIGNATURE_ALGORITHM))
                .compact();
    }

    // Validate JWT Token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        return isTokenValid(token) && userDetails.getUsername().equals(extractUsername(token)) && !isTokenExpired(token);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(decodeSecretKey(jwtSecret))
                    .build()
                    .parseClaimsJws(token);
        } catch (JwtException e) {
            return false;
        }
        return true;
    }

    // Get username from JWT Token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    // Get expiration date from JWT Token
    public Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    // Check if JWT Token is expired
    public boolean isTokenExpired(String token) {
        Date expirationDate = extractExpirationDate(token);
        if (expirationDate == null) {
            return false;
        }
        Date currentDate = new Date();
        return expirationDate.before(currentDate);
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(decodeSecretKey(jwtSecret))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    private Key decodeSecretKey(String secret) {
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(decodedKey);
    }
    public String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(refreshTokenCookieName)) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
