package fr.norsys.gestionpatrimoine.reparation.enums;

import fr.norsys.gestionpatrimoine.maintenance.enums.MaintenanceType;

import java.util.HashMap;
import java.util.Map;

public class ReparationToMaintenance {
   private static final Map<ReparationStatus, MaintenanceType> map = new HashMap<>();
   public ReparationToMaintenance() {
       map.put(ReparationStatus.EN_COURS, MaintenanceType.EN_COURS);
       map.put(ReparationStatus.COMPLETE, MaintenanceType.RESOLU);
       map.put(ReparationStatus.ANNULE, MaintenanceType.ANNULE);

   }

   public static MaintenanceType ReparationStatustoMaintenanceType(ReparationStatus reparationStatus) {
       return map.get(reparationStatus);
   }
}
