package com.ssafy.api.service;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.api.request.ClosetSearchReq;
import com.ssafy.db.entity.Closet;
import com.ssafy.db.repository.ClosetRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Base64;
import java.util.List;

@Service
public class ClosetServiceImpl implements ClosetService{
    @Autowired
    ClosetRepository closetRepository;

    @Value("${GCP_Key}")
    String GCPKey;

    @Override
    public boolean closetSave(ClosetSaveReq info) throws ParseException {

        //deduce category
        URL url = null;
        BufferedImage bi = null;
        String encodedString=null;
        String clothing=null;

        try {
            url = new URL(info.getThumbNail());
            bi = ImageIO.read(url);
            ByteArrayOutputStream bos= new ByteArrayOutputStream();
            ImageIO.write(bi,"jpg",bos);
            Base64.Encoder encoder=Base64.getEncoder();
            encodedString = encoder.encodeToString(bos.toByteArray());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        if (bi != null) {
            RestTemplate restTemplate = new RestTemplate();

            //using google vision
            String apiUrl = "https://vision.googleapis.com/v1/images:annotate?key="+GCPKey;

            JSONObject jsonObject = new JSONObject();

            JSONObject imageObject = new JSONObject();
            imageObject.put("content", encodedString);

            JSONObject featuresObject = new JSONObject();
            featuresObject.put("type", "OBJECT_LOCALIZATION");
            featuresObject.put("maxResults", 10);


            JSONArray featuresArray = new JSONArray();
            featuresArray.add(featuresObject);

            JSONObject requestObject = new JSONObject();
            requestObject.put("image", imageObject);
            requestObject.put("features", featuresArray);

            JSONArray requestsArray = new JSONArray();
            requestsArray.add(requestObject);

            jsonObject.put("requests", requestsArray);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, jsonObject, String.class);

            //parsing the response
            JSONParser parser = new JSONParser();
            JSONObject responseJSON = (JSONObject) parser.parse(response.getBody());

            JSONArray responsesArray = (JSONArray) responseJSON.get("responses");
            JSONObject firstResponse = (JSONObject) responsesArray.get(0);
            JSONArray annotationsArray = (JSONArray) firstResponse.get("localizedObjectAnnotations");
            JSONObject firstAnnotation = (JSONObject) annotationsArray.get(0);

            clothing = (String) firstAnnotation.get("name");

        } else {
            System.out.println("Failed to load the image from URL.");
        }



        Closet closet = new Closet();

        closet.setLink(info.getLink());
        closet.setPrice(info.getPrice());
        closet.setImage(info.getThumbNail());
        closet.setName(info.getName());
        closet.setProfilePk(info.getProfilePk());
        closet.setSource(info.getSource());
        closet.setCategory(clothing);

        try {
            closetRepository.save(closet);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public List<Closet> closetList(int profilePk) {
        try {
            return closetRepository.findAllByProfilePkAndIsDelete(profilePk, false);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Closet> closetFilter(int profilePk, String category) {
        try {
            if(!category.equals("Etc"))
                return closetRepository.findAllByProfilePkAndCategoryAndIsDelete(profilePk, category,false);
            else
                return closetRepository.findRestByProfilePkAndIsDelete(profilePk);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean closetDelete(int closetPk) {
        try {
            if(closetRepository.closetDelete(closetPk) == 1) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public List<Closet> closetSearch(ClosetSearchReq info) {
        try {
            return closetRepository.closetSearch(info.getContent(), info.getProfilePk());
        } catch (Exception e) {
            return null;
        }
    }
}
