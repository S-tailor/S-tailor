package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class SearchRes extends BaseResponseBody {
    List<SearchResultDTO> result;

    public static SearchRes of(int statusCode, String message, List<SearchResultDTO> result) {
        SearchRes res = new SearchRes();

        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(result);

        return res;
    }
}
