package fr.norsys.gestionpatrimoine.reparation.repository;

import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReparationRepository extends JpaRepository<Reparation, Long>
{
}
