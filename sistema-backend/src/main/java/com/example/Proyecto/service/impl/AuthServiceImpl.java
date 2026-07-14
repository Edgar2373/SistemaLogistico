
package com.example.Proyecto.service.impl;

import com.example.Proyecto.dto.AuthResponse;
import com.example.Proyecto.dto.LoginRequest;
import com.example.Proyecto.dto.RegisterRequest;
import com.example.Proyecto.entity.Repartidor;
import com.example.Proyecto.entity.Usuario;

import com.example.Proyecto.repository.RepartidorRepository;
import com.example.Proyecto.repository.UsuarioRepository;
import com.example.Proyecto.security.JwtService;
import com.example.Proyecto.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{

    private final UsuarioRepository usuarioRepository;
    private final RepartidorRepository repartidorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .telefono(request.getTelefono())
                .usuario(request.getUsuario())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol())
                .estadoUsuario("ACTIVO")
                .build();

        usuarioRepository.save(usuario);

        String token = jwtService.generateToken(usuario.getUsuario());

        return new AuthResponse(token, usuario.getRol().name(), usuario.getNombre(), usuario.getIdUsuario(), null);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository
                .findByUsuario(request.getUsuario())
                .orElseThrow(() -> new RuntimeException("Credenciales incorrectas"));

        if ("FUERA_DE_SERVICIO".equals(usuario.getEstadoUsuario())) {
            throw new RuntimeException("Fuera de servicio");
        }

        boolean passwordCorrecto = passwordEncoder.matches(
                request.getPassword(),
                usuario.getPasswordHash()
        );

        if(!passwordCorrecto){
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtService.generateToken(usuario.getUsuario());

        Integer repartidorId = null;
        if (usuario.getRol() != null && usuario.getRol().name().equals("REPARTIDOR")) {
            Repartidor repartidor = repartidorRepository.findByUsuarioIdUsuario(usuario.getIdUsuario()).orElse(null);
            if (repartidor != null) {
                repartidorId = repartidor.getIdRepartidor();
            }
        }

        return new AuthResponse(token, usuario.getRol().name(), usuario.getNombre(), usuario.getIdUsuario(), repartidorId);
    }
}