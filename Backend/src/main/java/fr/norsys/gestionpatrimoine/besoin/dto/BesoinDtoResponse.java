package fr.norsys.gestionpatrimoine.besoin.dto;

import fr.norsys.gestionpatrimoine.besoin.enums.BesoinStatus;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for {@link fr.norsys.gestionpatrimoine.besoin.entity.Besoin}
 */
public record BesoinDtoResponse(
        Long id,
        String description,
        LocalDateTime dateReclamation,
        BesoinStatus status,
        Long quantite,
        MaterielDto materiel,
        CollaborateurDto collaborateur) implements Serializable {
    /**
     * DTO for {@link fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel}
     */
    public record MaterielDto(Long id, String nom) implements Serializable {
    }

    /**
     * DTO for {@link fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur}
     */
    public record CollaborateurDto(Long id, String nom, String prenom, AgenceDto agence) implements Serializable {
        /**
         * DTO for {@link fr.norsys.gestionpatrimoine.agence.entity.Agence}
         */
        public record AgenceDto(Long id, String nom) implements Serializable {
        }
    }
}