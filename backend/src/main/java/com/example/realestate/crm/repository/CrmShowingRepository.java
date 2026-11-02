package com.example.realestate.crm.repository;

import com.example.realestate.crm.CrmShowing;
import com.example.realestate.crm.enums.ShowingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CrmShowingRepository extends JpaRepository<CrmShowing, UUID> {
    List<CrmShowing> findByAgentIdOrderByShowingTimeAsc(UUID agentId);
    List<CrmShowing> findByAgentIdAndStatusOrderByShowingTimeAsc(UUID agentId, ShowingStatus status);
    List<CrmShowing> findByClientIdOrderByShowingTimeDesc(UUID clientId);
    long countByAgentIdAndStatus(UUID agentId, ShowingStatus status);
}
