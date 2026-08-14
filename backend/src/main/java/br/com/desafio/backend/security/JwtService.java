package br.com.desafio.backend.security;

import br.com.desafio.backend.entity.UsuarioEntity;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String CHAVE_SECRETA =
            "sistema-skill-chave-secreta-para-jwt-2026";

    private static final long TEMPO_EXPIRACAO =
            1000 * 60 * 60 * 24;

    private final SecretKey chave;

    public JwtService() {
        this.chave = Keys.hmacShaKeyFor(
                CHAVE_SECRETA.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String gerarToken(UsuarioEntity usuario) {

        Date dataAtual = new Date();

        Date dataExpiracao = new Date(
                dataAtual.getTime() + TEMPO_EXPIRACAO
        );

        return Jwts.builder()
                .subject(usuario.getLogin())
                .claim("usuarioId", usuario.getId())
                .issuedAt(dataAtual)
                .expiration(dataExpiracao)
                .signWith(chave)
                .compact();
    }

    public String extrairLogin(String token) {

        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validarToken(String token) {

        try {
            Jwts.parser()
                    .verifyWith(chave)
                    .build()
                    .parseSignedClaims(token);

            return true;

        } catch (Exception exception) {
            return false;
        }
    }
}