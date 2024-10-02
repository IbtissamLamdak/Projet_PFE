package fr.norsys.gestionpatrimoine.plateau.repository;


import fr.norsys.gestionpatrimoine.plateau.entity.Plateau;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlateauRepository extends JpaRepository<Plateau, Long> {
    List<Plateau> findAllByAgenceId(long id);
}
