package com.example.realestate.crm;

import com.example.realestate.common.exception.ResourceNotFoundException;
import com.example.realestate.crm.dto.*;
import com.example.realestate.crm.enums.*;
import com.example.realestate.crm.repository.*;
import com.example.realestate.notification.NotificationService;
import com.example.realestate.property.Property;
import com.example.realestate.property.PropertyRepository;
import com.example.realestate.user.User;
import com.example.realestate.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CrmService {

    private final CrmLeadRepository leadRepository;
    private final CrmDealRepository dealRepository;
    private final CrmContactRepository contactRepository;
    private final CrmShowingRepository showingRepository;
    private final CrmNoteRepository noteRepository;
    private final AgentProfileRepository agentProfileRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final NotificationService notificationService;

    public CrmService(
            CrmLeadRepository leadRepository,
            CrmDealRepository dealRepository,
            CrmContactRepository contactRepository,
            CrmShowingRepository showingRepository,
            CrmNoteRepository noteRepository,
            AgentProfileRepository agentProfileRepository,
            UserRepository userRepository,
            PropertyRepository propertyRepository,
            NotificationService notificationService) {
        this.leadRepository = leadRepository;
        this.dealRepository = dealRepository;
        this.contactRepository = contactRepository;
        this.showingRepository = showingRepository;
        this.noteRepository = noteRepository;
        this.agentProfileRepository = agentProfileRepository;
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.notificationService = notificationService;
    }

    // ==========================================
    // AGENT CRM DASHBOARD STATS
    // ==========================================
    @Transactional(readOnly = true)
    public AgentCrmStatsDTO getAgentCrmStats(UUID agentId) {
        long totalLeads = leadRepository.countByAgentId(agentId);
        BigDecimal activePipelineBudget = leadRepository.sumActivePipelineBudgetByAgentId(agentId);

        long activeDealsCount = dealRepository.countByAgentIdAndStatus(agentId, DealStatus.ACTIVE);
        BigDecimal activeDealsValue = dealRepository.sumActiveDealValueByAgentId(agentId);
        BigDecimal closedCommissionYTD = dealRepository.sumClosedCommissionByAgentId(agentId);
        BigDecimal projectedCommission = dealRepository.sumProjectedCommissionByAgentId(agentId);

        long upcomingShowings = showingRepository.countByAgentIdAndStatus(agentId, ShowingStatus.CONFIRMED)
                + showingRepository.countByAgentIdAndStatus(agentId, ShowingStatus.REQUESTED);
        long totalContacts = contactRepository.countByAgentId(agentId);

        Map<String, Long> leadsByStage = new LinkedHashMap<>();
        for (LeadStage s : LeadStage.values()) {
            leadsByStage.put(s.name(), leadRepository.countByAgentIdAndStage(agentId, s));
        }

        Map<String, Long> dealsByStage = new LinkedHashMap<>();
        for (DealStage ds : DealStage.values()) {
            dealsByStage.put(ds.name(), 0L);
        }

        return new AgentCrmStatsDTO(
                totalLeads,
                activePipelineBudget != null ? activePipelineBudget : BigDecimal.ZERO,
                activeDealsCount,
                activeDealsValue != null ? activeDealsValue : BigDecimal.ZERO,
                closedCommissionYTD != null ? closedCommissionYTD : BigDecimal.ZERO,
                projectedCommission != null ? projectedCommission : BigDecimal.ZERO,
                upcomingShowings,
                totalContacts,
                leadsByStage,
                dealsByStage
        );
    }

    // ==========================================
    // LEADS & KANBAN PIPELINE
    // ==========================================
    @Transactional(readOnly = true)
    public List<CrmLeadDTO> getLeads(UUID agentId, LeadStage stage) {
        List<CrmLead> leads;
        if (stage != null) {
            leads = leadRepository.findByAgentIdAndStageOrderByCreatedAtDesc(agentId, stage);
        } else {
            leads = leadRepository.findByAgentIdOrderByCreatedAtDesc(agentId);
        }
        return leads.stream().map(CrmLeadDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CrmLeadDTO createLead(UUID agentId, CrmLeadCreateDTO dto) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        CrmLead lead = new CrmLead();
        lead.setAgent(agent);
        lead.setContactName(dto.getContactName());
        lead.setContactEmail(dto.getContactEmail());
        lead.setContactPhone(dto.getContactPhone());
        lead.setStage(dto.getStage() != null ? dto.getStage() : LeadStage.NEW_LEAD);
        lead.setSource(dto.getSource() != null ? dto.getSource() : LeadSource.WEBSITE);
        lead.setBudget(dto.getBudget());
        lead.setPriority(dto.getPriority() != null ? dto.getPriority() : LeadPriority.WARM);
        lead.setNotes(dto.getNotes());

        if (dto.getClientId() != null) {
            userRepository.findById(dto.getClientId()).ifPresent(lead::setClient);
        }
        if (dto.getPropertyId() != null) {
            propertyRepository.findById(dto.getPropertyId()).ifPresent(lead::setProperty);
        }

        CrmLead saved = leadRepository.save(lead);

        // Also add initial note
        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            noteRepository.save(new CrmNote(agent, "LEAD", saved.getId(), NoteType.GENERAL, dto.getNotes()));
        }

        return new CrmLeadDTO(saved);
    }

    @Transactional
    public CrmLeadDTO updateLeadStage(UUID agentId, UUID leadId, CrmLeadStageUpdateDTO dto) {
        CrmLead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));

        if (!lead.getAgent().getId().equals(agentId)) {
            throw new IllegalArgumentException("Unauthorized to modify this lead");
        }

        LeadStage oldStage = lead.getStage();
        lead.setStage(dto.getStage());

        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            lead.setNotes((lead.getNotes() != null ? lead.getNotes() + "\n" : "") + dto.getNotes());
            noteRepository.save(new CrmNote(
                    lead.getAgent(),
                    "LEAD",
                    lead.getId(),
                    NoteType.GENERAL,
                    "Stage changed from " + oldStage + " to " + dto.getStage() + ": " + dto.getNotes()
            ));
        }

        CrmLead saved = leadRepository.save(lead);
        return new CrmLeadDTO(saved);
    }

    // ==========================================
    // DEALS & COMMISSION
    // ==========================================
    @Transactional(readOnly = true)
    public List<CrmDealDTO> getDeals(UUID agentId, DealStatus status) {
        List<CrmDeal> deals;
        if (status != null) {
            deals = dealRepository.findByAgentIdAndStatusOrderByCreatedAtDesc(agentId, status);
        } else {
            deals = dealRepository.findByAgentIdOrderByCreatedAtDesc(agentId);
        }
        return deals.stream().map(CrmDealDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CrmDealDTO createDeal(UUID agentId, CrmDealCreateDTO dto) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        CrmDeal deal = new CrmDeal();
        deal.setAgent(agent);
        deal.setDealName(dto.getDealName());
        deal.setClientName(dto.getClientName());
        deal.setDealValue(dto.getDealValue());

        BigDecimal rate = dto.getCommissionRate() != null ? dto.getCommissionRate() : new BigDecimal("3.00");
        deal.setCommissionRate(rate);

        // Commission Amount = (dealValue * rate) / 100
        BigDecimal commissionAmount = dto.getDealValue().multiply(rate).divide(new BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
        deal.setCommissionAmount(commissionAmount);

        deal.setStatus(dto.getStatus() != null ? dto.getStatus() : DealStatus.ACTIVE);
        deal.setStage(dto.getStage() != null ? dto.getStage() : DealStage.OFFER_SUBMITTED);
        deal.setExpectedCloseDate(dto.getExpectedCloseDate());

        if (dto.getLeadId() != null) {
            leadRepository.findById(dto.getLeadId()).ifPresent(deal::setLead);
        }
        if (dto.getPropertyId() != null) {
            propertyRepository.findById(dto.getPropertyId()).ifPresent(deal::setProperty);
        }

        CrmDeal saved = dealRepository.save(deal);
        return new CrmDealDTO(saved);
    }

    @Transactional
    public CrmDealDTO updateDealStatus(UUID agentId, UUID dealId, DealStatus status) {
        CrmDeal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found"));

        if (!deal.getAgent().getId().equals(agentId)) {
            throw new IllegalArgumentException("Unauthorized to modify this deal");
        }

        deal.setStatus(status);
        if (status == DealStatus.WON) {
            deal.setClosedAt(Instant.now());
            deal.setStage(DealStage.CLOSED);
        }

        CrmDeal saved = dealRepository.save(deal);
        return new CrmDealDTO(saved);
    }

    // ==========================================
    // CRM CONTACTS DIRECTORY
    // ==========================================
    @Transactional(readOnly = true)
    public List<CrmContactDTO> getContacts(UUID agentId) {
        return contactRepository.findByAgentIdOrderByLastContactedAtDesc(agentId)
                .stream().map(CrmContactDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CrmContactDTO createContact(UUID agentId, CrmContactCreateDTO dto) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        CrmContact contact = new CrmContact();
        contact.setAgent(agent);
        contact.setFullName(dto.getFullName());
        contact.setEmail(dto.getEmail());
        contact.setPhone(dto.getPhone());
        contact.setContactType(dto.getContactType() != null ? dto.getContactType() : ContactType.BUYER);
        contact.setBudgetMin(dto.getBudgetMin());
        contact.setBudgetMax(dto.getBudgetMax());
        contact.setPreferredLocations(dto.getPreferredLocations());
        contact.setNotes(dto.getNotes());

        if (dto.getUserId() != null) {
            userRepository.findById(dto.getUserId()).ifPresent(contact::setUser);
        }

        CrmContact saved = contactRepository.save(contact);
        return new CrmContactDTO(saved);
    }

    // ==========================================
    // SHOWINGS & PROPERTY TOURS
    // ==========================================
    @Transactional(readOnly = true)
    public List<CrmShowingDTO> getShowings(UUID agentId, ShowingStatus status) {
        List<CrmShowing> showings;
        if (status != null) {
            showings = showingRepository.findByAgentIdAndStatusOrderByShowingTimeAsc(agentId, status);
        } else {
            showings = showingRepository.findByAgentIdOrderByShowingTimeAsc(agentId);
        }
        return showings.stream().map(CrmShowingDTO::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CrmShowingDTO> getClientShowings(UUID clientId) {
        return showingRepository.findByClientIdOrderByShowingTimeDesc(clientId)
                .stream().map(CrmShowingDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CrmShowingDTO createShowing(UUID clientId, CrmShowingCreateDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        User agent = property.getOwner(); // Assigned agent or owner
        User client = clientId != null ? userRepository.findById(clientId).orElse(null) : null;

        CrmShowing showing = new CrmShowing();
        showing.setAgent(agent);
        showing.setProperty(property);
        showing.setClient(client);
        showing.setClientName(dto.getClientName());
        showing.setClientEmail(dto.getClientEmail());
        showing.setClientPhone(dto.getClientPhone());
        showing.setShowingTime(dto.getShowingTime());
        showing.setShowingType(dto.getShowingType() != null ? dto.getShowingType() : ShowingType.IN_PERSON);
        showing.setStatus(ShowingStatus.REQUESTED);
        showing.setNotes(dto.getNotes());

        CrmShowing saved = showingRepository.save(showing);

        // Also create a CRM Lead automatically for this inquiry / showing!
        CrmLead lead = new CrmLead();
        lead.setAgent(agent);
        lead.setClient(client);
        lead.setProperty(property);
        lead.setContactName(dto.getClientName());
        lead.setContactEmail(dto.getClientEmail());
        lead.setContactPhone(dto.getClientPhone());
        lead.setStage(LeadStage.SHOWING_SCHEDULED);
        lead.setSource(LeadSource.WEBSITE);
        lead.setBudget(property.getPrice());
        lead.setPriority(LeadPriority.HOT);
        lead.setNotes("Tour booked for property: " + property.getTitle());
        leadRepository.save(lead);

        // Send alert notification to the agent
        notificationService.createNotification(
                agent,
                "New Tour Request!",
                dto.getClientName() + " requested a showing for \"" + property.getTitle() + "\"",
                "SHOWING_REQUEST",
                "/agent/showings"
        );

        return new CrmShowingDTO(saved);
    }

    @Transactional
    public CrmShowingDTO updateShowingStatus(UUID agentId, UUID showingId, CrmShowingStatusUpdateDTO dto) {
        CrmShowing showing = showingRepository.findById(showingId)
                .orElseThrow(() -> new ResourceNotFoundException("Showing not found"));

        if (!showing.getAgent().getId().equals(agentId)) {
            throw new IllegalArgumentException("Unauthorized to modify this showing");
        }

        showing.setStatus(dto.getStatus());
        if (dto.getNotes() != null) showing.setNotes(dto.getNotes());
        if (dto.getFeedback() != null) showing.setFeedback(dto.getFeedback());

        CrmShowing saved = showingRepository.save(showing);

        // Notify client if client is registered user
        if (showing.getClient() != null) {
            notificationService.createNotification(
                    showing.getClient(),
                    "Tour " + dto.getStatus().name(),
                    "Your tour for \"" + showing.getProperty().getTitle() + "\" is now " + dto.getStatus().name().toLowerCase(),
                    "SHOWING_UPDATE",
                    "/portal/showings"
            );
        }

        return new CrmShowingDTO(saved);
    }

    // ==========================================
    // CRM NOTES & ACTIVITY
    // ==========================================
    @Transactional(readOnly = true)
    public List<CrmNoteDTO> getNotes(UUID agentId, String entityType, UUID entityId) {
        return noteRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream().map(CrmNoteDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public CrmNoteDTO createNote(UUID agentId, CrmNoteCreateDTO dto) {
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        CrmNote note = new CrmNote(agent, dto.getEntityType(), dto.getEntityId(), dto.getNoteType(), dto.getContent());
        CrmNote saved = noteRepository.save(note);
        return new CrmNoteDTO(saved);
    }

    // ==========================================
    // AGENT PROFILES & VERIFICATION
    // ==========================================
    @Transactional(readOnly = true)
    public AgentProfileDTO getAgentProfile(UUID userId) {
        return agentProfileRepository.findByUserId(userId)
                .map(AgentProfileDTO::new)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    AgentProfile profile = new AgentProfile(user);
                    profile.setLicenseNumber(user.getLicenseNumber());
                    profile.setAgencyName(user.getAgencyName());
                    profile.setBio(user.getBio());
                    return new AgentProfileDTO(agentProfileRepository.save(profile));
                });
    }

    @Transactional
    public AgentProfileDTO updateAgentProfile(UUID userId, AgentProfileUpdateDTO dto) {
        AgentProfile profile = agentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    AgentProfile p = new AgentProfile(user);
                    return agentProfileRepository.save(p);
                });

        if (dto.getLicenseNumber() != null) profile.setLicenseNumber(dto.getLicenseNumber());
        if (dto.getAgencyName() != null) profile.setAgencyName(dto.getAgencyName());
        if (dto.getSpecialties() != null) profile.setSpecialties(dto.getSpecialties());
        if (dto.getExperienceYears() != null) profile.setExperienceYears(dto.getExperienceYears());
        if (dto.getCommissionRate() != null) profile.setCommissionRate(dto.getCommissionRate());
        if (dto.getBio() != null) profile.setBio(dto.getBio());

        return new AgentProfileDTO(agentProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public List<AgentProfileDTO> getAllAgents() {
        return agentProfileRepository.findAll()
                .stream().map(AgentProfileDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public void toggleAgentVerification(UUID agentId, boolean verified) {
        AgentProfile profile = agentProfileRepository.findByUserId(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent profile not found"));
        profile.setVerified(verified);
        agentProfileRepository.save(profile);
    }
}
