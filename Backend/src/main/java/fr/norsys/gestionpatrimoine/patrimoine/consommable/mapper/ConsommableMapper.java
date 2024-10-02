package fr.norsys.gestionpatrimoine.patrimoine.consommable.mapper;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.Consommable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ConsommableMapper {
    ConsommableMapper INSTANCE = Mappers.getMapper(ConsommableMapper.class);
    @Mapping(source = "consommableCategorie.nom", target = "consommableCategorie")
    @Mapping(source = "agence.id", target = "agenceId")
    @Mapping(source = "agence.nom", target = "agence")
    ConsommableDtoResponse toDto(Consommable consommable);
    @Mappings(value = {
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "agence", ignore = true),
            @Mapping(target = "consommableCategorie", ignore = true)
    })
    Consommable toEntity(ConsommableDtoRequest dto);
}
