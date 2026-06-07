
package com.example.Proyecto.service;


import com.example.Proyecto.dto.AuthResponse;
import com.example.Proyecto.dto.LoginRequest;
import com.example.Proyecto.dto.RegisterRequest;


public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}