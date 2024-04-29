package com.ssafy.api.service;

import com.ssafy.api.request.ChatSendReq;
import com.ssafy.api.response.ChatResultDTO;
import com.ssafy.api.response.SearchResultDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class ChatbotServiceImpl implements ChatbotService{

    @Value("${Lambda_URL}")
    private String url;

    @Override
    public ChatResultDTO chatSend(ChatSendReq body) {
        RestTemplate restTemplate = new RestTemplate();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("profile", body.getProfile());
        if (body.getText() != null)
            jsonObject.put("text", body.getText());
        if (body.getImage() != null)
            jsonObject.put("image", body.getImage());

        ResponseEntity<String> response = restTemplate.postForEntity(url, jsonObject, String.class);

        ChatResultDTO dto = new ChatResultDTO();
        try {
            JSONParser parser = new JSONParser();
            JSONObject responseJSON = (JSONObject) parser.parse(response.getBody());
            dto.setType((String) responseJSON.get("type"));
            dto.setBody((String) responseJSON.get("body"));
        } catch (ParseException e) {
            return null;
        }
        return dto;
    }
}
