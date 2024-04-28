package com.ssafy.api.controller;

import com.ssafy.api.request.SearchImageReq;
import com.ssafy.api.response.SearchResultDTO;
import com.ssafy.api.response.SearchRes;
import com.ssafy.api.service.SearchService;
import com.ssafy.common.model.response.BaseResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/search")
public class SearchController {
    @Autowired
    SearchService searchService;

    @GetMapping("/text")
    public ResponseEntity<? extends BaseResponseBody> textSearch(String content) {
        System.out.println(content);
        List<SearchResultDTO> result = searchService.textSearch(content);
        if(result != null) {
            return ResponseEntity.ok(SearchRes.of(200,"Success",result));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/image")
    public ResponseEntity<? extends BaseResponseBody> imageSearch(@ModelAttribute SearchImageReq info) {
        List<SearchResultDTO> result = searchService.imageSearch(info.getImage());
        if(result != null) {
            return ResponseEntity.ok(SearchRes.of(200,"Success",result));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }
}
