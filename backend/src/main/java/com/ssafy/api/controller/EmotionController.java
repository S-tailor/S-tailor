package com.ssafy.api.controller;

import com.ssafy.api.request.EmojiSelectPostReq;
import com.ssafy.api.request.EmotionAnalysisPostReq;
import com.ssafy.api.request.MemoSavePostReq;
import com.ssafy.api.response.*;
import com.ssafy.api.service.EmotionService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.EmotionResult;
import com.ssafy.db.entity.User;
import com.ssafy.db.entity.DonationHistory;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetAlbumHistory;
import io.swagger.annotations.*;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(value = "감정분석 API", tags = {"Emotion."})
@RestController
@RequestMapping("/emotion")
public class EmotionController {

    @Autowired
    EmotionService emotionService;

    @PostMapping("/ai")
    @ApiOperation(value = "AI 분석 요청", notes = "<strong>메모</strong>의 감정 분석을 요청한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> analyzeEmotion(@RequestBody @ApiParam(value="Ai 감정 분석", required = true) EmotionAnalysisPostReq emotionAnalysisInfo) {
        String userId = emotionAnalysisInfo.getUserId();
        String memo = emotionAnalysisInfo.getMemo();

        EmotionResult emotions = emotionService.analyzeEmotion(memo);

        if(memo != null) {
            return ResponseEntity.ok(EmotionAnalysisPostRes.of(200, "Success", emotions));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @PostMapping("/emoji")
    @ApiOperation(value = "emoji 저축", notes = "<strong>emoji 선택</strong> 및 금액을 입력받아 저축을 요청한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> saveEmoji(@RequestBody @ApiParam(value="Emoji 저축", required = true) EmojiSelectPostReq emojiSelectPostReq) {
        String userId = emojiSelectPostReq.getUserId();
        String emoji = emojiSelectPostReq.getEmoji();
        Long amount = emojiSelectPostReq.getAmount();

        int result = emotionService.emojiSaving(userId, emoji, amount);

        if(result != 0) {
            return ResponseEntity.ok(EmojiSavingPostRes.of(200,"Success", result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(200,"Fail"));
    }


    @PostMapping("/create")
    @ApiOperation(value = "감정 메모 저축 저장", notes = "<strong>작성된 memo</strong>, 이모지 및 금액을 입력받아 저축을 요청한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> saveMemo(@RequestBody @ApiParam(value="메모 저축", required = true) MemoSavePostReq memoSavePostReq) {
        String userId = memoSavePostReq.getUserId();
        String memo = memoSavePostReq.getMemo();
        String emoji = memoSavePostReq.getSelectedEmotion();
        Long amount = memoSavePostReq.getAmount();
        int emotionResultPk = memoSavePostReq.getEmotionResultPk();

        int result = emotionService.memoSaving(userId, memo, emoji, amount, emotionResultPk);

        if(result != 0) {
            return ResponseEntity.ok(EmojiSavingPostRes.of(200,"Success", result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(200,"Fail"));
    }

    @PostMapping("/album")
    @ApiOperation(value = "감정 메모 액자 저장 여부", notes = "작성 된 memo에 대해 <strong>앨범 선택 여부</strong>를 요청한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> selectAlbum(@ApiParam(value="감정 메모 액자 저장 여부", required = true) int emotionAccountPk) {
        if(emotionService.selectAlbum(emotionAccountPk)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/album")
    @ApiOperation(value = "액자 조회", notes = "<strong>유저 아이디</strong>를 통해 액자를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> albumHistory(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {

        List<GetAlbumHistory> result = emotionService.getAlbumHistory(userId);

        if(result != null) {
            return ResponseEntity.ok(EmotionAlbumHistoryRes.of(200,"Success", result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(200,"Fail"));
    }

    @GetMapping("/album/detail")
    @ApiOperation(value = "액자 상세 조회", notes = "<strong>감정 기록 PK</strong>를 통해 액자를 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> albumDetail(@ApiParam(value="감정 기록 PK 정보", required = true) int emotionAccountPk) {

        String result = emotionService.getAlbumDetail(emotionAccountPk);

        if(result != null) {
            return ResponseEntity.ok(EmotionAlbumDetailRes.of(200,"Success", result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(200,"Fail"));
    }
}
