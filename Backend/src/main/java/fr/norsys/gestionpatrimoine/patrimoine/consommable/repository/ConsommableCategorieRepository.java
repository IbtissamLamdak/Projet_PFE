package fr.norsys.gestionpatrimoine.patrimoine.consommable.repository;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.ConsommableCategorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsommableCategorieRepository extends JpaRepository<ConsommableCategorie, Long> {
    Optional<ConsommableCategorie> findByNom(String nom);
}