package it.unical.webapp.angulargoldenstaybackend.controller;

import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // 1. LISTA STANZE (GET)
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // 2. SINGOLA STANZA (GET)
    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    // 3. CREAZIONE (POST)
    @PostMapping("/create/{type}")
    public Room createRoomFactory(@PathVariable String type) {
        Room newRoom = new Room();
        // Logica Factory semplificata per non farti impazzire col copia incolla
        newRoom.setTitle("Nuova Stanza " + type);
        newRoom.setPricePerNight(100.00);
        newRoom.setCapacity(2);
        // ... switch case completo se vuoi rimetterlo ...
        return roomRepository.save(newRoom);
    }

    // 4. ELIMINA STANZA (DELETE)
    // CORREZIONE FATTA QUI SOTTO: Ho tolto "/delete"
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            // Restituiamo JSON per Angular
            return ResponseEntity.ok(java.util.Map.of("message", "Stanza eliminata"));
        } else {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Stanza non trovata"));
        }
    }
    // 5. MODIFICA STANZA (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    // Aggiorniamo solo i campi principali
                    existingRoom.setTitle(roomDetails.getTitle());
                    existingRoom.setDescription(roomDetails.getDescription());
                    existingRoom.setPricePerNight(roomDetails.getPricePerNight());
                    existingRoom.setCapacity(roomDetails.getCapacity());
                    // Se vuoi aggiornare anche l'immagine:
                    if(roomDetails.getImageUrl() != null) {
                        existingRoom.setImageUrl(roomDetails.getImageUrl());
                    }

                    Room updatedRoom = roomRepository.save(existingRoom);
                    return ResponseEntity.ok(updatedRoom);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}