package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TryOnVerifyReq {
    String token;
    String id;
    String sessionId;
    int profilePk;
}
