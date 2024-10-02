package fr.norsys.gestionpatrimoine.fournisseur.repository;

import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
}
