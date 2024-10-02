package fr.norsys.gestionpatrimoine.besoin.controller;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoRequest;
import fr.norsys.gestionpatrimoine.besoin.dto.BesoinDtoResponse;
import fr.norsys.gestionpatrimoine.besoin.service.BesoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/besoins")
@RequiredArgsConstructor
public class BesoinController {
    private final BesoinService besoinService;

    @GetMapping("{id}")
    ResponseEntity<BesoinDtoResponse> getBesoinById(@PathVariable Long id) {
        return new ResponseEntity<>(besoinService.findBesoinByid(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    ResponseEntity<BesoinDtoResponse> updateBesoin(@RequestBody BesoinDtoRequest besoin , @PathVariable Long id){
        return new ResponseEntity<>(besoinService.updateBesoin(besoin, id), HttpStatus.OK);
    }
    @GetMapping
    ResponseEntity<List<BesoinDtoResponse>> findAll(){
        besoinService.findAllBesoin();
        return  new ResponseEntity<>(besoinService.findAllBesoin(),HttpStatus.OK);
    }
    @PostMapping
    ResponseEntity<BesoinDtoResponse> createBesoin(@RequestBody BesoinDtoRequest besoin ){
        return  new ResponseEntity<>(besoinService.addBesoin(besoin),HttpStatus.CREATED);

    }
    @DeleteMapping("/{id}")
    ResponseEntity<String> deleteById(@PathVariable Long id ){
        besoinService.deleteBesoin(id);
        return ResponseEntity.ok("Deleted with success.");
    }

}