package fr.norsys.gestionpatrimoine.utilisateur.entity;


import fr.norsys.gestionpatrimoine.auth.entity.Token;
import fr.norsys.gestionpatrimoine.auth.enums.Role;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "utilisateurs")
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;
    @Column(name = "is_actif", nullable = false)
    private boolean isActif = false;
    @OneToMany(mappedBy = "utilisateur")
    private List<Token> tokens = new ArrayList<>();
    @OneToOne(mappedBy = "utilisateur", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private AccountVerification accountVerification;
    @OneToOne
    @JoinColumn(name = "collaborateur_id", nullable = true)
    private Collaborateur collaborateur;
}
