package com.ssafy.db.repository;

import com.ssafy.db.entity.Account;
import com.ssafy.db.entity.OriginalAccount;
import com.ssafy.db.join.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    @Query(value = "select balance, goal from Account where userPk = :userPk", nativeQuery = true)
    GetBalanceAndGoal getBalanceAndGoal(int userPk);

    @Query(value = "select ah.amount, ah.createAt, ea.memo, k.kind " +
            "from EmotionAccountHistory eah " +
            "join AccountHistory ah " +
            "on eah.transactionPk = ah.transactionPk " +
            "join EmotionAccount ea " +
            "on eah.emotionAccountPk = ea.emotionAccountPk " +
            "join Emotion k " +
            "on ea.emotionPk = k.emotionPk " +
            "where eah.userPk = :userPk " +
            "order by ah.createAt",nativeQuery = true)
    List<GetAccountHistory> getAccountHistory(int userPk);

    @Query(value = "select createAt, amount, SUM(amount) OVER(ORDER BY transactionPk) AS amountsum " +
            "from AccountHistory " +
            "where (select accountPk from Account where userPk = :userPk);", nativeQuery = true)
    List<GetDeposit> getDeposit(int userPk);

    @Query(value = "select emotionPk, count(emotionPk) as count " +
            "from EmotionAccount " +
            "where userPk = :userPk " +
            "group by emotionPk " +
            "order by emotionPk", nativeQuery = true)
    List<GetEmotionRank> getEmotionRank(int userPk);

    Account findByUserPk(int userPk);

    @Query(value = "SELECT a.bankCode AS bankCode, a.number AS number, a.AccountPk AS accountPk " +
            "FROM Account a " +
            "JOIN User u ON a.userPk = u.userPk " +
            "WHERE u.userId = :userId")
    List<GetAccountInfo> getAccountInfo(String userId);

    @Query(value = "SELECT a.balance AS balance " +
            "FROM Account a " +
            "JOIN User u ON a.userPk = u.userPk " +
            "WHERE u.userId = :userId")
    Long getBalanceByUserId(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE Account SET balance = :newBalance " +
            "WHERE userPk = :userPk")
    void updateBalanceByUserPk(int userPk, Long newBalance);
    
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Account set balance = :balance where userPk = :userPk",nativeQuery = true)
    int changeBalance(long balance, int userPk);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Account set name = :name, goal = :goal, imageUrl = :imageUrl where userPk = :userPk",nativeQuery = true)
    int accountUpdate(String name, long goal, String imageUrl, int userPk);

    int countByUserPk(int userPk);
}
