package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MyPageGetUserRes extends BaseResponseBody {
    String userId;
    String nickname;
    String gender;

    public static MyPageGetUserRes of(int statusCode, String message, String userId, String nickname, String gender){
        MyPageGetUserRes res = new MyPageGetUserRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setUserId(userId);
        res.setNickname(nickname);
        res.setGender(gender);

        return res;
    }
}
