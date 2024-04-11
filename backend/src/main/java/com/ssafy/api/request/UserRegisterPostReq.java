package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 유저 로그인 API ([POST] /user/create) 요청에 필요한 리퀘스트 바디 정의.
 */
@Getter
@Setter
@ApiModel("UserRegisterPostRequest")
public class UserRegisterPostReq {
    @ApiModelProperty(name="유저 ID", example="id")
    String userId;
    @ApiModelProperty(name="유저 Password", example="password")
    String password;
    @ApiModelProperty(name="유저 gender", example="gender")
    String gender;
    @ApiModelProperty(name="유저 nickname", example="nickname")
    String nickname;
}
