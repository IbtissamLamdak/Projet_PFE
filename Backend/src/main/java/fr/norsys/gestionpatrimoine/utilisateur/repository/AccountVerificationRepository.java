package fr.norsys.gestionpatrimoine.utilisateur.repository;

import fr.norsys.gestionpatrimoine.utilisateur.entity.AccountVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountVerificationRepository extends JpaRepository<AccountVerification, Long> {
    Optional<AccountVerification> findByToken(String token);
}