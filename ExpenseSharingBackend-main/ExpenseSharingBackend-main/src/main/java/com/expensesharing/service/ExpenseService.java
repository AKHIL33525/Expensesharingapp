package com.expensesharing.service;

import com.expensesharing.dto.ExpenseDTO;
import com.expensesharing.dto.ExpenseStatsDTO;
import com.expensesharing.dto.SplitDTO;
import com.expensesharing.entity.Expense;
import com.expensesharing.exception.ResourceNotFoundException;
import com.expensesharing.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setTitle(expenseDTO.getTitle());
        expense.setAmount(expenseDTO.getAmount());
        expense.setDate(LocalDateTime.parse(expenseDTO.getDate(), formatter));
        expense.setPaidBy(expenseDTO.getPaidBy());
        expense.setParticipants(expenseDTO.getParticipants());
        expense.setGroupId(expenseDTO.getGroupId());
        
        Expense savedExpense = expenseRepository.save(expense);
        return convertToDTO(savedExpense);
    }
    
    public List<ExpenseDTO> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return convertToDTO(expense);
    }
    
    public List<SplitDTO> splitExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + expenseId));
        
        double totalAmount = expense.getAmount();
        int participantCount = expense.getParticipants().size();
        
        if (participantCount == 0) {
            throw new IllegalArgumentException("No participants found for expense");
        }
        
        double amountPerPerson = totalAmount / participantCount;
        
        return expense.getParticipants().stream()
                .map(participant -> new SplitDTO(participant, amountPerPerson))
                .collect(Collectors.toList());
    }
    
    public ExpenseStatsDTO getExpenseStats() {
        Long totalExpenses = expenseRepository.count();
        
        // Get participant spending
        List<Object[]> participantData = expenseRepository.getParticipantSpending();
        List<ExpenseStatsDTO.ParticipantSpending> participantSpending = participantData.stream()
                .map(data -> new ExpenseStatsDTO.ParticipantSpending((String) data[0], (Double) data[1]))
                .collect(Collectors.toList());
        
        // Get category breakdown (using title as category for simplicity)
        List<Object[]> categoryData = expenseRepository.getCategoryBreakdown();
        List<ExpenseStatsDTO.CategoryBreakdown> categoryBreakdown = categoryData.stream()
                .map(data -> new ExpenseStatsDTO.CategoryBreakdown((String) data[0], (Double) data[1]))
                .collect(Collectors.toList());
        
        return new ExpenseStatsDTO(totalExpenses, participantSpending, categoryBreakdown);
    }
    
    private ExpenseDTO convertToDTO(Expense expense) {
        return new ExpenseDTO(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getDate().format(formatter),
                expense.getPaidBy(),
                expense.getParticipants(),
                expense.getGroupId(),
                expense.getCreatedAt().format(formatter)
        );
    }
}