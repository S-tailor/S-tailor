package com.ssafy.api.controller;

import java.io.IOException;
import java.util.UUID;

import com.ssafy.api.request.TryOnVerifyReq;
import com.ssafy.api.service.TryOnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@CrossOrigin("*")
@RequestMapping("/tryon")
public class TryOnController {
    @Autowired
    TryOnService tryOnService;

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> sseRequest() throws IOException {
        final UUID sessionId = tryOnService.generateSessionId();
        Long OneMinute = 60 * 1000L;
        SseEmitter emitter = tryOnService.getEmitterByTimeOut(OneMinute);
        emitter = tryOnService.sendSessionIdToFlip(sessionId, emitter);
        return ResponseEntity.ok(emitter);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody TryOnVerifyReq info) throws IOException {
        SseEmitter emitter = tryOnService.getEmitterBySessionId(UUID.fromString((info.getSessionId())));
        Boolean success = tryOnService.sendUserInfoToMobile(info, emitter);
        Boolean isYourToken = tryOnService.isYourToken(info.getToken(), info.getId());
        if (success & isYourToken) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }
}
