package it.unical.webapp.angulargoldenstaybackend.controller;

import it.unical.webapp.angulargoldenstaybackend.model.User;
import it.unical.webapp.angulargoldenstaybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. REGISTRAZIONE (POST)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Controlla se l'email esiste già
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email già registrata!");
        }
        // Salva il nuovo utente
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    // 2. LOGIN (POST)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        // Cerca l'utente con email e password
        User user = userRepository.findByEmailAndPassword(loginData.getEmail(), loginData.getPassword()).orElse(null);

        if (user != null) {
            return ResponseEntity.ok(user); // Login OK: restituisce l'utente
        } else {
            return ResponseEntity.status(401).body("Credenziali errate"); // Errore
        }
    }
}