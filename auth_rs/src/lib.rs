use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use jsonwebtoken::{DecodingKey, EncodingKey};
use serde::{Deserialize, Serialize};

pub struct EnvOptions {
	pub database_url: String,
	pub auth_secret: String,
}

impl EnvOptions {
	pub fn new() -> EnvOptions {
		EnvOptions {

			database_url: std::env::var("DATABASE_URL").unwrap(),
			auth_secret: std::env::var("AUTH_SECRET").unwrap(),
		}
	}
}

pub struct JWTKeys {
	pub encoding: EncodingKey,
	pub decoding: DecodingKey,
}

impl JWTKeys {
	pub fn new() -> JWTKeys {
		let secret = EnvOptions::new().auth_secret.into_bytes();

		Self {
			encoding: EncodingKey::from_secret(&secret),
			decoding: DecodingKey::from_secret(&secret),
		}
	}
}

pub mod models {
	use serde::{Deserialize, Serialize};

	#[derive(sqlx::FromRow, Serialize, Deserialize)]
	pub struct User {
		pub email: String,
		pub password: String,
	}

	#[derive(Serialize, Deserialize)]
	pub struct LoggedInUser {
		pub token: String,
	}

}

// IGNORE ALL BELOW THIS, I REPEAT IGNORE ME ABANDON HOPE ALL YE WHO ENTER HERE
// THIS IS THE ONLY PLACE IN THE MICROSERVICE WHERE RUST'S COMPLEXITY ISN'T HIDDEN
// LAST WARNING GO BACK NOW
// Error type wrapper for convenience
pub struct AppError(anyhow::Error);

// Tell axum how to convert `AppError` into a response.
impl IntoResponse for AppError {
	fn into_response(self) -> Response {
		(
			StatusCode::INTERNAL_SERVER_ERROR,
			format!("Something went wrong: {}", self.0),
		)
			.into_response()
	}
}

// This enables using `?` on functions that return `Result<_, anyhow::Error>` to turn them into
// `Result<_, AppError>`. That way you don't need to do that manually.
impl<E> From<E> for AppError
	where
		E: Into<anyhow::Error>,
{
	fn from(err: E) -> Self {
		Self(err.into())
	}
}
