package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Profile;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProfileSelectRes extends BaseResponseBody {
    Profile result;

    public static ProfileSelectRes of(int statusCode, String message, Profile data) {
        ProfileSelectRes res = new ProfileSelectRes();

        res.setStatusCode(statusCode);
        res.setMessage(message);

        res.setResult(data);

        return res;
    }
}
