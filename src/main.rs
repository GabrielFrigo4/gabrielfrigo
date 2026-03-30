use axum::{Router, routing::get};
use local_ip_address::list_afinet_netifas;
use tokio::net::TcpListener;
use tower_http::services::ServeDir;

const PORT: u16 = 8080;

#[tokio::main]
async fn main() {
    let api_routes =
        Router::new().route("/status", get(|| async { "API do Gabriel rodando 100%!" }));

    let app = Router::new()
        .nest("/api", api_routes)
        .fallback_service(ServeDir::new("public"));

    let addr = format!("[::]:{}", PORT);
    let listener = TcpListener::bind(&addr).await.unwrap();

    println!("🚀 Servidor rodando! Acessível em:\n");

    let local_prefix = format!("[{}]", "local");
    println!("🌐 {:<8} http://localhost:{}", local_prefix, PORT);

    if let Ok(network_interfaces) = list_afinet_netifas() {
        for (name, ip) in network_interfaces.iter() {
            let prefix = format!("[{}]", name);

            if ip.is_ipv6() {
                println!("🌐 {:<8} http://[{}]:{}", prefix, ip, PORT);
            } else {
                println!("🌐 {:<8} http://{}:{}", prefix, ip, PORT);
            }
        }
    }

    println!("\n⚙️  Testar API: http://localhost:{}/api/status", PORT);

    axum::serve(listener, app).await.unwrap();
}
