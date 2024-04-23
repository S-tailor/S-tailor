package com.ssafy.api.service;

import com.ssafy.db.entity.Closet;
import com.ssafy.db.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService{
    @Autowired
    CartRepository cartRepository;

    @Override
    public boolean cartAdd(int closetPk) {
        try {
            cartRepository.cartAdd(closetPk);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public boolean cartDelete(int closetPk) {
        try {
            cartRepository.cartDelete(closetPk);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public List<Closet> cartList(int profilePk) {
        try {
            return cartRepository.findAllByProfilePkAndCart(profilePk,true);
        } catch (Exception e) {
            return null;
        }
    }
}
