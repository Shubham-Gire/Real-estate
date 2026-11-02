package com.example.realestate.crm.repository;

import com.example.realestate.crm.CrmLead;
import com.example.realestate.crm.enums.LeadStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface CrmLeadRepository extends JpaRepository<CrmLead, UUID> {
    List<CrmLead> findByAgentIdOrderByCreatedAtDesc(UUID agentId);
    List<CrmLead> findByAgentIdAndStageOrderByCreatedAtDesc(UUID agentId, LeadStage stage);
    long countByAgentId(UUID agentId);
    long countByAgentIdAndStage(UUID agentId, LeadStage stage);

    @Query("SELECT COALESCE(SUM(l.budget), 0) FROM CrmLead l WHERE l.agent.id = :agentId AND l.stage NOT IN ('CLOSED_WON', 'CLOSED_LOST')")
    BigDecimal sumActivePipelineBudgetByAgentId(@Param("agentId") UUID agentId);
}
