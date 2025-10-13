package com.expensesharing.dto;

public class SplitDTO {
    
    private String participant;
    private Double amount;
    
    public SplitDTO() {}
    
    public SplitDTO(String participant, Double amount) {
        this.participant = participant;
        this.amount = amount;
    }
    
    // Getters and Setters
    public String getParticipant() {
        return participant;
    }
    
    public void setParticipant(String participant) {
        this.participant = participant;
    }
    
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
}