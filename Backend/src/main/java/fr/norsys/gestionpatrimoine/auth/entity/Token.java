package fr.norsys.gestionpatrimoine.auth.entity;

import fr.norsys.gestionpatrimoine.auth.enums.TokenType;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tokens")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "token", unique = true, nullable = false)
    private String token;
    @Enumerated(EnumType.STRING)
    @Column(name = "token_type")
    private TokenType type;
    @Column(name = "revoked")
    public boolean revoked;
    @Column(name = "expired")
    public boolean expired;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
}
