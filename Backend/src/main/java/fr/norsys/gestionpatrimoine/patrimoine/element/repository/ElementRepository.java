package fr.norsys.gestionpatrimoine.patrimoine.element.repository;

import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ElementRepository extends JpaRepository<Element, String> {
    boolean existsByNumeroSerie(String numeroSerie);
    @Query("select count(*) from Element e where e.actif.id = :actif_id and e.status != :element_status")
    Long countElementByActifAndStatusNot(@Param("actif_id") Long actifId, @Param("element_status") ElementStatus status);
    @Query("select count(*) from Element e inner join Bon b on e.bon.numeroBon = b.numeroBon where e.actif.id = :actif_id and b.numeroBon = :bon_id")
    Long countElementByActifAndBon(
            @Param("actif_id") Long actifId,
            @Param("bon_id") String bonId
    );

}