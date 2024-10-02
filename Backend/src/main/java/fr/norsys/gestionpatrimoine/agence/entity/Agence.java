package fr.norsys.gestionpatrimoine.agence.entity;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor // lombok
@NoArgsConstructor  // lombok
@Setter  // lombok
@Getter
@Entity
public class Agence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String nom;
    // localisation
    private String localisation;
    private String adresse;
    private String ville;
    private String pays;
    private double longitude;
    private double latitude;
    // localisation-end
    private String description;
    @OneToMany(mappedBy = "agence")
    private Set<Materiel> materiels;
    @OneToMany(mappedBy = "agence")
    private Set<Collaborateur> collaborateurs;
}