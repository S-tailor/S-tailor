package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@ApiModel("EmojiSelectPostRequest")
public class EmojiSelectPostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy@ssafy.com")
	String userId;
	@ApiModelProperty(name="선택한 이모지", example="happiness")
	String emoji;
	@ApiModelProperty(name="입력한 금액", example="1000")
	Long amount;
}
