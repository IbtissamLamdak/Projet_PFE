package fr.norsys.gestionpatrimoine.collaborateur.repository;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollaborateurRepository extends JpaRepository<Collaborateur, Long> {
}
