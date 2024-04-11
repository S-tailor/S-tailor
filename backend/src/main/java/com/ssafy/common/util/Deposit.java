package com.ssafy.common.util;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class Deposit {
    long amount;
    long balance;
    String date;
}
