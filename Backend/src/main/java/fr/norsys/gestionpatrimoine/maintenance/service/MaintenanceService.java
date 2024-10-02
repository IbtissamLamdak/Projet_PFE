package fr.norsys.gestionpatrimoine.maintenance.service;

import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoRequest;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MaintenanceService {
    MaintenanceDtoResponce findMaintenanceByid(Long id);
    List<MaintenanceDtoResponce> findAllMaintenance();
    MaintenanceDtoResponce createMaintenance(MaintenanceDtoRequest maintenanceDtoRequest);
    MaintenanceDtoResponce updateMaintenance(MaintenanceDtoRequest maintenanceDtoRequest, Long id);
    void deleteMaintenance(Long id);
}

