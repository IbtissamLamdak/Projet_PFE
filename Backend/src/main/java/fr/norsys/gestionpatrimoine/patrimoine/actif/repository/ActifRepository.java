package fr.norsys.gestionpatrimoine.patrimoine.actif.repository;

import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActifRepository extends JpaRepository<Actif, Long> {
}