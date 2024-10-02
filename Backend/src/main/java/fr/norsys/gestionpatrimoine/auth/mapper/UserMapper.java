package fr.norsys.gestionpatrimoine.auth.mapper;

import fr.norsys.gestionpatrimoine.auth.dto.UserInfoDtoResponse;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;

public class UserMapper {
    public static UserInfoDtoResponse toDto(Utilisateur utilisateur) {
        return new UserInfoDtoResponse(
                utilisateur.getUsername(),
                utilisateur.getEmail(),
                utilisateur.getRole(),
                utilisateur.isActif(),
                null,
                null,
                null,
                null,
                null,
                null,
                null
        );
    }
}
