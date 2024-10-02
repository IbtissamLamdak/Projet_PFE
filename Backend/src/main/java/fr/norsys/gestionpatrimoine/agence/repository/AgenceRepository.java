package fr.norsys.gestionpatrimoine.agence.repository;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenceRepository extends JpaRepository<Agence, Long> {
}
