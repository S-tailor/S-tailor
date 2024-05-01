package com.ssafy.api.controller;

import java.io.IOException;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/tryon")
public class TryOnController {
    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> sseRequest() throws IOException {
        final UUID sessionId = UUID.randomUUID();
        final SseEmitter emitter = new SseEmitter(60 * 1000L);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data(sessionId));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(emitter);
    }
}
