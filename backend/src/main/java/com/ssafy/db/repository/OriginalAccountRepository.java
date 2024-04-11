package com.ssafy.db.repository;

import com.ssafy.db.entity.Account;
import com.ssafy.db.entity.OriginalAccount;
import com.ssafy.db.join.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface OriginalAccountRepository extends JpaRepository<OriginalAccount, Long> {
    @Query(value = "SELECT oa.bankCode AS bankCode, oa.number AS number, oa.originalAccountPk AS accountPk " +
            "FROM OriginalAccount oa JOIN User u ON oa.userPk = u.userPk " +
            "WHERE u.userId = :userId")
    List<GetAccountInfo> getOriginAccountInfo(String userId);

    @Query(value = "SELECT oa.availableAmt AS balance " +
            "FROM OriginalAccount oa " +
            "JOIN User u ON oa.userPk = u.userPk " +
            "WHERE u.userId = :userId")
    Long getAvailableAmtByUserId(String userId);

    @Modifying
    @Transactional
    @Query("UPDATE OriginalAccount SET availableAmt = :newBalance " +
            "WHERE userPk = :userPk")
    void updateAvailableAmtByUserPk(int userPk, Long newBalance);
}
