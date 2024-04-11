package com.ssafy.api.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DonationPayReq {
    String name;
    String userId;
    long amount;
}
