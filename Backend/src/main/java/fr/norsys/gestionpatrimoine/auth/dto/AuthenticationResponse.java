package fr.norsys.gestionpatrimoine.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import fr.norsys.gestionpatrimoine.auth.enums.TokenType;

public record AuthenticationResponse(
        @JsonProperty("accessToken")
        String accessToken,
        @JsonProperty("role")
        String role,
        @JsonProperty("tokenType")
        TokenType tokenType
) {
}
