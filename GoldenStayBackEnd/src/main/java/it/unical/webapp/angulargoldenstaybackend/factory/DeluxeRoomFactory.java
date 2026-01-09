package it.unical.webapp.angulargoldenstaybackend.factory;

import org.springframework.stereotype.Component;
import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.model.DeluxeRoom;

@Component("DELUXE")
public class DeluxeRoomFactory implements RoomFactory {

    @Override
    public Room createRoom() {
        return new DeluxeRoom();
    }
}