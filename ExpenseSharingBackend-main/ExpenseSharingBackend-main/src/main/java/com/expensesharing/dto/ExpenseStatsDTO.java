package com.expensesharing.dto;

import java.util.List;

public class ExpenseStatsDTO {
    
    private Long totalExpenses;
    private List<ParticipantSpending> participantSpending;
    private List<CategoryBreakdown> categoryBreakdown;
    
    public ExpenseStatsDTO() {}
    
    public ExpenseStatsDTO(Long totalExpenses, List<ParticipantSpending> participantSpending,
                           List<CategoryBreakdown> categoryBreakdown) {
        this.totalExpenses = totalExpenses;
        this.participantSpending = participantSpending;
        this.categoryBreakdown = categoryBreakdown;
    }
    
    // Getters and Setters
    public Long getTotalExpenses() {
        return totalExpenses;
    }
    
    public void setTotalExpenses(Long totalExpenses) {
        this.totalExpenses = totalExpenses;
    }
    
    public List<ParticipantSpending> getParticipantSpending() {
        return participantSpending;
    }
    
    public void setParticipantSpending(List<ParticipantSpending> participantSpending) {
        this.participantSpending = participantSpending;
    }
    
    public List<CategoryBreakdown> getCategoryBreakdown() {
        return categoryBreakdown;
    }
    
    public void setCategoryBreakdown(List<CategoryBreakdown> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }
    
    public static class ParticipantSpending {
        private String name;
        private Double amount;
        
        public ParticipantSpending() {}
        
        public ParticipantSpending(String name, Double amount) {
            this.name = name;
            this.amount = amount;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public Double getAmount() {
            return amount;
        }
        
        public void setAmount(Double amount) {
            this.amount = amount;
        }
    }
    
    public static class CategoryBreakdown {
        private String category;
        private Double amount;
        
        public CategoryBreakdown() {}
        
        public CategoryBreakdown(String category, Double amount) {
            this.category = category;
            this.amount = amount;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public Double getAmount() {
            return amount;
        }
        
        public void setAmount(Double amount) {
            this.amount = amount;
        }
    }
}