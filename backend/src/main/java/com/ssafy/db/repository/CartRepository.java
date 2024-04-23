package com.ssafy.db.repository;

import com.ssafy.db.entity.Closet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Closet, Long> {
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update closet set cart = true where closetPk = :closetPk", nativeQuery = true)
    int cartAdd(int closetPk);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update closet set cart = false where closetPk = :closetPk", nativeQuery = true)
    int cartDelete(int closetPk);

    List<Closet> findAllByProfilePkAndCart(int profilePk, boolean cart);
}
