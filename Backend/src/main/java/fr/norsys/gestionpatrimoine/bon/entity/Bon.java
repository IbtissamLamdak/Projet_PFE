package fr.norsys.gestionpatrimoine.bon.entity;


import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


import java.time.LocalDateTime;
import java.util.Date;


@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
public class Bon {
    @Id
    @Column(name = "numero_bon", unique = true, nullable = false)
    private String numeroBon;
    private Double prix;
    private Integer quantiteDemande;
    @DateTimeFormat(pattern = "YYYY-MM-DD HH:mm")
    private LocalDateTime dateLivraison;
    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
    @ManyToOne
    @JoinColumn(name = "materiel_id")
    private Materiel materiel;
}
