/create database sistema_skill;

create sequence usuario_id_seq
    start with 1
    increment by 1;

create table usuario (
    id integer not null default nextval('usuario_id_seq'),
    login varchar(100) not null,
    senha varchar(255) not null,

    constraint pk_usuario primary key (id),
    constraint uk_usuario_login unique (login)
);

create sequence skill_id_seq
    start with 1
    increment by 1;

create table skill (
    id integer not null default nextval('skill_id_seq'),
    nome varchar(100) not null,
    descricao varchar(500),
    imagem varchar(500),

    constraint pk_skill primary key (id),
    constraint uk_skill_nome unique (nome)
);

create sequence usuario_skill_id_seq
    start with 1
    increment by 1;

create table usuario_skill (
    id integer not null default nextval('usuario_skill_id_seq'),
    usuario_id integer not null,
    skill_id integer not null,
    nivel varchar(50) not null,

    constraint pk_usuario_skill primary key (id),
    constraint fk_usuario_skill_usuario foreign key (usuario_id) references usuario(id),
    constraint fk_usuario_skill_skill foreign key (skill_id) references skill(id),
    constraint uk_usuario_skill unique (usuario_id, skill_id)
);

alter table usuario_skill
rename column nivel to level;

select
    id,
    usuario_id,
    skill_id,
    level
from usuario_skill
order by id;

select * from usuario_skill;
select * from usuario;
select * from skill;

insert into skill (nome, descricao, imagem)
values
('Java', 'Linguagem de programação', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'),
('React', 'Biblioteca para interfaces', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'),
('Spring Boot', 'Framework para desenvolvimento java', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'),
('Postgresql', 'Banco de dados relacional', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg');

insert into skill (nome, descricao, imagem) values
('JavaScript', 'Linguagem de programação para aplicações web', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'),
('HTML', 'Linguagem de marcação para páginas web', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'),
('CSS', 'Linguagem utilizada para estilização de páginas web', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'),
('TypeScript', 'Superset do JavaScript com tipagem estática', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'),
('Node.js', 'Ambiente de execução JavaScript no servidor', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'),
('Git', 'Sistema de controle de versão distribuído', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg'),
('GitHub', 'Plataforma para hospedagem e colaboração em projetos Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'),
('Docker', 'Plataforma para criação e execução de containers', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg'),
('Python', 'Linguagem de programação de alto nível', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'),
('MySQL', 'Sistema de gerenciamento de banco de dados relacional', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'),
('MongoDB', 'Banco de dados orientado a documentos', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'),
('React Native', 'Framework para desenvolvimento de aplicações mobile', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg');