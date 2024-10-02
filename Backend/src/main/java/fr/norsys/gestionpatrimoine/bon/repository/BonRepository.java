package fr.norsys.gestionpatrimoine.bon.repository;

import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BonRepository extends JpaRepository<Bon, String> {
    boolean existsBonByNumeroBon(String numeroBon);
}
