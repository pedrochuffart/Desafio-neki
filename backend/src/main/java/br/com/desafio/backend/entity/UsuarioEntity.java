package br.com.desafio.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario")
public class UsuarioEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "usuario_id_seq"
    )
    @SequenceGenerator(
            name = "usuario_id_seq",
            sequenceName = "usuario_id_seq",
            allocationSize = 1
    )
    private Integer id;

    @Column(name = "login", nullable = false, unique = true)
    private String login;

    @Column(name = "senha", nullable = false)
    private String senha;

    public Integer getId() {
        return id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
