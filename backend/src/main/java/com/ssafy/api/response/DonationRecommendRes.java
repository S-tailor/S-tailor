package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.join.GetDonationRecommend;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class DonationRecommendRes extends BaseResponseBody {
    List<GetDonationRecommend> data;

    public static DonationRecommendRes of(int statusCode, String message, List<GetDonationRecommend> data) {
        DonationRecommendRes res = new DonationRecommendRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);

        res.setData(data);

        return res;
    }
}
