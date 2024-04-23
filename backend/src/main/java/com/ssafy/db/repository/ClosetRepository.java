package com.ssafy.db.repository;

import com.ssafy.db.entity.Closet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface ClosetRepository extends JpaRepository<Closet, Long> {
    List<Closet> findAllByProfilePkAndIsDelete(int ProfilePk, boolean isDelete);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update closet set isDelete = true where closetPk = :closetPk", nativeQuery = true)
    int closetDelete(int closetPk);
}
