package fr.norsys.gestionpatrimoine.patrimoine.consommable.service.impl;

import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.dto.ConsommableCategorieDto;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.entity.ConsommableCategorie;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.mapper.ConsommableCategorieMapper;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.repository.ConsommableCategorieRepository;
import fr.norsys.gestionpatrimoine.patrimoine.consommable.service.ConsommableCategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsommableCategorieServiceImpl implements ConsommableCategorieService {
    private final ConsommableCategorieRepository categorieRepository;
    @Override
    public ConsommableCategorieDto create(ConsommableCategorieDto request) {
        // dto to entity
        ConsommableCategorie categorie = ConsommableCategorieMapper.INSTANCE.toEntity(request);

        // check if already exist
        if(getByName(request.nom()) != null) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Consommable categorie already exist");
        }

        // save categorie in database
        ConsommableCategorie savedCategorie = categorieRepository.save(categorie);

        return ConsommableCategorieMapper.INSTANCE.toDto(savedCategorie);
    }
    @Override
    public ConsommableCategorieDto getById(Long id) {
        // get categorie from database
        return ConsommableCategorieMapper.INSTANCE.toDto(getCategorieById(id));
    }
    @Override
    public List<ConsommableCategorieDto> getAll() {
        return categorieRepository.findAll().stream()
                .map(ConsommableCategorieMapper.INSTANCE::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public ConsommableCategorieDto update(Long id, ConsommableCategorieDto request) {
        // get categorie from database
        ConsommableCategorie categorie = getCategorieById(id);

        categorie.setNom(request.nom());

        // save update in database
        ConsommableCategorie updatedCategorie = categorieRepository.save(categorie);

        return ConsommableCategorieMapper.INSTANCE.toDto(updatedCategorie);
    }
    @Override
    public void delete(Long id) {
        // get categorie from database
        ConsommableCategorie categorie = getCategorieById(id);

        // delete categorie from database
        categorieRepository.delete(categorie);
    }
    private ConsommableCategorie getByName(String categorieName) {
        return categorieRepository.findByNom(categorieName).orElse(null);
    }
    private ConsommableCategorie getCategorieById(Long categorieId) {
        return categorieRepository.findById(categorieId).orElseThrow(
                () -> new ResourceNotFoundException("Consommable categorie", "id", categorieId.toString())
        );
    }
}
