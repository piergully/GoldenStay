package it.unical.webapp.angulargoldenstaybackend.repository;

import it.unical.webapp.angulargoldenstaybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // Import necessario

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Restituisce Optional per gestire il caso in cui l'utente non esista
    Optional<User> findByEmailAndPassword(String email, String password);

    Optional<User> findByEmail(String email);
}