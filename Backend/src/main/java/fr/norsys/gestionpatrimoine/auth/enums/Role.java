package fr.norsys.gestionpatrimoine.auth.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static fr.norsys.gestionpatrimoine.auth.enums.Permission.*;

@RequiredArgsConstructor
public enum Role {
    USER(Collections.emptySet()),
    MANAGER(Collections.emptySet()),
    ADMIN(Set.of(
            UTILISATEUR_CREATE,
            UTILISATEUR_READ,
            UTILISATEUR_UPDATE,
            UTILISATEUR_DELETE
    ));
    @Getter
    private final Set<Permission> permissions;
    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
