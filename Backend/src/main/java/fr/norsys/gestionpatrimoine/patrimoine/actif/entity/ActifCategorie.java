package fr.norsys.gestionpatrimoine.patrimoine.actif.entity;

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
@Table(name = "actif_categorie")
public class ActifCategorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nom", unique = true, nullable = false)
    private String nom;
    @OneToMany(mappedBy = "actifCategorie")
    private Set<Actif> actifs;
}
