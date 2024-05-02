package com.ssafy.api.controller;

import java.io.IOException;
import java.util.UUID;

import com.ssafy.api.service.TryOnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping("/verify")
    public ResponseEntity<String> verify(String sessionId, String token, String id, int profilePk) throws IOException {
        SseEmitter emitter = tryOnService.getEmitterBySessionId(UUID.fromString((sessionId)));
        Boolean success = tryOnService.sendUserInfoToMobile(sessionId, token, id, profilePk, emitter);
        if (success) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }
}
