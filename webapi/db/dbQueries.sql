
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    rolname VARCHAR(20) NOT NULL
);
	
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    nick VARCHAR(20) NOT NULL,
    password varchar(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    posts_n INT NOT NULL,
    comments_n INT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
	CONSTRAINT user_nick UNIQUE (nick),
	CONSTRAINT user_email UNIQUE (email)
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(50) NOT NULL,
    content TEXT,
    post_release DATE,
	FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    comment_release DATE,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
 
-- CREATE TABLE posts_users(
--     id SERIAL PRIMARY KEY,
--     post_id INT NOT NULL,
-- 	FOREIGN KEY (post_id) REFERENCES posts(id)
-- );

-- CREATE TABLE comments_details(
--     id SERIAL PRIMARY KEY,
--     user_id INT,
--     post_id INT,
--     comment_id INT,
--     comment_release DATE,
-- 	FOREIGN KEY (user_id) REFERENCES users(id),
-- 	FOREIGN KEY (post_id) REFERENCES posts(id),
-- 	FOREIGN KEY (comment_id) REFERENCES comments(id)
-- );

-- VIEWS


INSERT INTO roles(rolname) VALUES('administrador'),('usuario');

-------------------------------------------------------------------------------------
----------------                    VIEWS                           -----------------
-------------------------------------------------------------------------------------

CREATE VIEW usersVw
AS
SELECT users.id, nick as user, roles.rolname as rol
FROM users
INNER JOIN roles ON users.rol_id=roles.id;

CREATE VIEW vwPosts
AS
SELECT posts.id AS id,
	   posts.title AS title,
       users.id as author_id,
	   users.nick AS author,
	   posts.post_release as post_date
FROM posts INNER JOIN users ON posts.user_id=users.id;

-------------------------------------------------------------------------------------
----------------                PROCEDURES                          -----------------
-------------------------------------------------------------------------------------

CREATE PROCEDURE newUser(IN nick VARCHAR(20), IN  password VARCHAR(255), IN email VARCHAR(255), IN rol_id INT)
LANGUAGE SQL
AS $$
INSERT INTO users(nick, password, email, rol_id, posts_n, comments_n) VALUES(nick,password,email,rol_id, 0 ,0 )
$$;

CREATE PROCEDURE newPost(IN title VARCHAR(50), IN content TEXT, IN user_id INT)
LANGUAGE SQL
AS $$
INSERT INTO posts(user_id, title, content, post_release) VALUES (user_id, title, content, CURRENT_TIMESTAMP)
$$;


-------------------------------------------------------------------------------------
----------------                FUNCTIONS                          -----------------
-------------------------------------------------------------------------------------


CREATE FUNCTION getPost(post_id INT)
RETURNS TABLE(id INT, title VARCHAR(50), content TEXT, author_id INT, author VARCHAR(255), post_release DATE)
AS $$
BEGIN
    RETURN QUERY
    SELECT posts.id AS id,
        posts.title AS title,
        posts.content AS content,
        users.id as author_id,
        users.nick AS author,
        posts.post_release as post_release
    FROM posts INNER JOIN users ON posts.user_id=users.id
	WHERE posts.id = post_id;
END
$$
LANGUAGE 'plpgsql';



CREATE FUNCTION getPostsUser(IN user_id INT, id_base INT, max INT) 
RETURNS TABLE (id INT, title VARCHAR(50), author VARCHAR(20), release DATE)
AS $$
    IF NOT NULL (user_id) THEN
        SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.id IS BETWEEN id_base and id_base+max;
    ELSE
        SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
        INNER JOIN users ON posts.user_id = users.id
        WHERE posts.user_id is user_id AND
        posts.id IS BETWEEN id_base and id_base+max;
$$
LANGUAGE SQL;

CREATE FUNCTION getPosts(id_base INT, max INT)
RETURNS TABLE (id INT, title VARCHAR(50), author VARCHAR(20), release DATE)
LANGUAGE plpgsql
AS $$
    SELECT posts.id AS id, posts.title AS title, users.username AS author, posts.post_release AS release
    INNER JOIN users ON posts.user_id = users.id
    WHERE posts.id IS BETWEEN id_base and id_base+max;
$$
;





