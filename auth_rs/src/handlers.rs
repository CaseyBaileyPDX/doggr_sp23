use auth_rs::models::{LoggedInUser, User};
use auth_rs::{AppError, Claims, JWTKeys};
use axum::http::StatusCode;
use axum::{Extension, Json};
use chrono::{Utc};
use jsonwebtoken::{encode, Header};

use sqlx::PgPool;
use tracing::log::{error, info};

#[axum_macros::debug_handler]
pub async fn create_user(
	Extension(conn): Extension<PgPool>,
	Json(credentials): Json<User>,
) -> Result<StatusCode, AppError> {

	// Try creating a new user
	let res = try_create_user(&conn, &credentials).await?;
	// Return that user if it was successfully created
	Ok(res)
}

async fn try_create_user(conn: &PgPool, credentials: &User) -> Result<StatusCode, anyhow::Error> {
	if credentials.email.is_empty() {
		anyhow::bail!("Invalid email")
	}

	if credentials.password.is_empty() {
		anyhow::bail!("Invalid password!")
	}

	let current_time = Utc::now();
	let hashed_pw = bcrypt::hash(&credentials.password, 10).unwrap();

	let new_user = sqlx::query("INSERT INTO users (name, email, password, pet_type, img_url, created_at, updated_at, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)")
		.bind("MyName".to_string()) // Use email address as the person's name as well for speed
		.bind(&credentials.email)
		.bind(&hashed_pw)
		.bind("Dog".to_string())
		.bind("dog.jpg".to_string())
		.bind(current_time)
		.bind(current_time)
		.bind("User".to_string())
		.execute(conn)
		.await?;

	let was_created = new_user.rows_affected() > 0;

	if was_created {
		Ok(StatusCode::CREATED)
	} else {
		anyhow::bail!("Unable to create new user account!")
	}
}

#[axum_macros::debug_handler]
pub async fn login(
	Extension(conn): Extension<PgPool>,
	Json(credentials): Json<User>,
) -> Result<(StatusCode, Json<LoggedInUser>), AppError> {
	let res = try_login(&conn, &credentials).await?;
	Ok(res)
}

async fn try_login(
	conn: &PgPool,
	credentials: &User,
) -> Result<(StatusCode, Json<LoggedInUser>), anyhow::Error> {
	if credentials.email.is_empty() {
		anyhow::bail!("Invalid email!")
	}

	if credentials.password.is_empty() {
		anyhow::bail!("Invalid password!")
	}

	// Note here we're supplying User as the type of response we're expecting from this query.
	// SQLx will connect to our real database AT COMPILE TIME to verify this is safe!  Amazing!
	let user = sqlx::query_as::<_, User>("SELECT email, password from users where users.email=$1")
		.bind(&credentials.email)
		.fetch_optional(conn)
		.await?;

	// if the user exists
	if let Some(user) = user {
		//check pw
		if let Ok(_check) = bcrypt::verify(&credentials.password, &user.password) {
			info!("Bcrypt verified properly!");
		} else {
			error!(
                "Bcrypt verify failed between {} and {} ",
                &credentials.password, &user.password
            );
		}

		// Claims are our "payload" from fastify
		let claims = Claims {
			email: credentials.email.to_owned(),
		};
		// This is the piece we had a lib handle for us in Fastify
		let keys = JWTKeys::new();
		// Actually encrypt the token from raw parts
		let token = encode(&Header::default(), &claims, &keys.encoding)?;
		// Create our proper response type from the token
		let new_user = LoggedInUser { token };

		// Send response, including our freshly generated and encrypted token
		Ok((StatusCode::OK, Json(new_user)))
	} else {
		// user does not exist
		anyhow::bail!("User does not exist!")
	}
}
