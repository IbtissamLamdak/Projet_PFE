package fr.norsys.gestionpatrimoine.patrimoine.consommable.repository;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.Consommable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsommableRepository extends JpaRepository<Consommable, Long> {
}