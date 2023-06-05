use crate::handlers::{create_user, login};
use axum::routing::post;
use axum::Router;

pub fn routes() -> Router {
	Router::new()
		.route("/users", post(create_user))
		.route("/login", post(login))
}
