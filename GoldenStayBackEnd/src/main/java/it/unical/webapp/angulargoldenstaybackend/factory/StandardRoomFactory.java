package it.unical.webapp.angulargoldenstaybackend.factory;

import org.springframework.stereotype.Component;
import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.model.StandardRoom;

@Component("STANDARD")
public class StandardRoomFactory implements RoomFactory {

    @Override
    public Room createRoom() {
        return new StandardRoom();
    }
}