package com.example.realestate.crm.dto;

import com.example.realestate.crm.CrmNote;
import com.example.realestate.crm.enums.NoteType;

import java.time.Instant;
import java.util.UUID;

public class CrmNoteDTO {
    private UUID id;
    private UUID agentId;
    private String entityType;
    private UUID entityId;
    private NoteType noteType;
    private String content;
    private Instant createdAt;

    public CrmNoteDTO() {}

    public CrmNoteDTO(CrmNote note) {
        this.id = note.getId();
        this.agentId = note.getAgent() != null ? note.getAgent().getId() : null;
        this.entityType = note.getEntityType();
        this.entityId = note.getEntityId();
        this.noteType = note.getNoteType();
        this.content = note.getContent();
        this.createdAt = note.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getAgentId() { return agentId; }
    public void setAgentId(UUID agentId) { this.agentId = agentId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }

    public NoteType getNoteType() { return noteType; }
    public void setNoteType(NoteType noteType) { this.noteType = noteType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
