package fr.norsys.gestionpatrimoine.reparation.service;

import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;
import fr.norsys.gestionpatrimoine.maintenance.repository.MaintenanceRepository;
import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoRequest;
import fr.norsys.gestionpatrimoine.reparation.dto.ReparationDtoResponce;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import fr.norsys.gestionpatrimoine.reparation.enums.ReparationStatus;
import fr.norsys.gestionpatrimoine.reparation.enums.ReparationToMaintenance;
import fr.norsys.gestionpatrimoine.reparation.mapper.ReparationMapper;
import fr.norsys.gestionpatrimoine.reparation.repository.ReparationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReparationServiceImp implements ReparationService {

    private final ReparationRepository reparationRepos;
    private final MaintenanceRepository maintenanceRepository;

    @Autowired
    public ReparationServiceImp(ReparationRepository reparationRepos,
                                MaintenanceRepository maintenanceRepository) {
        this.reparationRepos = reparationRepos;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public ReparationDtoResponce findReparationByid(Long id) {
        Reparation reparation = reparationRepos.findById(id)
                .orElseThrow(() -> new RuntimeException("Reparation not found"));

        // Map the entity to DTO
        return ReparationMapper.toDto(reparation);
    }

    @Override
    public List<ReparationDtoResponce> findAllReparation() {
        List<Reparation> reparations = reparationRepos.findAll();

        // Map the list of entities to a list of DTOs
        return reparations.stream()
                .map(ReparationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReparationDtoResponce addReparation(ReparationDtoRequest reparationDtoRequest) {
        Maintenance maintenance = maintenanceRepository.getById(reparationDtoRequest.maintenance_id());
        Reparation reparation = ReparationMapper.toEntity(reparationDtoRequest);
        reparation.setMaintenance(maintenance);
        Reparation savedReparation = reparationRepos.save(reparation);

        // Map the saved entity to DTO
        return ReparationMapper.toDto(savedReparation);
    }

    @Override
    public ReparationDtoResponce updateReparation(ReparationDtoRequest reparationDtoRequest, Long id) {
        Reparation reparationToUpdate = reparationRepos.findById(id)
                .orElseThrow(() -> new RuntimeException("Reparation not found"));

        // get maintenance from reparation
        Maintenance maintenance = maintenanceRepository.getById(reparationDtoRequest.maintenance_id());

        // Update the entity with new values
        reparationToUpdate.setDescription(reparationDtoRequest.description());
        reparationToUpdate.setDateDebut(reparationDtoRequest.dateDebut());
        reparationToUpdate.setDateFin(reparationDtoRequest.dateFin());
        reparationToUpdate.setNomTechnicien(reparationDtoRequest.NomTechnicien());
        reparationToUpdate.setTelephoneTechnicien(reparationDtoRequest.TelephoneTechnicien());
        reparationToUpdate.setSolution(reparationDtoRequest.Solution());



        ReparationStatus newStatus = reparationDtoRequest.status();

        // Check for status change
        if (newStatus != reparationToUpdate.getStatus()) {

            if (newStatus == ReparationStatus.EN_COURS) {
                // Update Maintenance status to EN_COURS
                maintenance.setStatus(MaintenanceType.EN_COURS);
            } else if (newStatus == ReparationStatus.COMPLETE) {
                // Update Maintenance status to RESOLU
                maintenance.setStatus(MaintenanceType.RESOLU);
            } else if (newStatus == ReparationStatus.ANNULE) {
                // Update Maintenance status to ANNULE
                maintenance.setStatus(MaintenanceType.ANNULE);
            }
            reparationToUpdate.setStatus(newStatus);
        }
        // Save the updated entity
        maintenanceRepository.save(maintenance);
        Reparation updatedReparation = reparationRepos.save(reparationToUpdate);

        // Map the updated entity to DTO
        return ReparationMapper.toDto(updatedReparation);
    }


    @Override
    public void deleteReparation(Long id) {
        reparationRepos.deleteById(id);
    }
}
