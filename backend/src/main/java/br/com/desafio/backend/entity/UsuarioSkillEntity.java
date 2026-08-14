package br.com.desafio.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "usuario_skill",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_usuario_skill",
                        columnNames = {"usuario_id", "skill_id"}
                )
        }
)
public class UsuarioSkillEntity {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "usuario_skill_id_seq"
    )
    @SequenceGenerator(
            name = "usuario_skill_id_seq",
            sequenceName = "usuario_skill_id_seq",
            allocationSize = 1
    )
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioEntity usuario;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private SkillEntity skill;

    @Column(name = "level", nullable = false)
    private String level;

    public Integer getId() {
        return id;
    }

    public UsuarioEntity getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioEntity usuario) {
        this.usuario = usuario;
    }

    public SkillEntity getSkill() {
        return skill;
    }

    public void setSkill(SkillEntity skill) {
        this.skill = skill;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
