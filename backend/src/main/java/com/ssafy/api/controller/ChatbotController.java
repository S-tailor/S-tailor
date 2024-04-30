package com.ssafy.api.controller;

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
    public ResponseEntity<? extends BaseResponseBody> chat(@RequestBody ChatSendReq body) {

        boolean flag =false;
        ChatResultDTO res= chatbotService.chatSend(body);

        if(res!=null)
            flag=true;

        System.out.println(res);
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
}
