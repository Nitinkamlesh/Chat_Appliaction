package com.chatapplication.chat_.app_backend.reposiories;

import com.chatapplication.chat_.app_backend.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room,String>
{
    //Get room using room id
    Room findByRoomId(String roomId);

}
