//package kickerConnect.apis;
//
//import kickerConnect.dtos.MessageDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Controller;
//
//@Controller
//public class ChatController {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    @Autowired
//    public ChatController(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    @MessageMapping("/chat")
//    public void sendMessage(MessageDTO messageDTO) {
//        // Procesează mesajul primit
//        System.out.println("Mesajul este: \n\n\n\n" + messageDTO);
//        // Trimite mesajul procesat către toți abonații la topicul /topic/messages
//        messagingTemplate.convertAndSend("/topic/messages", messageDTO);
//    }
//}
//
