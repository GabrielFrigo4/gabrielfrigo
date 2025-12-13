use axum::{
	routing::{get, get_service},
	Router,
};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
	let serve_dir_service = get_service(ServeDir::new("static"))
	.handle_error(|error| async move {
		(
			axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to handle request: {}", error),
		)
	});

	let app = Router::new()
	.route("/api/hello", get(api_hello))
	.fallback_service(serve_dir_service);

	let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
	println!(">> Static site at http://{}", listener.local_addr().unwrap());
	println!(">> API endpoint at http://{}/api/hello", listener.local_addr().unwrap());

	axum::serve(listener, app).await.unwrap();
}

async fn api_hello() -> &'static str {
	"Hello from the API!"
}