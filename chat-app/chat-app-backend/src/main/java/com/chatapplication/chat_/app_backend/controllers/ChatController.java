package com.chatapplication.chat_.app_backend.controllers;

import com.chatapplication.chat_.app_backend.PlayLoad.MessagesRequest;
import com.chatapplication.chat_.app_backend.entities.Message;
import com.chatapplication.chat_.app_backend.entities.Room;
import com.chatapplication.chat_.app_backend.reposiories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:5173")

public class ChatController
{

    private RoomRepository roomRepository;
    // Construction Filed Injection
    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }





    // For Receiving and sending messages
    @MessageMapping("/sendMessage/{roomId}")//  /app/sendMessages/roomId
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessagesRequest request) throws Exception {
        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if(room != null)
        {
            room.getMessages().add(message);
            roomRepository.save(room);
        }
        else
        {
            throw new Exception("Room Not Found");
        }

        return message;
    }

}
