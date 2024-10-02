package fr.norsys.gestionpatrimoine.patrimoine.materiel.entity;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.besoin.entity.Besoin;
import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Inheritance(strategy=InheritanceType.JOINED)
@DiscriminatorColumn(name="materiel_type")
public class Materiel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nom")
    private String nom;
    @Column(name = "description")
    private String description;
    @Column(name = "marque")
    private String marque;
    @Column(name = "quantite_total")
    private Long quantite;
    @OneToMany(mappedBy = "materiel")
    private Set<Bon> bons;
    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;
    @OneToMany(mappedBy = "materiel")
    private Set<Besoin> besoins;
}
