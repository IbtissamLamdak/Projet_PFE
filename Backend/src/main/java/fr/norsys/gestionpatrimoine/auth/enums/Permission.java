package fr.norsys.gestionpatrimoine.auth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    UTILISATEUR_READ("utilisateur:read"),
    UTILISATEUR_UPDATE("utilisateur:update"),
    UTILISATEUR_CREATE("utilisateur:create"),
    UTILISATEUR_DELETE("utilisateur:delete");
    @Getter
    private final String permission;
}
