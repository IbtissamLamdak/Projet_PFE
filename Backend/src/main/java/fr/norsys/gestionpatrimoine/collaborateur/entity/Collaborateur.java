package fr.norsys.gestionpatrimoine.collaborateur.entity;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor // lombok
@NoArgsConstructor  // lombok
@Setter  // lombok
@Getter
@Entity
public class Collaborateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "CIN")
    private String CIN;
    @Column(name = "nom")
    private String nom;
    @Column(name = "prenom")
    private String prenom;
    @Column(name = "date_embauche")
    private LocalDate dateEmbauche;
    @Column(name = "poste")
    private String poste;
    @Column(name = "salaire")
    private double salaire;
    @Column(name= "specialite")
    private String specialite;
    @Column(name = "email")
    private String email;
    @Column(name = "telephone")
    private String telephone;
    @Column(name = "adresse")
    private String adresse;
    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;
    @OneToOne(mappedBy = "collaborateur")
    private Utilisateur utilisateur;
}