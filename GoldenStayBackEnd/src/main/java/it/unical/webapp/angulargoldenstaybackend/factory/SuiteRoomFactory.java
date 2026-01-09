package it.unical.webapp.angulargoldenstaybackend.factory;

import org.springframework.stereotype.Component;
import it.unical.webapp.angulargoldenstaybackend.model.Room;
import it.unical.webapp.angulargoldenstaybackend.model.SuiteRoom;

@Component("SUITE")
public class SuiteRoomFactory implements RoomFactory {

    @Override
    public Room createRoom() {
        return new SuiteRoom();
    }
}