package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class TryOnReq {
    MultipartFile model;
    String cloth;
    int profilePk;
}
