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

    @Query(value = "select * from closet " +
            "where profilePk = :profilePk and " +
            "(source like concat('%',:content,'%') or name like concat('%',:content,'%')) and" +
            " isdelete = false", nativeQuery = true)
    List<Closet> closetSearch(String content, int profilePk);

    List<Closet> findAllByProfilePkAndSourceContainingOrNameContaining(int profilePk, String source, String name);
}
