package com.ssafy.api.request;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class SearchImageReq {
    MultipartFile image;
}
