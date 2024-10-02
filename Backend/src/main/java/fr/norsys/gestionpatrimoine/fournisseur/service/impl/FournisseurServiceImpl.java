package fr.norsys.gestionpatrimoine.fournisseur.service.impl;

import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;
import fr.norsys.gestionpatrimoine.fournisseur.mapper.FournisseurMapper;
import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoRequest;
import fr.norsys.gestionpatrimoine.fournisseur.dto.FournisseurDtoResponse;
import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;
import fr.norsys.gestionpatrimoine.fournisseur.mapper.FournisseurMapper;
import fr.norsys.gestionpatrimoine.fournisseur.repository.FournisseurRepository;
import fr.norsys.gestionpatrimoine.fournisseur.service.FournisseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    @Override
    public FournisseurDtoResponse findFournisseurById(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id).orElseThrow(() -> new RuntimeException("Fournisseur not found"));
        return FournisseurMapper.toDto(fournisseur);
    }

    @Override
    public List<FournisseurDtoResponse> findAllFournisseurs() {
        return  fournisseurRepository.findAll().stream()
                .map(FournisseurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FournisseurDtoResponse addFournisseur(FournisseurDtoRequest dto) {
        Fournisseur fournisseur = FournisseurMapper.toEntity(dto);
        Fournisseur fournisseur1 = fournisseurRepository.save(fournisseur);
        return  FournisseurMapper.toDto(fournisseur1);
    }

    @Override
    public FournisseurDtoResponse updateFournisseur(Long id,FournisseurDtoRequest dto) {

        Fournisseur existingFournisseur = fournisseurRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Fournisseur not found with id " + id)
        );

        existingFournisseur.setNom(dto.nom());
        existingFournisseur.setAdresse(dto.adresse());
        existingFournisseur.setEmail(dto.email());
        existingFournisseur.setPrenom(dto.prenom());
        existingFournisseur.setVille(dto.ville());
        existingFournisseur.setPays(dto.pays());
        existingFournisseur.setTel(dto.tel());


        if(StringUtils.hasText(dto.nom())) {
            existingFournisseur.setNom(dto.nom());
        }
        Fournisseur updatedFournisseur = fournisseurRepository.save(existingFournisseur);
        return FournisseurMapper.toDto(updatedFournisseur);
    }

    @Override
    public void deleteFournisseur(Long id) {
        fournisseurRepository.deleteById(id);
    }
}
