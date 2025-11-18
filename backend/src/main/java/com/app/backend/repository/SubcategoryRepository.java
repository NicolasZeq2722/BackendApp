package com.app.backend.repository;

import com.app.backend.model.Subcategory;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoryRepository extends JpaRepository <Subcategory, Long>{
    List<Subcategory> findByCategoryId(Long categoryId);
}