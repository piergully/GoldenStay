package it.unical.webapp.angulargoldenstaybackend.repository;

import it.unical.webapp.angulargoldenstaybackend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Trova tutte le prenotazioni di un certo utente
    List<Booking> findByUserId(Long userId);

    // Trova tutte le prenotazioni di una certa stanza
    List<Booking> findByRoomId(Long roomId);
}