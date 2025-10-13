package com.expensesharing.controller;

import com.expensesharing.dto.ExpenseDTO;
import com.expensesharing.dto.ExpenseStatsDTO;
import com.expensesharing.dto.ExpenseSplitRequestDTO;
import com.expensesharing.dto.SplitDTO;
import com.expensesharing.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO createdExpense = expenseService.createExpense(expenseDTO);
        return new ResponseEntity<>(createdExpense, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenses = expenseService.getAllExpenses();
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        ExpenseDTO expense = expenseService.getExpenseById(id);
        return new ResponseEntity<>(expense, HttpStatus.OK);
    }
    
    @PostMapping("/split")
    public ResponseEntity<List<SplitDTO>> splitExpense(@Valid @RequestBody ExpenseSplitRequestDTO request) {
        List<SplitDTO> splits = expenseService.splitExpense(request.getExpenseId());
        return new ResponseEntity<>(splits, HttpStatus.OK);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ExpenseStatsDTO> getExpenseStats() {
        ExpenseStatsDTO stats = expenseService.getExpenseStats();
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}