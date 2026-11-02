package com.example.realestate.crm.repository;

import com.example.realestate.crm.CrmContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CrmContactRepository extends JpaRepository<CrmContact, UUID> {
    List<CrmContact> findByAgentIdOrderByLastContactedAtDesc(UUID agentId);
    long countByAgentId(UUID agentId);
}
