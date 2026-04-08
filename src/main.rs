use axum::{Json, Router, routing::get};
use local_ip_address::list_afinet_netifas;
use serde::Serialize;
use std::{net::IpAddr, time::Instant};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

const DOMAIN: &str = "gabrielfrigo.dev.br";
const LOCALHOST: &str = "localhost";
const PORT: u16 = 443 * 80;

#[derive(Serialize)]
struct StatusResponse {
    status: String,
    version: String,
    uptime_seconds: u64,
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let start_time = Instant::now();
    let app = build_router(start_time);

    let addr = format!("[::1]:{}", PORT);
    let listener = TcpListener::bind(&addr).await?;

    print_startup_banner();

    axum::serve(listener, app).await
}

fn build_router(start_time: Instant) -> Router {
    let api_routes = Router::new()
        .route("/health", get(|| async { "OK" }))
        .route(
            "/status",
            get(move || {
                let uptime = start_time.elapsed().as_secs();
                async move {
                    Json(StatusResponse {
                        status: "up".to_string(),
                        version: env!("CARGO_PKG_VERSION").to_string(),
                        uptime_seconds: uptime,
                    })
                }
            }),
        );

    Router::new()
        .nest("/api", api_routes)
        .fallback_service(ServeDir::new("public"))
}

fn print_startup_banner() {
    println!("🚀 Servidor rodando! Acessível em:\n");

    let print_urls = |label: &str, host: &str, include_port: bool| {
        let suffix = if include_port {
            format!(":{}", PORT)
        } else {
            String::new()
        };
        let formatted_label = format!("[{}]", label);

        println!("🌐 {:<10} http://{}{}", formatted_label, host, suffix);
        println!("🌐 {:<10} https://{}{}\n", formatted_label, host, suffix);
    };

    print_urls("domain", DOMAIN, false);
    print_urls("local", LOCALHOST, true);

    if let Ok(network_interfaces) = list_afinet_netifas() {
        for (name, ip) in network_interfaces.iter() {
            let host = match ip {
                IpAddr::V6(ipv6) => format!("[{}]", ipv6),
                IpAddr::V4(ipv4) => ipv4.to_string(),
            };
            print_urls(name, &host, true);
        }
    }
}
