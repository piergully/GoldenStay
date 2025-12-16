package it.unical.webapp.angulargoldenstaybackend;

import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DBLoader implements CommandLineRunner {

    private final RoomRepository roomRepository;

    public DBLoader(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roomRepository.count() == 0) {
            // Inseriamo i dati che avevi nel frontend
            roomRepository.save(new Room("Suite Vista Mare", "Vista mozzafiato sull'oceano.", 250.00, "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9", 2));
            roomRepository.save(new Room("Camera Deluxe", "Spaziosa e moderna.", 180.00, "https://images.unsplash.com/photo-1611892440504-42a792e24d32", 2));
            roomRepository.save(new Room("Family Suite", "Per tutta la famiglia.", 350.00, "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6", 4));
            roomRepository.save(new Room("Attico Esclusivo", "Lusso sfrenato con jacuzzi.", 500.00, "https://images.unsplash.com/photo-1631049307264-da0f29a2622e", 2));

            System.out.println("✅ Stanze inserite nel Database!");
        }
    }
}