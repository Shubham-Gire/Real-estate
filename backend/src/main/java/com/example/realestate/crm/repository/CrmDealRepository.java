package com.example.realestate.crm.repository;

import com.example.realestate.crm.CrmDeal;
import com.example.realestate.crm.enums.DealStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface CrmDealRepository extends JpaRepository<CrmDeal, UUID> {
    List<CrmDeal> findByAgentIdOrderByCreatedAtDesc(UUID agentId);
    List<CrmDeal> findByAgentIdAndStatusOrderByCreatedAtDesc(UUID agentId, DealStatus status);
    long countByAgentIdAndStatus(UUID agentId, DealStatus status);

    @Query("SELECT COALESCE(SUM(d.dealValue), 0) FROM CrmDeal d WHERE d.agent.id = :agentId AND d.status = 'ACTIVE'")
    BigDecimal sumActiveDealValueByAgentId(@Param("agentId") UUID agentId);

    @Query("SELECT COALESCE(SUM(d.commissionAmount), 0) FROM CrmDeal d WHERE d.agent.id = :agentId AND d.status = 'WON'")
    BigDecimal sumClosedCommissionByAgentId(@Param("agentId") UUID agentId);

    @Query("SELECT COALESCE(SUM(d.commissionAmount), 0) FROM CrmDeal d WHERE d.agent.id = :agentId AND d.status = 'ACTIVE'")
    BigDecimal sumProjectedCommissionByAgentId(@Param("agentId") UUID agentId);
}
