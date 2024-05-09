package com.ssafy.api.service;

import com.ssafy.api.response.SearchResultDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService{
    @Value("${SerpAPI_Key}")
    private String SerpAPI_Key;

    @Value("${Lambda_URL}")
    private String Lambda_URL;

    @Autowired
    S3UpDownloadService s3UpDownloadService;

    @Override
    public List<SearchResultDTO> textSearch(String content) {
        RestTemplate restTemplate = new RestTemplate();

        String url = Lambda_URL+"/search";
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("text", content);

        ResponseEntity<String> response = restTemplate.postForEntity(url, jsonObject,String.class);

        List<SearchResultDTO> result = new ArrayList<>();

        try {
            JSONParser parser = new JSONParser();
            JSONObject responseJSON = (JSONObject) parser.parse(response.getBody());
            JSONArray shoppingResults = (JSONArray) responseJSON.get("body");
            for (Object shoppingResult : shoppingResults) {
                SearchResultDTO dto = new SearchResultDTO();
                dto.setLink((String) ((JSONObject)shoppingResult).get("link"));
                dto.setSource((String) ((JSONObject)shoppingResult).get("source"));
                dto.setTitle((String) ((JSONObject)shoppingResult).get("title"));
                dto.setPrice((String) ((JSONObject)shoppingResult).get("price"));
                dto.setImage((String) ((JSONObject)shoppingResult).get("thumbnail"));

                result.add(dto);
            }
        } catch (ParseException e) {
            return null;
        }

        return result;
    }

    @Override
    public List<SearchResultDTO> imageSearch(MultipartFile image) {
        String image_url = s3UpDownloadService.imageSearchUpload(image);

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://serpapi.com/search.json?" +
                "engine=google_lens" +
                "&country=kr" +
                "&hl=ko" +
                "&api_key=" + SerpAPI_Key +
                "&url=" + image_url;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        List<SearchResultDTO> result = new ArrayList<>();

        try {
            JSONParser parser = new JSONParser();
            JSONObject responseJSON = (JSONObject) parser.parse(response.getBody());
            JSONArray visual_matches = (JSONArray) responseJSON.get("visual_matches");

            for (Object visual_match : visual_matches) {
                SearchResultDTO dto = new SearchResultDTO();
                dto.setLink((String) ((JSONObject)visual_match).get("link"));
                dto.setSource((String) ((JSONObject)visual_match).get("source"));
                dto.setTitle((String) ((JSONObject)visual_match).get("title"));
                dto.setImage((String) ((JSONObject)visual_match).get("thumbnail"));

                JSONObject price = (JSONObject) ((JSONObject) visual_match).get("price");

                if(price != null) {
                    dto.setPrice((String) price.get("value"));
                }
                result.add(dto);
            }
        } catch (ParseException e) {
            return null;
        }

        return result;
    }
}
