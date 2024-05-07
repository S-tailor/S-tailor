package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Profile;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ProfileCreateRes extends BaseResponseBody {
    int profilePk;

    public static ProfileCreateRes of(int statusCode, String message, int profilePk) {
        ProfileCreateRes res = new ProfileCreateRes();

        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setProfilePk(profilePk);

        return res;
    }

}
