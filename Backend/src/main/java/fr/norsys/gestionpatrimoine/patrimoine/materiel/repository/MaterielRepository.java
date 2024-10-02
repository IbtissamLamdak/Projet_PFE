package fr.norsys.gestionpatrimoine.patrimoine.materiel.repository;

import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterielRepository extends JpaRepository<Materiel, Long> {
}