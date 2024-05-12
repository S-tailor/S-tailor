package com.ssafy.api.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SearchResultDTO {
    String title;
    String source;
    String link;
    String price;
    String image;
}
