package com.ssafy.api.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@ToString
@Setter
public class ProfileCreateReq {
    String name;
    String height;
    String weight;
    String gender;
    MultipartFile image;
    int userPk;
    int profilePk;
}
