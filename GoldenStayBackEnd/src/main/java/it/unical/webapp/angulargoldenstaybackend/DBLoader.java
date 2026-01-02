package it.unical.webapp.angulargoldenstaybackend;

import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.model.User; // Import necessario
import it.unical.webapp.angulargoldenstaybackend.repository.RoomRepository;
import it.unical.webapp.angulargoldenstaybackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DBLoader implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    // CORREZIONE: Aggiunto userRepository al costruttore per la Dependency Injection
    public DBLoader(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // 1. Inserimento Stanze
        if (roomRepository.count() == 0) {
            roomRepository.save(new Room("Suite Vista Mare", "Vista mozzafiato sull'oceano.", 250.00, "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", 2));
            roomRepository.save(new Room("Camera Deluxe", "Spaziosa e moderna.", 180.00, "https://images.unsplash.com/photo-1611892440504-42a792e24d32", 2));
            roomRepository.save(new Room("Family Suite", "Per tutta la famiglia.", 350.00, "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6", 4));
            roomRepository.save(new Room("Attico Esclusivo", "Lusso sfrenato con jacuzzi.", 500.00, "https://images.unsplash.com/photo-1631049307264-da0f29a2622e", 2));

            System.out.println("✅ Stanze inserite nel Database!");
        }

        // 2. Inserimento Admin (Spostato fuori dall'if delle stanze per sicurezza)
        String adminEmail = "admin@goldenstay.it";

        // Grazie a Optional nel Repository, ora .isEmpty() funziona correttamente
        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setName("Amministratore");

            // NOTA: Ricordati di usare BCryptPasswordEncoder in futuro!
            admin.setPassword("admin123");

            admin.setRole("ADMIN");

            userRepository.save(admin);
            System.out.println("✅ Utente Admin creato con successo!");
        }
    }
}