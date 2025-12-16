package it.unical.webapp.angulargoldenstaybackend.repository;

import it.unical.webapp.angulargoldenstaybackend.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    // Qui avrai già pronti metodi come findAll(), save(), findById()...
}