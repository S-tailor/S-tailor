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
    List<Closet> findAllByProfilePkAndIsDeleteOrderByClosetPkDesc(int ProfilePk, boolean isDelete);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update closet set isDelete = true where closetPk = :closetPk", nativeQuery = true)
    int closetDelete(int closetPk);

    @Query(value = "select * from closet " +
            "where profilePk = :profilePk and " +
            "(source like concat('%',:content,'%') or name like concat('%',:content,'%')) and" +
            " isdelete = false order by closetPk desc", nativeQuery = true)
    List<Closet> closetSearch(String content, int profilePk);


    List<Closet> findAllByProfilePkAndSourceContainingOrNameContainingOrderByClosetPkDesc(int profilePk, String source, String name);

    List<Closet> findAllByProfilePkAndCategoryAndIsDeleteOrderByClosetPkDesc(int profilePk, String category, boolean b);
    @Query(value = "select * from closet " +
            "where profilePk = :profilePk and " +
            "category NOT IN ('Outerwear', 'Top', 'Pants', 'Shorts', 'Skirt', 'Miniskirt', 'Dress') and " +
            " isdelete = false order by profilePk desc", nativeQuery = true)
    List<Closet>findRestByProfilePkAndIsDelete(int profilePk);

    Closet findByClosetPk(int closetPk);
}
