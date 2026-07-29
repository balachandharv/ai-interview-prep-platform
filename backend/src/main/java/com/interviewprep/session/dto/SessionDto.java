package com.interviewprep.session.dto;
import lombok.Builder;
import lombok.Data;
import java.util.UUID;
@Data @Builder public class SessionDto {
    private UUID id;
}