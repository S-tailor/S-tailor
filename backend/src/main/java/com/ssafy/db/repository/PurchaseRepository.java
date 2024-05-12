package com.ssafy.db.repository;

import com.ssafy.db.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface PurchaseRepository extends JpaRepository<Purchase,Long> {
}
