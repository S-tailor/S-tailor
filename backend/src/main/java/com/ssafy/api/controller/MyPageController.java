package com.ssafy.api.controller;

import com.ssafy.api.request.MyPageInfoUpdateReq;
import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.response.*;
import com.ssafy.api.service.MyPageService;
import com.ssafy.api.service.MyPageServiceImpl;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.Calendar;
import com.ssafy.common.util.Deposit;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetDeposit;
import com.ssafy.db.join.GetEmotionRank;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Api(value = "마이페이지 API", tags = {"MyPage."})
@RestController
@CrossOrigin("*")
@RequestMapping("/mypage")
public class MyPageController {

    @Autowired
    MyPageService myPageService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/info")
    @ApiOperation(value = "회원정보조회", notes = "<strong>아이디</strong>를 통해 현재 로그인 한 유저의 정보를 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> info(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        User user = myPageService.getUserInfo(userId);
        if(user != null) {
            return ResponseEntity.ok(MyPageGetUserRes.of(200, "Success", user.getUserId(), user.getNickname(), user.getGender()));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @PutMapping("/info/update")
    @ApiOperation(value = "회원정보수정", notes = "로그인 된 유저의 <strong>아이디, 패스워드, 닉네임, 성별</strong>을 수정한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> update(@RequestBody @ApiParam(value="로그인 유저 아이디 정보", required = true) MyPageInfoUpdateReq info) {
        String originUserId = info.getOriginUserId();
        String updateUserId = info.getUpdateUserId();
        String password = passwordEncoder.encode(info.getPassword());
        String nickname = info.getNickname();
        String gender = info.getGender();

        if(myPageService.updateUserInfo(originUserId , updateUserId, password, nickname, gender) == 1) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/sum")
    @ApiOperation(value = "누적 저축액 조회", notes = "<strong>아이디</strong>를 통해 유저의 통장에 저축된 금액을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> sum(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        Map<String, Object> result = myPageService.getBalanceAndGoal(userId);
        if(result != null) {
            return ResponseEntity.ok(MyPageGetSumRes.of(200, "Success", (long)result.get("balance"), (long)result.get("goal")));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/account/history")
    @ApiOperation(value = "저축 내역 조회", notes = "<strong>아이디</strong>를 통해 유저의 통장에 저축한 내역을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> accountHistory(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        List<GetAccountHistory> result = myPageService.getAccountHistory(userId);
        if(result != null) {
            return ResponseEntity.ok(MyPageGetAccountHistoryRes.of(200,"Success", result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/deposit/line")
    @ApiOperation(value = "저축액 추이 조회", notes = "<strong>아이디</strong>를 통해 유저의 통장의 저축액 추이를 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> depositLine(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        List<Deposit> result = myPageService.getDeposit(userId);
        if(result != null) {
            return ResponseEntity.ok(MyPageGetDepositLineRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/emotion/rank")
    @ApiOperation(value = "주요 감정 조회", notes = "<strong>아이디</strong>를 통해 유저의 주요 감정을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> emotionRank(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        List<GetEmotionRank> result = myPageService.getEmotionRank(userId);
        if(result != null) {
            return ResponseEntity.ok(MyPageGetEmotionRankRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }

    @GetMapping("/calendar")
    @ApiOperation(value = "주요 감정 조회", notes = "<strong>아이디</strong>를 통해 유저의 주요 감정을 조회한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공", response = UserLoginPostRes.class),
            @ApiResponse(code = 401, message = "인증 실패", response = BaseResponseBody.class),
            @ApiResponse(code = 404, message = "사용자 없음", response = BaseResponseBody.class),
            @ApiResponse(code = 500, message = "서버 오류", response = BaseResponseBody.class)
    })
    public ResponseEntity<? extends BaseResponseBody> calendar(@ApiParam(value="로그인 유저 아이디 정보", required = true) String userId) {
        List<Calendar> result = myPageService.getCalendar(userId);
        if(result != null) {
            return ResponseEntity.ok(MyPageGetCalendarRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
    }
}
