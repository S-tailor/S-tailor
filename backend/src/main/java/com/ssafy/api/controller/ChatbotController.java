package com.ssafy.api.controller;

import com.ssafy.api.request.ChatClearReq;
import com.ssafy.api.request.ChatSendReq;
import com.ssafy.api.response.ChatImageRes;
import com.ssafy.api.response.ChatRes;
import com.ssafy.api.response.ChatResultDTO;
import com.ssafy.api.response.SearchResultDTO;
import com.ssafy.api.service.ChatbotService;
import com.ssafy.api.service.SearchService;
import com.ssafy.common.model.response.BaseResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/chatbot")
public class ChatbotController {
    @Autowired
    ChatbotService chatbotService;
    @Autowired
    SearchService searchService;

    @PostMapping("/chat")
    public ResponseEntity<? extends BaseResponseBody> chat(@ModelAttribute ChatSendReq body) {

        boolean flag =false;

        List<String> urls=null;
        if(body.getImage()!=null)
            urls=chatbotService.saveImage(body);
        ChatResultDTO res= chatbotService.chatSend(body,urls);

        if(res!=null)
            flag=true;

        if(res.getType().equals("recommend")){
            List<SearchResultDTO> result = searchService.textSearch(res.getBody());
            return ResponseEntity.ok(ChatImageRes.of(200,"Success",res.getBody(), result));
        }

        if(flag) {
            return ResponseEntity.ok(ChatRes.of(200,"Success",res.getBody()));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/clear")
    public ResponseEntity<? extends BaseResponseBody> chat(@RequestBody ChatClearReq clearReq) {
        if(chatbotService.clearMessages(clearReq.getProfile())) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }
}
