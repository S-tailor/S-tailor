package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@ApiModel("MyPageInfoUpdateReq")
public class MyPageInfoUpdateReq {
    String originUserId;
    String updateUserId;
    String password;
    String nickname;
    String gender;
}
