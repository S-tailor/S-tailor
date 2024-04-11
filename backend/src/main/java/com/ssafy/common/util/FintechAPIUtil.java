package com.ssafy.common.util;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Component
public class FintechAPIUtil {
    public static JSONObject baseHeaderSetting(String apiName, String userKey) {
        JSONObject header = new JSONObject();
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        header.put("apiName",apiName);
        header.put("transmissionDate",date);
        header.put("transmissionTime",time);
        header.put("institutionCode","00100");
        header.put("fintechAppNo","001");
        header.put("apiServiceCode",apiName);
        header.put("institutionTransactionUniqueNo",date+time+String.valueOf((int)(Math.random()*899999+100000)));
        header.put("apiKey","225e3a73837d432bacdf6d106a04a256");
        header.put("userKey",userKey);

        return header;
    }
}
