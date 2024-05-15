package com.ssafy.api.service;

import com.ssafy.api.request.TryOnReq;
import com.ssafy.api.request.TryOnVerifyReq;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.Closet;
import com.ssafy.db.entity.Tryon;
import com.ssafy.db.repository.ClosetRepository;
import com.ssafy.db.repository.TryonRepository;
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
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TryOnServiceImpl implements TryOnService{
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Value("${VTON_URL}")
    private String VTON_URL;

    @Autowired
    S3UpDownloadService s3UpDownloadService;

    @Autowired
    ClosetRepository closetRepository;

    @Autowired
    TryonRepository tryonRepository;

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
    public Tryon getGeneratedImage(TryOnReq info) {
        String cloth;

        try {
            cloth = closetRepository.findByClosetPk(info.getClosetPk()).getImage();
        } catch (Exception e) {
            return null;
        }

        String model = s3UpDownloadService.saveTryOnModelImage(info.getModel(),info.getProfilePk());

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = null;

        JSONObject body = new JSONObject();
        body.put("model",model);
        body.put("cloth",cloth);
        body.put("profilePk",String.valueOf(info.getProfilePk()));
        body.put("category",info.getCategory());

        response = restTemplate.postForEntity(VTON_URL,body,String.class);

        JSONParser parser = new JSONParser();

        try {
            JSONObject responseObject = (JSONObject) parser.parse(response.getBody());
            String generatedImage = (String) responseObject.get("generatedImage");

            Tryon tryon = new Tryon();

            tryon.setGeneratedImage(generatedImage);
            tryon.setClosetPk(info.getClosetPk());
            tryon.setProfilePk(info.getProfilePk());

            Tryon result = tryonRepository.save(tryon);
            return result;
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    public Map<String, Object> getList(int profilePk) {
        try {
            List<Tryon> tryonList = tryonRepository.findAllByProfilePk(profilePk);

            List<Closet> closetList = new ArrayList<>();

            for (Tryon tryon : tryonList) {
                Closet closet = closetRepository.findByClosetPk(tryon.getClosetPk());
                closetList.add(closet);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("tryonList",tryonList);
            result.put("closetList",closetList);

            return result;
        } catch (Exception e) {
            return null;
        }
    }
}
