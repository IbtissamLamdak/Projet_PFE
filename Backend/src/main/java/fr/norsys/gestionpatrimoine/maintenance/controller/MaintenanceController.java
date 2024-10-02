package fr.norsys.gestionpatrimoine.maintenance.controller;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoRequest;
import fr.norsys.gestionpatrimoine.maintenance.dto.MaintenanceDtoResponce;
import fr.norsys.gestionpatrimoine.maintenance.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
@RequiredArgsConstructor
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    @GetMapping("{id}")
    ResponseEntity<MaintenanceDtoResponce> getMaintenanceById(@PathVariable Long id) {
        return new ResponseEntity<>(maintenanceService.findMaintenanceByid(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    ResponseEntity<MaintenanceDtoResponce> updateMaintenance(@RequestBody MaintenanceDtoRequest maintenance , @PathVariable Long id){
        return new ResponseEntity<>(maintenanceService.updateMaintenance(maintenance, id), HttpStatus.OK);
    }
    @GetMapping
    ResponseEntity<List<MaintenanceDtoResponce>> findAll(){
        maintenanceService.findAllMaintenance();
        return  new ResponseEntity<>(maintenanceService.findAllMaintenance(),HttpStatus.OK);
    }

    @PostMapping
    ResponseEntity<MaintenanceDtoResponce> createMaintenance(@RequestBody MaintenanceDtoRequest request ){
        MaintenanceDtoResponce response = maintenanceService.createMaintenance(request);
        return new ResponseEntity<>(response,HttpStatus.CREATED);

    }
    @DeleteMapping("/{id}")
    ResponseEntity<?> deleteById(@PathVariable Long id ){
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.ok("Deleted with success.");
    }

}