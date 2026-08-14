package br.com.desafio.backend.security;

import br.com.desafio.backend.entity.UsuarioEntity;
import br.com.desafio.backend.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UsuarioRepository usuarioRepository
    ) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String cabecalho =
                request.getHeader("Authorization");

        if (cabecalho == null ||
                !cabecalho.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = cabecalho.substring(7);

        if (!jwtService.validarToken(token)) {

            filterChain.doFilter(request, response);
            return;
        }

        String login = jwtService.extrairLogin(token);

        if (SecurityContextHolder
                .getContext()
                .getAuthentication() == null) {

            UsuarioEntity usuario =
                    usuarioRepository
                            .findByLogin(login)
                            .orElse(null);

            if (usuario != null) {

                UsernamePasswordAuthenticationToken autenticacao =
                        new UsernamePasswordAuthenticationToken(
                                usuario,
                                null,
                                java.util.Collections.emptyList()
                        );

                autenticacao.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(autenticacao);
            }
        }

        filterChain.doFilter(request, response);
    }
}