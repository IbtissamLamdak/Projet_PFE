package fr.norsys.gestionpatrimoine.patrimoine.consommable.mapper;

import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.ConsommableCategorie;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ConsommableCategorieMapper {
    ConsommableCategorieMapper INSTANCE = Mappers.getMapper(ConsommableCategorieMapper.class);
    ConsommableCategorieDto toDto(ConsommableCategorie categorie);
    ConsommableCategorie toEntity(ConsommableCategorieDto dto);
}
