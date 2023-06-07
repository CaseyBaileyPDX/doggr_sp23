mod routes;
mod handlers;

use anyhow::Result as AnyResult;

use dotenvy::dotenv;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

use auth_rs::EnvOptions;
use axum::{Extension};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing::log::{info, trace};

use tracing_subscriber;
use crate::routes::routes;

#[tokio::main]
async fn main() -> AnyResult<()> {
    // Just like javascript!
    dotenv().ok();
    // This inits our logging
    tracing_subscriber::fmt::init();
    trace!("Application initialized.");

    // This runs our listen server
    run().await.unwrap();
    Ok(())
}

async fn run() -> AnyResult<()> {
    let conn = establish_connection().await?;
    let cors = CorsLayer::new().allow_origin(Any);
    let app =  routes().layer(cors).layer(Extension(conn)); // We need routing and handlers

    let addr = SocketAddr::from(([127, 0, 0, 1], 3333));
    info!("Listening on {}", &addr);

    axum::Server::bind(&addr)
      .serve(app.into_make_service())
      .await?;

    Ok(())

}

async fn establish_connection() -> AnyResult<PgPool> {
    info!("Creating connection to database");
    let env_opts = EnvOptions::new();

    let pool = PgPoolOptions::new()
      .max_connections(10)
      .connect(&env_opts.database_url)
      .await?;

    info!("Database connection established!");

    return Ok(pool);
}

