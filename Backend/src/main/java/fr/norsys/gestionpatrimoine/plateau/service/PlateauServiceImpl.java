package fr.norsys.gestionpatrimoine.plateau.service;

import fr.norsys.gestionpatrimoine.agence.entity.Agence;
import fr.norsys.gestionpatrimoine.agence.repository.AgenceRepository;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoRequest;
import fr.norsys.gestionpatrimoine.plateau.dto.PlateauDtoResponse;
import fr.norsys.gestionpatrimoine.plateau.entity.Plateau;
import fr.norsys.gestionpatrimoine.plateau.mapper.PlateauMapper;
import fr.norsys.gestionpatrimoine.plateau.repository.PlateauRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlateauServiceImpl implements PlateauService {
    private final PlateauRepository platteauRepository;
    private final AgenceRepository agenceRepository;
    @Override
    public PlateauDtoResponse findPlateauByid(long id) {
        Plateau plateau = platteauRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Plateau not found")
        );
        return PlateauMapper.toDto(plateau);
    }

    @Override
    public List<PlateauDtoResponse> findAllPlateau() {
        return  platteauRepository.findAll().stream()
                .map(PlateauMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PlateauDtoResponse addPlateau(PlateauDtoRequest dto, long agenceId) {
        Plateau plateau = PlateauMapper.toEntity(dto);

        // get agence from database
        Agence agence = agenceRepository.findById(agenceId).orElseThrow(
                () -> new RuntimeException("Agence not found with id " + agenceId)
        );

        plateau.setAgence(agence);

        Plateau savedPlateau = platteauRepository.save(plateau);

        return  PlateauMapper.toDto(savedPlateau);
    }

    @Override
    public PlateauDtoResponse updatePlateau(PlateauDtoRequest dto, long id) {
        Plateau plateau = platteauRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Plateau not found with id " + id)
        );

        if(StringUtils.hasText(dto.name())) {
            plateau.setName(dto.name());
        }
        Agence agence=agenceRepository.findById(dto.agenceId()).orElseThrow(() ->
                        new RuntimeException("agence not found with id " + dto.agenceId()));
        plateau.setCapacity(dto.capacity());
        plateau.setFloor(dto.floor());
        plateau.setHasKitchen(dto.hasKitchen());
        plateau.setHasRestroom(dto.hasRestroom());
        plateau.setHasMeetingRoom(dto.hasMeetingRoom());
        plateau.setAgence(agence);
        Plateau updatedPlateau = platteauRepository.save(plateau);
        return PlateauMapper.toDto(updatedPlateau);
    }

    @Override
    public void deletePlateau(long id) {
        Plateau plateau = platteauRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Plateau not found with id " + id)
        );

        platteauRepository.delete(plateau);
    }
    @Override
    public List<PlateauDtoResponse> findPlateauByAgenceId(long id) {
        if (!agenceRepository.existsById(id)) {
            return Collections.emptyList();
        }
        return platteauRepository.findAllByAgenceId(id).stream()
                .map(PlateauMapper::toDto)
                .collect(Collectors.toList());
    }
}
