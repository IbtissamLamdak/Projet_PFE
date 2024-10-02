package fr.norsys.gestionpatrimoine.maintenance.service;

import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.collaborateur.repository.CollaborateurRepository;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoRequest;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;
import fr.norsys.gestionpatrimoine.maintenance.mapper.MaintenanceMapper;
import fr.norsys.gestionpatrimoine.maintenance.repository.MaintenanceRepository;
import fr.norsys.gestionpatrimoine.patrimoine.element.entity.Element;
import fr.norsys.gestionpatrimoine.patrimoine.element.enums.ElementStatus;
import fr.norsys.gestionpatrimoine.patrimoine.element.repository.ElementRepository;
import fr.norsys.gestionpatrimoine.reparation.entity.Reparation;
import fr.norsys.gestionpatrimoine.reparation.enums.ReparationStatus;
import fr.norsys.gestionpatrimoine.reparation.repository.ReparationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceServiceImp implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepos;
    private  final ElementRepository elementRepository ;
    private  final CollaborateurRepository collaborateurRepository;
    private final ReparationRepository reparationRepository;

    @Autowired
    public MaintenanceServiceImp(MaintenanceRepository maintenanceRepos, ElementRepository elementRepository, CollaborateurRepository collaborateurRepository,
                                 ReparationRepository reparationRepository) {
        this.maintenanceRepos = maintenanceRepos;
        this.elementRepository = elementRepository;
        this.collaborateurRepository = collaborateurRepository;
        this.reparationRepository = reparationRepository;
    }

    @Override
    public MaintenanceDtoResponce findMaintenanceByid(Long id) {
        Maintenance maintenance = maintenanceRepos.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        // Map the entity to DTO
        return MaintenanceMapper.toDto(maintenance);
    }

    @Override
    public List<MaintenanceDtoResponce> findAllMaintenance() {
        List<Maintenance> maintenances = maintenanceRepos.findAll();

        // Map the list of entities to a list of DTOs
        return maintenances.stream()
                .map(MaintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MaintenanceDtoResponce createMaintenance(MaintenanceDtoRequest maintenanceDtoRequest) {
        Maintenance maintenance = MaintenanceMapper.toEntity(maintenanceDtoRequest);


        Collaborateur collaborateur = collaborateurRepository.findById(maintenanceDtoRequest.collaborateur_id()).orElseThrow(() ->new ResourceNotFoundException("collaborateur", "id", maintenanceDtoRequest.collaborateur_id().toString()));
        maintenance.setCollaborateur(collaborateur);
        Element element = elementRepository.findById(maintenanceDtoRequest.numero_serie()).orElseThrow(() ->new ResourceNotFoundException("element", "id", maintenanceDtoRequest.numero_serie()));
        maintenance.setElement(element);
        if(maintenance.getStatus()==MaintenanceType.OUVERT)
        {element.setStatus(ElementStatus.MAINTENANCE);}
        else if (maintenance.getStatus()==MaintenanceType.EN_COURS) {
            element.setStatus(ElementStatus.EN_RÉPARATION);
        }
         elementRepository.save(element);


        Maintenance savedMaintenance = maintenanceRepos.save(maintenance);

        // Map the saved entity to DTO
        return MaintenanceMapper.toDto(savedMaintenance);
    }


    @Transactional
    @Override
    public MaintenanceDtoResponce updateMaintenance(MaintenanceDtoRequest maintenanceDtoRequest, Long id) {
        Maintenance maintenanceToUpdate = maintenanceRepos.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance not found"));

        // Update the entity with new values
        maintenanceToUpdate.setDescription(maintenanceDtoRequest.description());
        maintenanceToUpdate.setDate_maintenance(maintenanceDtoRequest.date_maintenance());
        MaintenanceType newStatus = maintenanceDtoRequest.status();

        // Check for status change
        if (newStatus != maintenanceToUpdate.getStatus()) {
            if (newStatus == MaintenanceType.EN_COURS) {
                // Create a new Reparation with status EN_ATTENTE
                Reparation reparation = new Reparation();
                reparation.setStatus(ReparationStatus.EN_ATTENTE);
                reparation.setDescription(maintenanceToUpdate.getDescription());
                reparation.setMaintenance(maintenanceToUpdate);

                reparation = reparationRepository.save(reparation);

                maintenanceToUpdate.setReparation(reparation);
            }
            maintenanceToUpdate.setStatus(newStatus);
        }

        Element element = elementRepository.findById(maintenanceDtoRequest.numero_serie()).orElseThrow(() ->new ResourceNotFoundException("element", "id", maintenanceDtoRequest.numero_serie()));
        maintenanceToUpdate.setElement(element);
        Collaborateur collaborateur = collaborateurRepository.findById(maintenanceDtoRequest.collaborateur_id()).orElseThrow(() ->new ResourceNotFoundException("collaborateur", "id", maintenanceDtoRequest.collaborateur_id().toString()));
        maintenanceToUpdate.setCollaborateur(collaborateur);

        // Save the updated entity
        Maintenance updatedMaintenance = maintenanceRepos.save(maintenanceToUpdate);

        // Map the updated entity to DTO
        return MaintenanceMapper.toDto(updatedMaintenance);
    }

    @Override
    public void deleteMaintenance(Long id) {
        maintenanceRepos.deleteById(id);
    }
}
