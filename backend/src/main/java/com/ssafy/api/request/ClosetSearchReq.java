package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ClosetSearchReq {
    String content;
    int profilePk;
}
