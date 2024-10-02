package fr.norsys.gestionpatrimoine.auth.repository;

import fr.norsys.gestionpatrimoine.auth.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    @Query(value = """
            select t from Token t inner join Utilisateur u\s
            on t.utilisateur.id = u.id\s
            where u.id = :utilisateurId and (t.expired = false or t.revoked = false)\s
            """)
    List<Token> findAllValidTokenByUtilisateur(Long utilisateurId);
    Optional<Token> findByToken(String token);
}