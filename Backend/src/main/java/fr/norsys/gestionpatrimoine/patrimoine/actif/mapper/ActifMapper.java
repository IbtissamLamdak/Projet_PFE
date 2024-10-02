package fr.norsys.gestionpatrimoine.patrimoine.actif.mapper;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoRequest;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifDtoResponse;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.Actif;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.mapstruct.factory.Mappers;

@Mapper

public interface ActifMapper {
    ActifMapper INSTANCE = Mappers.getMapper(ActifMapper.class);
    @Mapping(source = "actifCategorie.nom", target = "actifCategorie")
    @Mapping(source = "agence.nom", target = "agence")
    ActifDtoResponse toDto(Actif actif);
    @Mappings(value = {
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "agence", ignore = true),
            @Mapping(target = "actifCategorie", ignore = true)
    })
    Actif toEntity(ActifDtoRequest dto);


}
