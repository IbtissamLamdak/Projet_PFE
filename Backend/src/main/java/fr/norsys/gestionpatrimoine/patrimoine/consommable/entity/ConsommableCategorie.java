package fr.norsys.gestionpatrimoine.patrimoine.consommable.entity;

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
@Table(name = "consommable_categorie")
public class ConsommableCategorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nom", unique = true, nullable = false)
    private String nom;
    @OneToMany(mappedBy = "consommableCategorie")
    private Set<Consommable> consommables;
}
