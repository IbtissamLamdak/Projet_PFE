package fr.norsys.gestionpatrimoine.patrimoine.actif.mapper;

import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.ActifCategorie;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ActifCategorieMapper {
    ActifCategorieMapper INSTANCE = Mappers.getMapper(ActifCategorieMapper.class);
    ActifCategorieDto toDto(ActifCategorie categorie);
    ActifCategorie toEntity(ActifCategorieDto dto);
}
