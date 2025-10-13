package com.expensesharing.repository;

import com.expensesharing.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByGroupId(Long groupId);
    
    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double getTotalExpenseAmount();
    
    @Query("SELECT e.paidBy, SUM(e.amount) FROM Expense e GROUP BY e.paidBy")
    List<Object[]> getParticipantSpending();
    
    @Query("SELECT e.title, SUM(e.amount) FROM Expense e GROUP BY e.title")
    List<Object[]> getCategoryBreakdown();
}