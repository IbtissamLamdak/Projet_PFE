package fr.norsys.gestionpatrimoine.bon.service.impl;

import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import fr.norsys.gestionpatrimoine.bon.mapper.BonMapper;
import fr.norsys.gestionpatrimoine.bon.dto.BonDtoRequest;
import fr.norsys.gestionpatrimoine.bon.dto.BonDtoResponse;
import fr.norsys.gestionpatrimoine.bon.entity.Bon;
import fr.norsys.gestionpatrimoine.bon.mapper.BonMapper;
import fr.norsys.gestionpatrimoine.bon.repository.BonRepository;
import fr.norsys.gestionpatrimoine.bon.service.BonService;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.fournisseur.entity.Fournisseur;
import fr.norsys.gestionpatrimoine.fournisseur.repository.FournisseurRepository;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.entity.Materiel;
import fr.norsys.gestionpatrimoine.patrimoine.materiel.repository.MaterielRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BonServiceImpl implements BonService {

    private final BonRepository bonRepository;
    private final FournisseurRepository fournisseurRepository;
    private final MaterielRepository materielRepository;

    @Override
    public BonDtoResponse findBonById(String id) {
        Bon bon = bonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Bon", "numero", id));
        return BonMapper.toDto(bon);
    }

    @Override
    public List<BonDtoResponse> findAllBons() {
        return  bonRepository.findAll().stream()
                .map(BonMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BonDtoResponse addBon(BonDtoRequest dto) {
        // check if already numero bon exist
        if(bonRepository.existsBonByNumeroBon(dto.numeroBon()))
            throw new AppException(HttpStatus.CONFLICT, "Numero bon already exist");

        Bon bon = BonMapper.toEntity(dto);

        // get fournisseur from database
        Fournisseur fournisseur = fournisseurRepository.findById(dto.fournisseurId()).orElseThrow(
                () -> new ResourceNotFoundException("Fournisseur", "id", dto.fournisseurId().toString())
        );

        // get materiel from database
        Materiel materiel = materielRepository.findById(dto.materielId()).orElseThrow(
                () -> new ResourceNotFoundException("Materiel", "id", dto.materielId().toString())
        );

        bon.setFournisseur(fournisseur);
        bon.setMateriel(materiel);

        // add quantite to materiel
        materiel.setQuantite(materiel.getQuantite() + dto.quantiteDemande());

        // save updated materiel
        materielRepository.save(materiel);

        return  BonMapper.toDto(bonRepository.save(bon));
    }

    @Override
    public BonDtoResponse updateBon(String id,BonDtoRequest dto) {
        // check if numero bon already exist

        Bon existingBon = bonRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Bon", "id", id)
        );

        if(!existingBon.getNumeroBon().equals(dto.numeroBon()) && bonRepository.existsBonByNumeroBon(dto.numeroBon()))
            throw new AppException(HttpStatus.CONFLICT, "Numero bon already exist");

        // get materiel from database
        Materiel materiel = materielRepository.findById(dto.materielId()).orElseThrow(
                () -> new ResourceNotFoundException("Materiel", "id", dto.materielId().toString())
        );

        // get fournisseur from database
        Fournisseur fournisseur = fournisseurRepository.findById(dto.fournisseurId()).orElseThrow(
                () -> new ResourceNotFoundException("Fournissuer", "id", dto.fournisseurId().toString())
        );

        Integer previousQuantite = existingBon.getQuantiteDemande();

        existingBon.setNumeroBon(dto.numeroBon());
        existingBon.setPrix(dto.prix());
        existingBon.setDateLivraison((dto.dateLivraison()));
        existingBon.setQuantiteDemande(dto.quantiteDemande());
        existingBon.setFournisseur(fournisseur);
        existingBon.setMateriel(materiel);

        materiel.setQuantite(materiel.getQuantite() - previousQuantite + dto.quantiteDemande());

        // save updated materiel in database
        materielRepository.save(materiel);

        Bon updatedBon = bonRepository.save(existingBon);
        return BonMapper.toDto(updatedBon);
    }

    @Override
    public void deleteBon(String id) {
        bonRepository.deleteById(id);
    }
}
