package it.unical.webapp.angulargoldenstaybackend.controller;

import it.unical.webapp.angulargoldenstaybackend.dto.BookingRequest;
import it.unical.webapp.angulargoldenstaybackend.model.Booking;
import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.model.User;
import it.unical.webapp.angulargoldenstaybackend.repository.BookingRepository;
import it.unical.webapp.angulargoldenstaybackend.repository.RoomRepository;
import it.unical.webapp.angulargoldenstaybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    // 1. CREA PRENOTAZIONE
    @PostMapping("/salva")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {

        // Cerchiamo l'Utente e la Stanza nel DB usando gli ID inviati
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Errore: Utente non trovato con ID " + request.getUserId()));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Errore: Stanza non trovata con ID " + request.getRoomId()));

        // Creiamo l'oggetto Booking vero e proprio
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setStatus("CONFERMATA"); // Impostiamo lo stato iniziale

        // Salviamo nel DB
        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // 2. LISTA DI TUTTE LE PRENOTAZIONI (Admin)
    @GetMapping("/all")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 3. CANCELLA UNA PRENOTAZIONE (Admin)

    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            // SOLUZIONE: Restituiamo un JSON valido
            return ResponseEntity.ok(java.util.Map.of("message", "Prenotazione cancellata"));
        } else {
            return ResponseEntity.status(404).body(java.util.Map.of("error", "Prenotazione non trovata"));
        }
    }

}