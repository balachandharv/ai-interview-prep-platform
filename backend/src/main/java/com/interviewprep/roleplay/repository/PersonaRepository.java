package com.interviewprep.roleplay.repository;

import com.interviewprep.roleplay.entity.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PersonaRepository extends JpaRepository<Persona, UUID> {
    List<Persona> findByActiveTrue();
}
