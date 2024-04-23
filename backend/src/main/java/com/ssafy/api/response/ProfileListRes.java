package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Profile;
import com.ssafy.db.join.ProfileList;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@ToString
public class ProfileListRes extends BaseResponseBody {
    List<ProfileList> result;

    public static ProfileListRes of(int statusCode, String message, List<ProfileList> data) {
        ProfileListRes res = new ProfileListRes();

        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(data);

        return res;
    }
}
