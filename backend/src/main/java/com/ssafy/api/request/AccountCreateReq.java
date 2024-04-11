package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@ToString
public class AccountCreateReq {
    String accountTypeUniqueNo;
    String userId;
    String name;
    String password;
    MultipartFile image;
    long goal;
}
