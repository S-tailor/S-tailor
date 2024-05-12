package com.ssafy.api.service;

import com.ssafy.api.request.ChatSendReq;
import com.ssafy.api.response.ChatResultDTO;
import com.ssafy.api.response.SearchResultDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
public class ChatbotServiceImpl implements ChatbotService{

    @Value("${Lambda_URL}")
    private String url;

    @Autowired
    S3UpDownloadService s3UpDownloadService;

    @Override
    public ChatResultDTO chatSend(ChatSendReq body, List<String> urls) {
        RestTemplate restTemplate = new RestTemplate();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("profile", body.getProfile());
        if (body.getText() != null)
            jsonObject.put("text", body.getText());
        if (urls != null)
            jsonObject.put("image", urls);

        ResponseEntity<String> response = restTemplate.postForEntity(url+"/chatbot", jsonObject, String.class);

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

    @Override
    public List<String> saveImage(ChatSendReq body) {
        List<MultipartFile>images=body.getImage();
        List<String>urls=new ArrayList<String>();

        for(MultipartFile image:images) {
            urls.add(s3UpDownloadService.imageChatUpload(image,body.getProfile()));
        }

        return urls;
    }

    @Override
    public boolean clearMessages(String profile) {
        RestTemplate restTemplate = new RestTemplate();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("profile", profile);

        ResponseEntity<String> response = restTemplate.postForEntity(url+"/clear", jsonObject, String.class);
        System.out.println(profile);
        System.out.println(jsonObject);
        System.out.println(response);

        if(response!=null)
            return true;
        else
            return false;
    }
}
