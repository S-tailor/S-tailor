package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@ApiModel("EmotionAnalysisPostRequest")
public class MemoSavePostReq {
	@ApiModelProperty(name="유저 ID", example="ssafy@ssafy.com")
	String userId;
	@ApiModelProperty(name="작성된 메모", example="오늘 기분이 좋아")
	String memo;
	@ApiModelProperty(name="선택된 이모지", example="happiness")
	String selectedEmotion;
	@ApiModelProperty(name="입력한 금액", example="1000")
	Long amount;
	@ApiModelProperty(name="분석된 결과 정보", example="1")
	int emotionResultPk;
}
