package com.ssafy.api.service;

import com.ssafy.api.response.SearchResultDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SearchService {
    List<SearchResultDTO> textSearch(String content);

    List<SearchResultDTO> imageSearch(MultipartFile image);
}
