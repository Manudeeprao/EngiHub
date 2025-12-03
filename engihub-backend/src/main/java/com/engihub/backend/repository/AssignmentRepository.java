
package com.engihub.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.engihub.backend.model.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
