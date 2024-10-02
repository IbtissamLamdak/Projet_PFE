package fr.norsys.gestionpatrimoine.patrimoine.element.mapper;

import fr.norsys.gestionpatrimoine.patrimoine.element.dto.ElementDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.element.dto.ElementDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ElementMapper {
    ElementMapper INSTANCE = Mappers.getMapper(ElementMapper.class);
    @Mappings({
            @Mapping(target = "actifId", source = "actif.id"),
            @Mapping(target = "actifNom", source = "actif.nom"),
            @Mapping(target = "numeroBon", source = "bon.numeroBon"),
            @Mapping(target = "bonDatePrise", source = "bon.dateLivraison"),
    })
    ElementDtoResponse toDto(Element element);
    @Mappings(value = {
            @Mapping(target = "actif", ignore = true),
            @Mapping(target = "bon", ignore = true)
    })
    Element toEntity(ElementDtoRequest dto);
}
