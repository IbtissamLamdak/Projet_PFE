package fr.norsys.gestionpatrimoine.agence.service;

import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoRequest;
import fr.norsys.gestionpatrimoine.agence.dto.AgenceDtoResponse;
import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.agence.mapper.AgenceMapper;
import fr.norsys.gestionpatrimoine.agence.repository.AgenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgenceServiceImpl implements AgenceService {

    @Autowired
    private AgenceRepository agenceRepository;
    @Override
    public AgenceDtoResponse findAgenceByid(long id) {
        Agence agence = agenceRepository.findById(id).orElseThrow(
                () -> new RuntimeException("agence not found")
        );
        return AgenceMapper.toDto(agence);
    }

    @Override
    public List<AgenceDtoResponse> findAllAgence() {
        return  agenceRepository.findAll().stream()
                .map(AgenceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AgenceDtoResponse addAgence(AgenceDtoRequest dto) {
        Agence agence = AgenceMapper.toEntity(dto);
        Agence agence1 = agenceRepository.save(agence);
        return  AgenceMapper.toDto(agence1);
    }

    @Override
    public AgenceDtoResponse updateAgence(AgenceDtoRequest dto, long id) {

        Agence agence = agenceRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Agence not found with id " + id)
        );

        if(StringUtils.hasText(dto.nom()))
            agence.setNom(dto.nom());
        if(StringUtils.hasText(dto.localisation()))
            agence.setLocalisation(dto.localisation());
        if(StringUtils.hasText(dto.adresse()))
            agence.setAdresse(dto.adresse());
        if(StringUtils.hasText(dto.ville()))
            agence.setVille(dto.ville());
        if(StringUtils.hasText(dto.pays()))
            agence.setPays(dto.pays());
        if(StringUtils.hasText(dto.description()))
            agence.setDescription(dto.description());
        agence.setLongitude(dto.longitude());
        agence.setLatitude(dto.latitude());

        Agence updatedAgence = agenceRepository.save(agence);
        return AgenceMapper.toDto(updatedAgence);
    }

    @Override
    public void deleteAgence(long id) {
        Agence agence = agenceRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Agence not found with id " + id)
        );

        agenceRepository.delete(agence);
    }
}
