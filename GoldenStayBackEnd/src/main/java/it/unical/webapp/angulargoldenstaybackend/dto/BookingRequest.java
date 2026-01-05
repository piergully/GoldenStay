package it.unical.webapp.angulargoldenstaybackend.dto;

import java.time.LocalDate;

public class BookingRequest {
    // Riceviamo solo gli ID, non gli oggetti interi
    private Long userId;
    private Long roomId;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private double totalPrice;

    // Getters e Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public LocalDate getCheckIn() { return checkIn; }
    public void setCheckIn(LocalDate checkIn) { this.checkIn = checkIn; }
    public LocalDate getCheckOut() { return checkOut; }
    public void setCheckOut(LocalDate checkOut) { this.checkOut = checkOut; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}