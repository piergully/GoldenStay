package it.unical.webapp.angulargoldenstaybackend.repository;

import it.unical.webapp.angulargoldenstaybackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Spring crea la query SQL automaticamente leggendo il nome del metodo!
    User findByEmailAndPassword(String email, String password);

    // Serve per controllare se esiste già in fase di registrazione
    User findByEmail(String email);
}