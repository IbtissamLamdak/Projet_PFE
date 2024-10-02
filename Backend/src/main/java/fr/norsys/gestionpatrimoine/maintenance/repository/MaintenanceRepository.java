package fr.norsys.gestionpatrimoine.maintenance.repository;
import fr.norsys.gestionpatrimoine.maintenance.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

}
