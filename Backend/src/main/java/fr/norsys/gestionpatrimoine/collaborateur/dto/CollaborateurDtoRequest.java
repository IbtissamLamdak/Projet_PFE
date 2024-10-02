package fr.norsys.gestionpatrimoine.collaborateur.dto;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link Collaborateur}
 */
public record CollaborateurDtoRequest(
        @NotNull(message = "CIN ne doit pas être nul")
        @NotBlank(message = "CIN ne doit pas être vide")
        @NotEmpty(message = "CIN ne doit pas être vide")
        String CIN,
        @NotNull(message = "Nom ne doit pas être nul")
        @NotBlank(message = "Nom ne doit pas être vide")
        @NotEmpty(message = "Nom ne doit pas être vide")
        String nom,
        @NotNull(message = "Prenom ne doit pas être nul")
        @NotBlank(message = "Prenom ne doit pas être vide")
        @NotEmpty(message = "Prenom ne doit pas être vide")
        String prenom,
        @NotNull(message = "Date d'embauche ne doit pas être nul")
        LocalDate dateEmbauche,
        @NotNull(message = "Poste ne doit pas être nul")
        @NotBlank(message = "Poste ne doit pas être vide")
        @NotEmpty(message = "Poste ne doit pas être vide")
        String poste,
        @NotNull(message = "Specialite ne doit pas être nul")
        @NotBlank(message = "Specialite ne doit pas être vide")
        @NotEmpty(message = "Specialite ne doit pas être vide")
        String specialite,
        @NotNull(message = "Email ne doit pas être nul")
        @NotBlank(message = "Email ne doit pas être vide")
        @NotEmpty(message = "Email ne doit pas être vide")
        String email,
        @NotNull(message = "Telephone ne doit pas être nul")
        @NotBlank(message = "Telephone ne doit pas être vide")
        @NotEmpty(message = "Telephone ne doit pas être vide")
        String telephone,
        @NotNull(message = "Addresse ne doit pas être nul")
        @NotBlank(message = "Addresse ne doit pas être vide")
        @NotEmpty(message = "Addresse ne doit pas être vide")
        String adresse,
        @NotNull(message = "Agence ne doit pas être nul")
        Long agenceId
) implements Serializable { }