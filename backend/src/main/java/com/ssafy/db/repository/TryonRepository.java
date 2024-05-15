package com.ssafy.db.repository;

import com.ssafy.db.entity.Tryon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TryonRepository extends JpaRepository<Tryon, Long> {

    List<Tryon> findAllByProfilePk(int profilePk);
}
