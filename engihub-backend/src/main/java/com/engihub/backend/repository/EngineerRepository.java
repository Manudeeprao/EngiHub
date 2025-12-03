
package com.engihub.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engihub.backend.model.Engineer;

@Repository
public interface EngineerRepository extends JpaRepository<Engineer, Long> {
    List<Engineer> findBySpecialization(String specialization);
    Engineer findByUserId(Long userId);
}
