
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
    n_posts INT NOT NULL,
    n_comments INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id),
	CONSTRAINT user_username UNIQUE (username),
	CONSTRAINT user_email UNIQUE (email)

);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    post_release DATE,
	FOREIGN KEY (id_user) REFERENCES users(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    id_post INT NOT NULL,
    content TEXT NOT NULL,
    comment_release DATE,
    FOREIGN KEY(id_post) REFERENCES posts(id),
    FOREIGN KEY(id_user) REFERENCES users(id)
);
 
-- CREATE TABLE posts_users(
--     id SERIAL PRIMARY KEY,
--     id_post INT NOT NULL,
-- 	FOREIGN KEY (id_post) REFERENCES posts(id)
-- );

-- CREATE TABLE comments_details(
--     id SERIAL PRIMARY KEY,
--     id_user INT,
--     id_post INT,
--     id_comment INT,
--     comment_release DATE,
-- 	FOREIGN KEY (id_user) REFERENCES users(id),
-- 	FOREIGN KEY (id_post) REFERENCES posts(id),
-- 	FOREIGN KEY (id_comment) REFERENCES comments(id)
-- );

CREATE VIEW usersVw
AS
SELECT users.id, username as user, roles.rolname as rol
FROM users
INNER JOIN roles ON users.id_rol=roles.id;

CREATE PROCEDURE newUser(usr_name VARCHAR(20),  usr_pass VARCHAR(255), usr_email VARCHAR(255) , usr_rol INT)
LANGUAGE SQL
AS $$
INSERT INTO users(username,password,email,id_rol) VALUES(usr_name,usr_pass,usr_email,usr_rol)
$$;

CREATE PROCEDURE newPost(IN title VARCHAR(50), IN content TEXT, IN id_user INT)
LANGUAGE SQL
AS $$
INSERT INTO posts(id_user, title, content, post_release) VALUES (id_user, title, content, NOW())
$$



INSERT INTO roles(rolname) VALUES("administrador"),("usuario");

CREATE FUNCTION getPostsUser(IN user_id INT, id_base INT, max INT) 
RETURNS TABLE (id INT, title VARCHAR(50), author VARCHAR(20), release DATE)
AS $$
    IF NOT NULL (user_id) THEN
        SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
        INNER JOIN users ON posts.id_user = users.id
        WHERE posts.id IS BETWEEN id_base and id_base+max;
    ELSE
        SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
        INNER JOIN users ON posts.id_user = users.id
        WHERE posts.id_user is user_id AND
        posts.id IS BETWEEN id_base and id_base+max;
$$
LANGUAGE SQL;

CREATE FUNCTION getPosts(id_base INT, max INT)
RETURNS TABLE (id INT, title VARCHAR(50), author VARCHAR(20), release DATE)
LANGUAGE plpgsql
AS $$
    SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
    INNER JOIN users ON posts.id_user = users.id
    WHERE posts.id IS BETWEEN id_base and id_base+max;
$$
