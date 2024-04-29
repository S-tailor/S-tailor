package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ChatSendReq {
    String profile;
    String text;
    List<String> image;
}
