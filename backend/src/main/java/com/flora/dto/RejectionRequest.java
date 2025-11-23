package com.flora.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectionRequest {
    private String rejectionReason;
    private String adminNotes;
}
