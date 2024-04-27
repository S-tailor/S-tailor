package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserIdCheckRes extends BaseResponseBody {
    boolean IsUser;

    public static UserIdCheckRes of(int statusCode, String message, boolean isUser) {
        UserIdCheckRes res = new UserIdCheckRes();

        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setIsUser(isUser);
        return res;
    }
}
