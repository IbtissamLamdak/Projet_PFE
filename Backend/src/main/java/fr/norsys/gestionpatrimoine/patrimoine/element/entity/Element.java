package fr.norsys.gestionpatrimoine.patrimoine.element.entity;

import fr.norsys.gestionpatrimoine.affectation.entity.Affectation;
import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
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
@DiscriminatorValue("element")
@Table(name = "elements")
public class Element {
    @Id
    @Column(name = "numero_serie")
    private String numeroSerie;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ElementStatus status;
    @ManyToOne
    @JoinColumn(name = "actif_id")
    private Actif actif;
    @ManyToOne
    @JoinColumn(name = "bon_id")
    private Bon bon;
    @OneToMany(mappedBy = "element")
    private Set<Affectation> affectations;
    @OneToMany(mappedBy = "element")
    private Set<Maintenance> maintenance;
}
