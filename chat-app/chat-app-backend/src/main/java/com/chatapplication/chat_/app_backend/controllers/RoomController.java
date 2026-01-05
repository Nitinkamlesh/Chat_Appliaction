package com.chatapplication.chat_.app_backend.controllers;
import com.chatapplication.chat_.app_backend.entities.Message;
import com.chatapplication.chat_.app_backend.entities.Room;
import com.chatapplication.chat_.app_backend.reposiories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController
{

    private final RoomRepository roomRepository;
    // Construction Filed Injection
    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

        //Create Room
        //--------------------------------------------------------------------------------------------
        @PostMapping
        public ResponseEntity<?> createRoom(@RequestBody String roomId)
        {
                if(roomRepository.findByRoomId(roomId)!= null)
                {
                    // room is already here
                    return ResponseEntity.badRequest().body("Room is already exist");
                }

                Room room = new Room();
                room.setRoomId(roomId);
                Room saveroom = roomRepository.save(room);
                return ResponseEntity.status(HttpStatus.CREATED).body(room);
        }
        //--------------------------------------------------------------------------------------------



        // Get Room : Or join the room just enter Id
        //--------------------------------------------------------------------------------------------
        @GetMapping("/{roomId}")
        public ResponseEntity<?> joinRoom(@PathVariable String roomId)
        {
            Room room = roomRepository.findByRoomId(roomId);
            if(room == null)
            {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("error", "Room Not Found!"));
            }

            return ResponseEntity.ok(room);
        }

    //--------------------------------------------------------------------------------------------




        //Get messages from room
        //--------------------------------------------------------------------------------------------
        @GetMapping("/{roomId}/messages")
        public ResponseEntity<List<Message>> getMessage(
                @PathVariable String roomId,
                @RequestParam(value = "page",defaultValue = "0",required = false)int page,
                @RequestParam(value = "size",defaultValue = "20",required = false)int size)
        {
           Room room =  roomRepository.findByRoomId(roomId);
            if(room == null)
            {
                return ResponseEntity.badRequest().build();
            }

        //pagination --> to get no. of message
        List<Message> messages = room.getMessages();

        int start = Math.max(0, messages.size() - (page+1) * size);
        int end = Math.min(messages.size(), start + size);

        List<Message> paginationMessage = messages.subList(start,end);
        return ResponseEntity.ok(paginationMessage);
        }
        //--------------------------------------------------------------------------------------------

}
