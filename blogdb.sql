
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE blogs (
    blog_id SERIAL PRIMARY KEY,         
    creator_name VARCHAR(255),          
    creator_user_id INT REFERENCES users(user_id), 
    title VARCHAR(255) NOT NULL,       
    body TEXT NOT NULL,                 
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    CONSTRAINT fk_user
        FOREIGN KEY (creator_user_id) REFERENCES users(user_id)
);
SELECT 
    current_user AS user_name, 
    inet_client_addr() AS client_host, 
    inet_server_addr() AS server_host, 
    inet_server_port() AS server_port;


