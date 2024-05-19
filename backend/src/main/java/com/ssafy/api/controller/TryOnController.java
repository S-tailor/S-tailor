package com.ssafy.api.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.ssafy.api.request.TryOnReq;
import com.ssafy.api.request.TryOnVerifyReq;
import com.ssafy.api.response.TryOnGenerateRes;
import com.ssafy.api.response.TryOnListRes;
import com.ssafy.api.service.TryOnService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Tryon;
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
        Boolean isYourToken = tryOnService.isYourToken(info.getToken(), info.getId());
        if(!isYourToken) {
            return ResponseEntity.ok("fail");
        }
        SseEmitter emitter = tryOnService.getEmitterBySessionId(UUID.fromString((info.getSessionId())));
        Boolean success = tryOnService.sendUserInfoToMobile(info, emitter);

        if (success & isYourToken) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.ok("fail");
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<? extends BaseResponseBody> fastApi(@ModelAttribute TryOnReq info) {
        Tryon result = tryOnService.getGeneratedImage(info);
        if(result != null) {
            return ResponseEntity.ok(TryOnGenerateRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/list")
    public ResponseEntity<? extends BaseResponseBody> list(int profilePk) {
        Map<String, Object> result = tryOnService.getList(profilePk);
        if(result != null) {
            return ResponseEntity.ok(TryOnListRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }
}
