package com.ssafy.api.controller;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/tryon")
public class TryOnController {
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> sseRequest() throws IOException {
        final UUID sessionId = UUID.randomUUID();
        final SseEmitter emitter = new SseEmitter(60 * 1000L);

        emitter.onCompletion(() -> {
            emitters.remove(sessionId);
        });
        emitter.onError ((ex) -> {
            emitters.remove(sessionId);
            emitter.complete();
        });
        emitter.onTimeout (emitter::complete);

        emitters.put(sessionId, emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data(sessionId));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(emitter);
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(String sessionId, String token, String id, int profilePk) throws IOException {

//        System.out.println("Verifying:" + emitters.get(UUID.fromString((sessionId))));
        SseEmitter emitter = emitters.get(UUID.fromString((sessionId)));
        try {
            emitter.send(SseEmitter.event()
                    .name("getToken")
                    .data(token));
            emitter.complete();
            return ResponseEntity.ok("success");
        } catch (IOException e) {
            e.printStackTrace();
            //throw new RuntimeException(e);
            return ResponseEntity.ok("fail");
        }

    }


}
