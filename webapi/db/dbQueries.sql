
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    rolname VARCHAR(20) NOT NULL
);
	
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password varchar(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id),
	CONSTRAINT user_username UNIQUE (username),
	CONSTRAINT user_username UNIQUE (email)

);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    content TEXT
);


CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL
);
 
CREATE TABLE posts_users(
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_post INT NOT NULL,
    post_release DATE,
    last_edition DATE,
	FOREIGN KEY (id_user) REFERENCES users(id),
	FOREIGN KEY (id_post) REFERENCES posts(id)
);

CREATE TABLE comments_details(
    id SERIAL PRIMARY KEY,
    id_user INT,
    id_post INT,
    id_comment INT,
    comment_release DATE,
	FOREIGN KEY (id_user) REFERENCES users(id),
	FOREIGN KEY (id_post) REFERENCES posts(id),
	FOREIGN KEY (id_comment) REFERENCES comments(id)
);

CREATE VIEW usersVw
AS
SELECT users.id, username as user, roles.rolname as rol
FROM users
INNER JOIN roles ON users.id_rol=roles.id;

CREATE PROCEDURE createUser(usr_name VARCHAR(20),  usr_pass VARCHAR(255), usr_email VARCHAR(255) , usr_rol INT)
LANGUAGE SQL
AS $$
INSERT INTO users(username,password,email,id_rol) VALUES(usr_name,usr_pass,usr_email,usr_rol)
$$;
