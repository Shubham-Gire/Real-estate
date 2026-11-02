package com.example.realestate.crm.dto;

import com.example.realestate.crm.enums.NoteType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CrmNoteCreateDTO {

    @NotBlank(message = "Entity type is required")
    private String entityType; // LEAD, DEAL, CONTACT, SHOWING

    @NotNull(message = "Entity ID is required")
    private UUID entityId;

    private NoteType noteType = NoteType.GENERAL;

    @NotBlank(message = "Note content is required")
    private String content;

    public CrmNoteCreateDTO() {}

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }

    public NoteType getNoteType() { return noteType; }
    public void setNoteType(NoteType noteType) { this.noteType = noteType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
