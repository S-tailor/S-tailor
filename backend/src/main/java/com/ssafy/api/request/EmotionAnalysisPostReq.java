package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@ApiModel("EmotionAnalysisPostRequest")
public class EmotionAnalysisPostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy@ssafy.com")
	String userId;
	@ApiModelProperty(name="감정 메모", example="memo")
	String memo;
}
