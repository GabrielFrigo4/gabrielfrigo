use axum::{Json, Router, routing::get};
use local_ip_address::list_afinet_netifas;
use serde::Serialize;
use std::{
    net::{IpAddr, Ipv4Addr, Ipv6Addr, SocketAddr},
    time::Instant,
};
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

const WWW: &str = "www";
const RESUME: &str = "resume";
const DOMAIN: &str = "gabrielfrigo.dev.br";
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

    let addr_v4 = SocketAddr::new(IpAddr::V4(Ipv4Addr::LOCALHOST), PORT);
    let addr_v6 = SocketAddr::new(IpAddr::V6(Ipv6Addr::LOCALHOST), PORT);

    let listener_v4 = TcpListener::bind(addr_v4).await;
    let listener_v6 = TcpListener::bind(addr_v6).await;

    print_startup_banner();

    match (listener_v4, listener_v6) {
        (Ok(l_v4), Ok(l_v6)) => {
            let app_v4 = app.clone();
            tokio::spawn(async move {
                axum::serve(l_v4, app_v4).await.unwrap();
            });
            axum::serve(l_v6, app).await
        }
        (Ok(l_v4), Err(_)) => {
            println!("⚠️ IPv6 indisponível. Rodando apenas em IPv4.");
            axum::serve(l_v4, app).await
        }
        (Err(_), Ok(l_v6)) => {
            println!("⚠️ IPv4 indisponível. Rodando apenas em IPv6.");
            axum::serve(l_v6, app).await
        }
        (Err(e), Err(_)) => {
            panic!("Erro fatal: Nenhuma interface local disponível: {}", e);
        }
    }
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
    print_urls("domain", &format!("{}.{}", WWW, DOMAIN), false);
    print_urls("domain", &format!("{}.{}", RESUME, DOMAIN), false);

    if let Ok(network_interfaces) = list_afinet_netifas() {
        for (name, ip) in network_interfaces.iter() {
            let host = match ip {
                IpAddr::V6(ipv6) => format!("[{}]", ipv6),
                IpAddr::V4(ipv4) => ipv4.to_string(),
            };
            print_urls(name, &host, true);
        }
    }

    if let Ok(hosts_file) = std::fs::read_to_string("/etc/hosts") {
        for line in hosts_file.lines() {
            let clean_line = line.split('#').next().unwrap_or("").trim();
            
            if clean_line.is_empty() {
                continue;
            }

            let mut parts = clean_line.split_whitespace();
            
            if let Some(ip_str) = parts.next() {
                let label = match ip_str.parse::<IpAddr>() {
                    Ok(IpAddr::V4(_)) => "ip4-host",
                    Ok(IpAddr::V6(_)) => "ip6-host",
                    Err(_) => "host-invalid",
                };

                for hostname in parts {
                    print_urls(label, hostname, true);
                }
            }
        }
    }
}
