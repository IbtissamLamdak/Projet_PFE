package fr.norsys.gestionpatrimoine.besoin.repository;

import fr.norsys.gestionpatrimoine.besoin.entity.Besoin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BesoinRepository extends JpaRepository<Besoin, Long> {
}
