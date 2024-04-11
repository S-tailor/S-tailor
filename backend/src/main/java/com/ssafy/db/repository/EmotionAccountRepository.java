package com.ssafy.db.repository;

import com.ssafy.db.entity.EmotionAccount;
import com.ssafy.db.join.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EmotionAccountRepository extends JpaRepository<EmotionAccount, Long> {

    EmotionAccount findByEmotionAccountPk(int emotionAccountPk);



    @Query(value = "SELECT eah.emotionAccountPk AS emotionAccountPk, ea.createAt AS createAt, er.happiness AS rate " +
            "FROM EmotionAccountHistory eah " +
            "JOIN EmotionAccount ea " +
            "ON eah.emotionAccountPk = ea.emotionAccountPk " +
            "JOIN EmotionResult er " +
            "ON ea.emotionResultPk = er.emotionResultPk " +
            "JOIN User u " +
            "ON ea.userPk = u.userPk " +
            "WHERE u.userId = :userId AND ea.isMarked = true " +
            "ORDER BY rate desc limit 7", nativeQuery = true)
    List<GetAlbumHistory> getAlbumHistory(String userId);

    @Query(value = "select memo from EmotionAccount where emotionAccountPk = :emotionAccountPk", nativeQuery = true)
    String getAlbumDetail(int emotionAccountPk);
}
