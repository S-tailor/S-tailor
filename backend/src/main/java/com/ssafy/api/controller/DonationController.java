package com.ssafy.api.controller;

import com.ssafy.api.request.AccountCreateReq;
import com.ssafy.api.request.DonationPayReq;
import com.ssafy.api.response.AccountDetailRes;
import com.ssafy.api.response.DonationHistoryRes;
import com.ssafy.api.response.DonationRecommendRes;
import com.ssafy.api.service.DonationService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Account;
import com.ssafy.db.entity.DonationHistory;
import com.ssafy.db.join.GetDonationHistory;
import com.ssafy.db.join.GetDonationRecommend;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donation")
public class DonationController {
    @Autowired
    DonationService donationService;


    @GetMapping("/recommend")
    @ApiOperation(value = "기부 단체 추천", notes = "<strong>정해진 감정</strong>를 통해 기부 단체를 조회 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> donationRecommend(
            @ApiParam(value="회원가입 정보", required = true) String emotion){
        List<GetDonationRecommend> result = donationService.getDonationRecommend(emotion);
        if(result != null) {
            return ResponseEntity.ok(DonationRecommendRes.of(200,"Success",result));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @GetMapping("/recommend/all")
    @ApiOperation(value = "기부 단체 전체 추천", notes = "모든 기부 단체를 조회 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> donationRecommendAll() {
        List<GetDonationRecommend> result = donationService.getDonationRecommendAll();
        if(result != null) {
            return ResponseEntity.ok(DonationRecommendRes.of(200,"Success",result));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/pay")
    @ApiOperation(value = "기부 송금", notes = "<strong>기부 단체 이름, 기부금</strong>를 통해 기부를 진행 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> donationPay(
            @RequestBody @ApiParam(value="회원가입 정보", required = true) DonationPayReq donationPayReq){

        if(donationService.donationPay(donationPayReq)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @GetMapping("/history")
    @ApiOperation(value = "기부 내역 조회", notes = "<strong>유저 아이디</strong>를 통해 기부 내역을 조회합니다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> donationHistory(
            @ApiParam(value="사용자 아이디", required = true) String userId){
        List<GetDonationHistory> result = donationService.getDonationHistory(userId);
        if(result != null) {
            return ResponseEntity.ok(DonationHistoryRes.of(200,"Success", result));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }
}
