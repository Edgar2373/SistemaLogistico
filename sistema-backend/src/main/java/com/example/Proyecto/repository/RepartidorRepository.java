package com.example.Proyecto.repository;

import com.example.Proyecto.entity.Repartidor;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepartidorRepository extends JpaRepository<Repartidor, Integer> {

    Optional<Repartidor> findByUsuarioIdUsuario(Integer idUsuario);
}