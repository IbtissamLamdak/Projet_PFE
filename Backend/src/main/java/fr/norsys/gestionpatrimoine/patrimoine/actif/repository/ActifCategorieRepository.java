package fr.norsys.gestionpatrimoine.patrimoine.actif.repository;

import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.ActifCategorie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActifCategorieRepository extends JpaRepository<ActifCategorie, Long> {
    Optional<ActifCategorie> findByNom(String nom);
}