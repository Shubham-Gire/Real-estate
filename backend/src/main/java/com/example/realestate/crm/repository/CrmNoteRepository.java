package com.example.realestate.crm.repository;

import com.example.realestate.crm.CrmNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CrmNoteRepository extends JpaRepository<CrmNote, UUID> {
    List<CrmNote> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, UUID entityId);
    List<CrmNote> findByAgentIdOrderByCreatedAtDesc(UUID agentId);
}
