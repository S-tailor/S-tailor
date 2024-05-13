package com.ssafy.api.controller;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.api.request.ClosetSearchReq;
import com.ssafy.api.response.ClosetDataRes;
import com.ssafy.api.response.ClosetListRes;
import com.ssafy.api.service.ClosetService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Closet;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/closet")
public class ClosetController {
    @Autowired
    ClosetService closetService;

    @PostMapping("/save")
    public ResponseEntity<? extends BaseResponseBody> closetSave(@RequestBody ClosetSaveReq info) throws ParseException {
        if(closetService.closetSave(info)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<? extends BaseResponseBody> closetList(int profilePk) {
        List<Closet> data = closetService.closetList(profilePk);
        if(data != null) {
            return ResponseEntity.ok(ClosetListRes.of(200,"Success",data));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<? extends BaseResponseBody> closetFilter(int profilePk,String category) {
        List<Closet> data = closetService.closetFilter(profilePk,category);
        if(data != null) {
            return ResponseEntity.ok(ClosetListRes.of(200,"Success",data));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<? extends BaseResponseBody> closetDelete(int closetPk) {
        if(closetService.closetDelete(closetPk)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/search")
    public ResponseEntity<? extends BaseResponseBody> closetSearch(@RequestBody ClosetSearchReq info) {
        List<Closet> data = closetService.closetSearch(info);
        if(data != null) {
            return ResponseEntity.ok(ClosetListRes.of(200,"Success",data));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @GetMapping("/data")
    public ResponseEntity<? extends BaseResponseBody> closetData(int closetPk) {
        Closet result = closetService.closetData(closetPk);
        if(result != null) {
            return ResponseEntity.ok(ClosetDataRes.of(200,"Success",result));
        }
        return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
    }
}
