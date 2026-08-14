package br.com.desafio.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skill")
public class SkillEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "skill_id_seq"
    )
    @SequenceGenerator(
            name = "skill_id_seq",
            sequenceName = "skill_id_seq",
            allocationSize = 1
    )
    private Integer id;

    @Column(name = "nome", nullable = false, unique = true)
    private String nome;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "imagem")
    private String imagem;

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }
}
