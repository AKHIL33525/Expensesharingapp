package com.expensesharing.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ExpenseSplitRequestDTO {
    
    @NotNull(message = "Expense ID is required")
    private Long expenseId;
    
    public ExpenseSplitRequestDTO() {}
    
    public ExpenseSplitRequestDTO(Long expenseId) {
        this.expenseId = expenseId;
    }
    
    // Getters and Setters
    public Long getExpenseId() {
        return expenseId;
    }
    
    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }
}