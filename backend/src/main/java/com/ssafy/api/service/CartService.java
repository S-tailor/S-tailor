package com.ssafy.api.service;

import com.ssafy.db.entity.Closet;

import java.util.List;

public interface CartService {
    boolean cartAdd(int closetPk);
    boolean cartDelete(int closetPk);
    List<Closet> cartList(int profilePk);
}
