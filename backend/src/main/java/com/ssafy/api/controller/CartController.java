package com.ssafy.api.controller;

import com.ssafy.api.request.CartPurchaseReq;
import com.ssafy.api.response.CartListRes;
import com.ssafy.api.service.CartService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Closet;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<? extends BaseResponseBody> cartAdd(int closetPk) {
        if(cartService.cartAdd(closetPk)) {
            return ResponseEntity.ok(BaseResponseBody.of(200, "Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<? extends BaseResponseBody> cartDelete(int closetPk) {
        if(cartService.cartDelete(closetPk)) {
            return ResponseEntity.ok(BaseResponseBody.of(200, "Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<? extends BaseResponseBody> cartList(int profilePk) {
        List<Closet> list = cartService.cartList(profilePk);
        if(list != null) {
            return ResponseEntity.ok(CartListRes.of(200, "Success", list));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @PostMapping("/purchase")
    public ResponseEntity<? extends BaseResponseBody> purchase(@RequestBody CartPurchaseReq info) {
        if(cartService.purchase(info.getPrice())) {
            return ResponseEntity.ok(BaseResponseBody.of(200, "Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }
}
