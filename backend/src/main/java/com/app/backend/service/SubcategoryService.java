package com.app.backend.service;

import com.app.backend.model.Subcategory;
import com.app.backend.model.Category;
import com.app.backend.repository.SubcategoryRepository;
import com.app.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubcategoryService {  

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // Obtener todas las subcategorías
    public List<Subcategory> findAll() {
        return subcategoryRepository.findAll();
    }

    // Buscar subcategoría por ID
    public Subcategory findById(Long id) {
        return subcategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
    }

    // Crear nueva subcategoría
    public Subcategory create(Subcategory subcategory) {

        // Validar categoría enviada
        if (subcategory.getCategory() == null || subcategory.getCategory().getId() == null) {
            throw new RuntimeException("Debe especificar una categoría válida");
        }

        Category category = categoryRepository.findById(
                subcategory.getCategory().getId()
        ).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        subcategory.setCategory(category);

        return subcategoryRepository.save(subcategory);
    }

    // Actualizar subcategoría
    public Subcategory update(Long id, Subcategory subcategoryDetails) {

        Subcategory subcategory = findById(id);

        subcategory.setName(subcategoryDetails.getName());
        subcategory.setDescription(subcategoryDetails.getDescription());
        subcategory.setActive(subcategoryDetails.getActive());

        // Si envían categoría nueva
        if (subcategoryDetails.getCategory() != null &&
            subcategoryDetails.getCategory().getId() != null) {

            Category category = categoryRepository.findById(
                    subcategoryDetails.getCategory().getId()
            ).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

            subcategory.setCategory(category);
        }

        return subcategoryRepository.save(subcategory);
    }

    // Eliminar una subcategoría
    public void delete(Long id) {
        Subcategory subcategory = findById(id);
        subcategoryRepository.delete(subcategory);
    }

    // Buscar subcategorías por ID de categoría
    public List<Subcategory> findByCategoryId(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId);
    }
}