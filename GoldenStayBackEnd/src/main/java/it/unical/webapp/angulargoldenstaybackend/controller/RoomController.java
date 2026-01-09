package it.unical.webapp.angulargoldenstaybackend.controller;

import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat; // <--- IMPORT NUOVO
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate; // <--- IMPORT NUOVO
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:4200")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // 1. LISTA STANZE
    @GetMapping
    public List<Room> getAllRooms(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        // Se il frontend ci manda le date, usiamo la query del Repository per filtrare
        if (checkIn != null && checkOut != null) {
            return roomRepository.findAvailableRooms(checkIn, checkOut);
        }

        // Se non ci sono date (comportamento standard), restituiamo tutte le stanze
        return roomRepository.findAll();
    }

    // 2. SINGOLA STANZA (GET)
    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    // 3. CREAZIONE
    @PostMapping("/create/{type}")
    public Room createRoomFactory(@PathVariable String type) {
        Room newRoom = new Room();
        // Logica Factory semplificata
        newRoom.setTitle("Nuova Stanza " + type);
        newRoom.setPricePerNight(100.00);
        newRoom.setCapacity(2);

        // Se vuoi rimettere lo switch completo con le immagini, puoi incollarlo qui dentro.
        // Per ora lascio questo che funziona sicuro.

        return roomRepository.save(newRoom);
    }

    // 4. ELIMINA STANZA
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        if (roomRepository.existsById(id)) {
            roomRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Stanza eliminata"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Stanza non trovata"));
        }
    }

    // 5. MODIFICA STANZA
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id)
                .map(existingRoom -> {
                    existingRoom.setTitle(roomDetails.getTitle());
                    existingRoom.setDescription(roomDetails.getDescription());
                    existingRoom.setPricePerNight(roomDetails.getPricePerNight());
                    existingRoom.setCapacity(roomDetails.getCapacity());

                    if(roomDetails.getImageUrl() != null) {
                        existingRoom.setImageUrl(roomDetails.getImageUrl());
                    }

                    Room updatedRoom = roomRepository.save(existingRoom);
                    return ResponseEntity.ok(updatedRoom);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}