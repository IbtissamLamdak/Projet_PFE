package fr.norsys.gestionpatrimoine.affectation.repository;

import fr.norsys.gestionpatrimoine.affectation.entity.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AffectationRepository extends JpaRepository<Affectation, Long>
{
}