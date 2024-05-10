package com.ssafy.api.service;

import com.ssafy.api.request.TryOnReq;
import com.ssafy.api.request.TryOnVerifyReq;
import com.ssafy.common.util.JwtTokenUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TryOnServiceImpl implements TryOnService{
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Value("${VTON_URL}")
    private String VTON_URL;

    @Autowired
    S3UpDownloadService s3UpDownloadService;

    @Override
    public UUID generateSessionId() {
        return UUID.randomUUID();
    }

    @Override
    public SseEmitter getEmitterByTimeOut(Long timeout) {
        return new SseEmitter(timeout);
    }

    @Override
    public SseEmitter sendSessionIdToFlip(UUID sessionId, SseEmitter emitter) {
        emitter.onCompletion(() -> emitters.remove(sessionId));
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
        return emitter;
    }

    @Override
    public SseEmitter getEmitterBySessionId(UUID sessionId) {
        return emitters.get(sessionId);
    }

    @Override
    public Boolean sendUserInfoToMobile(TryOnVerifyReq info, SseEmitter emitter) {
        try {
            JSONObject data = new JSONObject();

            data.put("sessionId", info.getSessionId());
            data.put("token", info.getToken());
            data.put("id", info.getId());
            data.put("profilePk", info.getProfilePk());

            emitter.send(SseEmitter.event()
                    .name("getUserInfo")
                    .data(data.toJSONString()));
            emitter.complete();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            //throw new RuntimeException(e);
            return false;
        }
    }

    @Override
    public Boolean isYourToken(String token, String id) {
        String decodedUserId = JwtTokenUtil.getDecodedUserId(token);
        return decodedUserId.equals(id);
    }

    @Override
    public String getGeneratedImage(TryOnReq info) {
        String model = s3UpDownloadService.saveTryOnModelImage(info.getModel(),info.getProfilePk());

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = null;

        JSONObject body = new JSONObject();
        body.put("model",model);
        body.put("cloth",info.getCloth());
        body.put("profilePk",String.valueOf(info.getProfilePk()));

        response = restTemplate.postForEntity(VTON_URL,body,String.class);

        JSONParser parser = new JSONParser();

        try {
            JSONObject responseObject = (JSONObject) parser.parse(response.getBody());
            String result = (String) responseObject.get("generatedImage");
            return result;
        } catch (ParseException e) {
            return null;
        }
    }
}
