package fr.norsys.gestionpatrimoine.patrimoine.actif.service.impl;

import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.actif.dto.ActifCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.actif.entity.ActifCategorie;
import fr.norsys.gestionpatrimoine.patrimoine.actif.mapper.ActifCategorieMapper;
import fr.norsys.gestionpatrimoine.patrimoine.actif.repository.ActifCategorieRepository;
import fr.norsys.gestionpatrimoine.patrimoine.actif.service.ActifCategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActifCategorieServiceImpl implements ActifCategorieService {
    private final ActifCategorieRepository categorieRepository;
    @Override
    public ActifCategorieDto create(ActifCategorieDto request) {
        // dto to entity
        ActifCategorie categorie = ActifCategorieMapper.INSTANCE.toEntity(request);

        // check if already exist
        if(getByName(request.nom()) != null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Actif categorie already exist");
        }

        // save categorie in database
        ActifCategorie savedCategorie = categorieRepository.save(categorie);

        return ActifCategorieMapper.INSTANCE.toDto(savedCategorie);
    }
    @Override
    public ActifCategorieDto getById(Long id) {
        // get categorie from database
        return ActifCategorieMapper.INSTANCE.toDto(getCategorieById(id));
    }
    @Override
    public List<ActifCategorieDto> getAll() {
        return categorieRepository.findAll().stream()
                .map(ActifCategorieMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public ActifCategorieDto update(Long id, ActifCategorieDto request) {
        // get categorie from database
        ActifCategorie categorie = getCategorieById(id);

        categorie.setNom(request.nom());

        // save update in database
        ActifCategorie updatedCategorie = categorieRepository.save(categorie);

        return ActifCategorieMapper.INSTANCE.toDto(updatedCategorie);
    }
    @Override
    public void delete(Long id) {
        // get categorie from database
        ActifCategorie categorie = getCategorieById(id);

        // delete categorie from database
        categorieRepository.delete(categorie);
    }
    private ActifCategorie getByName(String categorieName) {
        return categorieRepository.findByNom(categorieName).orElse(null);
    }
    private ActifCategorie getCategorieById(Long categorieId) {
        return categorieRepository.findById(categorieId).orElseThrow(
                () -> new ResourceNotFoundException("Actif categorie", "id", categorieId.toString())
        );
    }
}
