package it.unical.webapp.angulargoldenstaybackend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DELUXE")
public class DeluxeRoom extends Room {

    public DeluxeRoom() {
        super();
        this.setTitle("Camera Deluxe");
        this.setDescription("Spaziosa e moderna con balcone privato.");
        this.setPricePerNight(180.00);
        this.setCapacity(3);
        this.setImageUrl("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80");
    }
}